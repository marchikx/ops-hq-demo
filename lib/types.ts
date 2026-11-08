export type DeliveryStatus =
  | "pending"
  | "delivered"
  | "retrying"
  | "dead_letter";

export interface Delivery {
  id: string;
  event: string;
  destination: string;
  status: DeliveryStatus;
  attempts: number;
  lastAttemptAt: string | null;
  latencyMs: number | null;
  error?: string;
}

export type PaymentStatus =
  | "succeeded"
  | "pending"
  | "failed"
  | "in_transit";

export interface PaymentEntry {
  id: string;
  type: "charge" | "refund" | "payout";
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  customerRef: string;
  createdAt: string;
}

export interface LlmModelSpend {
  model: string;
  spendUsd: number;
  calls: number;
}

export interface LlmBlock {
  at: string;
  reason: string;
  requestedUsd: number;
}

export interface LlmBudgetSnapshot {
  dailyCeilingUsd: number;
  spentTodayUsd: number;
  requestCountToday: number;
  blockedCountToday: number;
  lastGateDecision: "allow" | "deny";
  topModels: LlmModelSpend[];
  recentBlocks: LlmBlock[];
}

export interface OverviewKpis {
  webhookSuccessRate: number;
  ledgerReconciled: boolean;
  llmUnderBudget: boolean;
  openIncidents: number;
}

export interface SeedData {
  meta: { environment: string; region: string; updatedAt: string };
  deliveries: Delivery[];
  payments: PaymentEntry[];
  llmBudget: LlmBudgetSnapshot;
  overviewKpis: OverviewKpis;
}
