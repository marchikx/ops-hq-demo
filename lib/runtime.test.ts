import { describe, expect, it } from "vitest";
import { createIncidentRuntime } from "./runtime";

describe("incident runtime wiring", () => {
  it("drives webhook-relay to DLQ under forced failures", async () => {
    const rt = createIncidentRuntime();
    const state = await rt.runWebhookIncident(true);
    expect(state.deliveryStatus).toBe("dead");
    expect(state.logs.some((l) => l.message.includes("OutboxStore"))).toBe(true);
    expect(state.logs.some((l) => l.message.includes("signed=true"))).toBe(true);
  });

  it("acks Stripe webhook 202 and applies payment work", async () => {
    const rt = createIncidentRuntime();
    const state = await rt.runPaymentIncident();
    expect(state.paymentAck).toBe("202");
    expect(state.paymentOutcome).toBe("applied");
    expect(state.paymentWorkId).toBeTruthy();
  });

  it("denies LLM near cap and unknown model", () => {
    const rt = createIncidentRuntime();
    const state = rt.runLlmDeny();
    expect(state.llmDecision).not.toBe("allow");
    expect(state.logs.some((l) => /denied|BUDGET|UNKNOWN/i.test(l.message))).toBe(
      true,
    );
    expect(state.logs.some((l) => l.message.includes("UNKNOWN_MODEL"))).toBe(true);
  });
});
