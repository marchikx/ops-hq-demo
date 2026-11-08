import { describe, it, expect } from "vitest";
import {
  getBudgetSnapshot,
  remainingBudgetUsd,
  utilizationRatio,
  assertLlmAllowed,
  topModelBySpend,
} from "./mockLlm";

describe("mockLlm", () => {
  it("loads budget snapshot", () => {
    const b = getBudgetSnapshot();
    expect(b.dailyCeilingUsd).toBe(50);
    expect(b.spentTodayUsd).toBeGreaterThan(0);
  });

  it("computes remaining budget", () => {
    const b = getBudgetSnapshot();
    expect(remainingBudgetUsd()).toBeCloseTo(
      b.dailyCeilingUsd - b.spentTodayUsd,
      2
    );
  });

  it("utilization is between 0 and 1 for demo data", () => {
    const r = utilizationRatio();
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(1);
  });

  it("denies when estimate exceeds ceiling", () => {
    expect(assertLlmAllowed(100)).toBe("deny");
    expect(assertLlmAllowed(0.01)).toBe("allow");
  });

  it("picks top model", () => {
    expect(topModelBySpend()).toBeTruthy();
  });
});
