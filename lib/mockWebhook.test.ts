import { describe, it, expect } from "vitest";
import {
  listDeliveries,
  countByStatus,
  computeSuccessRate,
  nextOutboxAction,
  shouldRetry,
} from "./mockWebhook";

describe("mockWebhook", () => {
  it("loads seed deliveries", () => {
    const list = listDeliveries();
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list[0]?.id).toMatch(/^del_/);
  });

  it("counts statuses", () => {
    const counts = countByStatus();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(listDeliveries().length);
  });

  it("exposes success rate from KPIs", () => {
    expect(computeSuccessRate()).toBeGreaterThan(0);
    expect(computeSuccessRate()).toBeLessThanOrEqual(1);
  });

  it("routes outbox actions", () => {
    const pending = listDeliveries().find((d) => d.status === "pending");
    expect(pending && nextOutboxAction(pending)).toBe("send");
    const delivered = listDeliveries().find((d) => d.status === "delivered");
    expect(delivered && nextOutboxAction(delivered)).toBe("noop");
  });

  it("retry policy respects max attempts", () => {
    const dlq = listDeliveries().find((d) => d.status === "dead_letter");
    expect(dlq && shouldRetry(dlq)).toBe(false);
  });
});
