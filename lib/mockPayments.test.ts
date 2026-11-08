import { describe, it, expect } from "vitest";
import {
  listPayments,
  totalVolumeByCurrency,
  formatMoney,
  pendingExposureCents,
  isLedgerReconciled,
} from "./mockPayments";

describe("mockPayments", () => {
  it("lists ledger entries", () => {
    expect(listPayments().length).toBeGreaterThanOrEqual(2);
  });

  it("aggregates volume by currency", () => {
    const totals = totalVolumeByCurrency();
    expect(Object.keys(totals).length).toBeGreaterThan(0);
  });

  it("formats money", () => {
    expect(formatMoney(49900, "EUR")).toContain("499");
  });

  it("sums pending exposure", () => {
    expect(pendingExposureCents()).toBeGreaterThanOrEqual(0);
  });

  it("reads reconciliation flag", () => {
    expect(typeof isLedgerReconciled()).toBe("boolean");
  });
});
