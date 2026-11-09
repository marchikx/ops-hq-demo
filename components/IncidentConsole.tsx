"use client";

import { useMemo, useState } from "react";
import { createIncidentRuntime, type IncidentState } from "@/lib/runtime";

const empty: IncidentState = {
  logs: [],
  deliveryId: null,
  deliveryStatus: "idle",
  paymentAck: null,
  paymentWorkId: null,
  paymentOutcome: null,
  llmDecision: "idle",
};

export function IncidentConsole() {
  const runtime = useMemo(() => createIncidentRuntime(), []);
  const [state, setState] = useState<IncidentState>(empty);
  const [busy, setBusy] = useState(false);

  async function run(kind: "webhook" | "payment" | "llm-deny" | "llm-allow") {
    setBusy(true);
    try {
      if (kind === "webhook") setState(await runtime.runWebhookIncident(true));
      else if (kind === "payment") setState(await runtime.runPaymentIncident());
      else if (kind === "llm-deny") setState(runtime.runLlmDeny());
      else setState(runtime.runLlmAllowSmall());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="incident"
      className="rounded-xl border border-border bg-panel/80 p-5 shadow-[0_0_0_1px_rgba(20,184,166,0.08)] animate-rise"
      data-testid="incident-console"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Live proof</p>
          <h2 className="text-xl font-semibold tracking-tight">Run incident (60s)</h2>
          <p className="text-sm text-muted mt-1 max-w-xl">
            Real imports: <code className="text-accent/90">webhook-relay</code>,{" "}
            <code className="text-accent/90">stripe-payments-ledger</code>,{" "}
            <code className="text-accent/90">llm-guardrails</code> — in-memory, seeded demo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            data-testid="btn-webhook"
            onClick={() => run("webhook")}
            className="px-3 py-2 rounded-md bg-accent text-black text-sm font-medium hover:bg-accent-dim disabled:opacity-50 transition"
          >
            Webhook → DLQ
          </button>
          <button
            type="button"
            disabled={busy}
            data-testid="btn-payment"
            onClick={() => run("payment")}
            className="px-3 py-2 rounded-md border border-border text-sm hover:border-accent/50 disabled:opacity-50 transition"
          >
            Payment 202→work
          </button>
          <button
            type="button"
            disabled={busy}
            data-testid="btn-llm-deny"
            onClick={() => run("llm-deny")}
            className="px-3 py-2 rounded-md border border-border text-sm hover:border-accent/50 disabled:opacity-50 transition"
          >
            LLM deny
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 mb-4 text-sm">
        <div className="rounded-lg bg-surface border border-border p-3">
          <div className="text-muted text-xs mb-1">Delivery</div>
          <div data-testid="delivery-status" className="font-mono">
            {state.deliveryStatus}
          </div>
        </div>
        <div className="rounded-lg bg-surface border border-border p-3">
          <div className="text-muted text-xs mb-1">Payment</div>
          <div data-testid="payment-status" className="font-mono">
            {state.paymentAck ?? "—"}
            {state.paymentOutcome ? ` · ${state.paymentOutcome}` : ""}
          </div>
        </div>
        <div className="rounded-lg bg-surface border border-border p-3">
          <div className="text-muted text-xs mb-1">LLM gate</div>
          <div data-testid="llm-status" className="font-mono">
            {state.llmDecision}
          </div>
        </div>
      </div>
      <ol
        data-testid="incident-log"
        className="max-h-48 overflow-auto rounded-lg bg-black/40 border border-border p-3 font-mono text-xs space-y-1"
      >
        {state.logs.length === 0 ? (
          <li className="text-muted">Press a button — logs appear here.</li>
        ) : (
          state.logs.map((l, i) => (
            <li key={`${l.at}-${i}`}>
              <span className="text-muted">{l.at.slice(11, 19)}</span> {l.message}
            </li>
          ))
        )}
      </ol>
    </section>
  );
}
