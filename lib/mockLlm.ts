/**
 * Thin mock of an LLM spend gate / daily ceiling — no vendor calls.
 */
import type { LlmBudgetSnapshot } from "./types";
import { loadSeed } from "./seed";

export function getBudgetSnapshot(): LlmBudgetSnapshot {
  return loadSeed().llmBudget;
}

export function remainingBudgetUsd(): number {
  const b = getBudgetSnapshot();
  return Math.max(0, b.dailyCeilingUsd - b.spentTodayUsd);
}

export function utilizationRatio(): number {
  const b = getBudgetSnapshot();
  if (b.dailyCeilingUsd <= 0) return 0;
  return b.spentTodayUsd / b.dailyCeilingUsd;
}

export type GateVerdict = "allow" | "deny";

export function assertLlmAllowed(estimatedCostUsd: number): GateVerdict {
  const b = getBudgetSnapshot();
  const projected = b.spentTodayUsd + estimatedCostUsd;
  if (projected > b.dailyCeilingUsd) {
    return "deny";
  }
  return "allow";
}

export function underDailyCeiling(): boolean {
  return loadSeed().overviewKpis.llmUnderBudget;
}

export function topModelBySpend(): string | null {
  const models = getBudgetSnapshot().topModels;
  if (models.length === 0) return null;
  const sorted = [...models].sort((a, b) => b.spendUsd - a.spendUsd);
  return sorted[0]?.model ?? null;
}
