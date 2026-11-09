/**
 * Wires portfolio libraries into the browser demo (in-memory).
 * Import graph: webhook-relay · stripe-payments-ledger · llm-guardrails
 */
import { OutboxStore, processOnce } from "webhook-relay";
import {
  createEventLedger,
  createPaymentStateMachine,
  createWebhookHandler,
  signStripePayload,
} from "stripe-payments-ledger";
import {
  assertLlmAllowed,
  LlmNotAllowedError,
  InMemoryCostStore,
  recordLlmSpend,
} from "llm-guardrails";

export type IncidentLog = { at: string; message: string };

export type IncidentState = {
  logs: IncidentLog[];
  deliveryId: string | null;
  deliveryStatus: string;
  paymentAck: string | null;
  paymentWorkId: string | null;
  paymentOutcome: string | null;
  llmDecision: string;
};

function log(message: string): IncidentLog {
  return { at: new Date().toISOString(), message };
}

export function createIncidentRuntime() {
  const outbox = new OutboxStore();
  const ledger = createEventLedger();
  const stateMachine = createPaymentStateMachine();
  const handler = createWebhookHandler(ledger, stateMachine);
  const stripeSecret = "demo_whsec_ops_hq";
  const costStore = new InMemoryCostStore();
  // Seed near-cap spend so deny path is visible on expensive models
  costStore.recordSpend("demo-org", 49.99);

  return {
    outbox,
    ledger,
    stateMachine,
    handler,
    costStore,
    stripeSecret,

    async runWebhookIncident(forceFail = true): Promise<IncidentState> {
      const logs: IncidentLog[] = [];
      const msg = outbox.enqueue({
        targetUrl: "https://demo.local/hooks/ingest",
        body: JSON.stringify({ event: "incident.ping", n: Date.now() }),
      });
      logs.push(log(`Enqueued ${msg.id} via webhook-relay OutboxStore`));

      let attempts = 0;
      let lastStatus = "pending";
      let deliveryId = msg.id;
      // Advance virtual clock past exponential backoff between retries
      let virtualNow = Date.now();

      while (attempts < 8) {
        attempts += 1;
        const result = await processOnce({
          store: outbox,
          workerId: "ops-hq-demo",
          leaseMs: 5_000,
          maxAttempts: 5,
          hmacSecret: "demo-hmac",
          now: virtualNow,
          fetch: async (_url, init) => {
            const headers = init?.headers ?? {};
            const signed = Boolean(headers["x-signature"] ?? headers["X-Signature"]);
            logs.push(log(`Worker POST (signed=${signed}) attempt ${attempts}`));
            if (forceFail) {
              return { ok: false, status: 503, statusText: "Service Unavailable" };
            }
            return { ok: true, status: 200 };
          },
        });
        lastStatus = result.outcome;
        logs.push(log(`processOnce → ${result.outcome}`));
        if (result.outcome === "delivered" || result.outcome === "dead") {
          deliveryId = "messageId" in result ? result.messageId : msg.id;
          break;
        }
        if (result.outcome === "idle") break;
        if (result.outcome === "retry") {
          virtualNow = result.nextAttemptAt + 1;
        }
      }

      return {
        logs,
        deliveryId,
        deliveryStatus: lastStatus,
        paymentAck: null,
        paymentWorkId: null,
        paymentOutcome: null,
        llmDecision: "n/a",
      };
    },

    async runPaymentIncident(): Promise<IncidentState> {
      const logs: IncidentLog[] = [];
      const body = JSON.stringify({
        id: `evt_demo_${Date.now()}`,
        type: "payment_intent.succeeded",
        data: { object: { id: "pi_demo", amount: 9900, currency: "usd" } },
      });
      const ts = Math.floor(Date.now() / 1000);
      const sig = signStripePayload(body, stripeSecret, ts);
      const ack = handler.handleStripeWebhook(body, sig, stripeSecret);
      logs.push(
        log(
          `Stripe handleStripeWebhook → ${ack.status} workId=${ack.workId} duplicate=${ack.duplicate}`,
        ),
      );
      const work = handler.processWork(ack.workId);
      logs.push(
        log(
          `processWork → ${work.outcome} state=${work.state} paymentId=${work.paymentId}`,
        ),
      );
      return {
        logs,
        deliveryId: null,
        deliveryStatus: "n/a",
        paymentAck: String(ack.status),
        paymentWorkId: ack.workId,
        paymentOutcome: work.outcome,
        llmDecision: "n/a",
      };
    },

    runLlmDeny(): IncidentState {
      const logs: IncidentLog[] = [];
      let reason = "unknown";
      try {
        // Near cap + expensive model → BUDGET_HARD_CAP_EXCEEDED
        assertLlmAllowed(
          "gpt-4o",
          80_000,
          80_000,
          {
            action: "ops-hq-demo",
            organizationId: "demo-org",
            expectedRevenueUpliftUsd: 100,
          },
          { store: costStore, dailyHardCapUsd: 50 },
        );
        logs.push(log("Unexpected allow for near-cap gpt-4o"));
        reason = "allow";
      } catch (e) {
        reason = e instanceof LlmNotAllowedError ? e.reason : String(e);
        logs.push(log(`assertLlmAllowed denied: ${reason}`));
      }
      try {
        assertLlmAllowed(
          "totally-unknown-model",
          10,
          10,
          {
            action: "ops-hq-demo",
            organizationId: "demo-org",
            expectedRevenueUpliftUsd: 1,
          },
          { store: costStore },
        );
      } catch (e2) {
        const r2 = e2 instanceof LlmNotAllowedError ? e2.reason : String(e2);
        logs.push(log(`unknown model denied: ${r2}`));
      }
      return {
        logs,
        deliveryId: null,
        deliveryStatus: "n/a",
        paymentAck: null,
        paymentWorkId: null,
        paymentOutcome: null,
        llmDecision: reason,
      };
    },

    runLlmAllowSmall(): IncidentState {
      const logs: IncidentLog[] = [];
      try {
        const { correlationId } = assertLlmAllowed(
          "gpt-4o-mini",
          20,
          10,
          {
            action: "ops-hq-small",
            organizationId: "demo-org-b",
            expectedRevenueUpliftUsd: 5,
          },
          { store: costStore, dailyHardCapUsd: 50 },
        );
        recordLlmSpend(
          correlationId,
          { action: "ops-hq-small", organizationId: "demo-org-b" },
          "gpt-4o-mini",
          20,
          10,
          { store: costStore },
        );
        logs.push(log(`LLM allow + record spend (${correlationId})`));
        return {
          logs,
          deliveryId: null,
          deliveryStatus: "n/a",
          paymentAck: null,
          paymentWorkId: null,
          paymentOutcome: null,
          llmDecision: "allow",
        };
      } catch (e) {
        const blocked = e instanceof LlmNotAllowedError ? e.reason : String(e);
        logs.push(log(`LLM blocked: ${blocked}`));
        return {
          logs,
          deliveryId: null,
          deliveryStatus: "n/a",
          paymentAck: null,
          paymentWorkId: null,
          paymentOutcome: null,
          llmDecision: blocked,
        };
      }
    },
  };
}

export type IncidentRuntime = ReturnType<typeof createIncidentRuntime>;
