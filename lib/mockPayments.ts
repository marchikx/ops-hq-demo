/**
 * Thin mock of a payment ledger / reconciliation view — seed data only.
 */
import type { PaymentEntry, PaymentStatus } from "./types";
import { loadSeed } from "./seed";

export function listPayments(): PaymentEntry[] {
  return loadSeed().payments;
}

export function totalVolumeByCurrency(): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const p of listPayments()) {
    if (p.status !== "succeeded" && p.status !== "in_transit") continue;
    const signed =
      p.type === "refund" ? -p.amountCents : p.amountCents;
    totals[p.currency] = (totals[p.currency] ?? 0) + signed;
  }
  return totals;
}

export function filterByStatus(status: PaymentStatus): PaymentEntry[] {
  return listPayments().filter((p) => p.status === status);
}

export function isLedgerReconciled(): boolean {
  return loadSeed().overviewKpis.ledgerReconciled;
}

export function formatMoney(cents: number, currency: string): string {
  const value = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function pendingExposureCents(): number {
  return listPayments()
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amountCents, 0);
}
