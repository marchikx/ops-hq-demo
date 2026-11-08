import Link from "next/link";
import { Shell } from "@/components/Shell";
import { StatCard } from "@/components/StatCard";
import { loadSeed } from "@/lib/seed";
import { computeSuccessRate } from "@/lib/mockWebhook";
import { pendingExposureCents, formatMoney, isLedgerReconciled } from "@/lib/mockPayments";
import { remainingBudgetUsd, utilizationRatio } from "@/lib/mockLlm";

export default function OverviewPage() {
  const seed = loadSeed();
  const kpis = seed.overviewKpis;
  const successPct = (computeSuccessRate() * 100).toFixed(1);
  const pendingEur = seed.payments.find(
    (p) => p.status === "pending" && p.currency === "USD"
  );

  return (
    <Shell title="Operations overview">
      <p className="text-muted text-sm mb-8 max-w-2xl">
        Single-pane health for outbound webhooks, payment ledger reconciliation, and
        LLM spend gates — wired from seed JSON, mirroring portfolio library boundaries.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Webhook success"
          value={`${successPct}%`}
          hint={kpis.openIncidents > 0 ? `${kpis.openIncidents} incident open` : "Healthy"}
          ok={kpis.webhookSuccessRate >= 0.9 && kpis.openIncidents === 0}
        />
        <StatCard
          label="Ledger"
          value={isLedgerReconciled() ? "Reconciled" : "Drift"}
          hint="Stripe-style ledger mock"
          ok={isLedgerReconciled()}
        />
        <StatCard
          label="LLM budget left"
          value={`$${remainingBudgetUsd().toFixed(2)}`}
          hint={`${(utilizationRatio() * 100).toFixed(0)}% of daily ceiling`}
          ok={kpis.llmUnderBudget}
        />
        <StatCard
          label="Pending charges"
          value={
            pendingEur
              ? formatMoney(pendingExposureCents(), "USD")
              : formatMoney(0, "USD")
          }
          hint="Unsettled exposure"
        />
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/deliveries"
          className="group rounded-lg border border-border bg-panel p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">Deliveries</h2>
          <p className="text-sm text-muted">
            Outbox queue, retries, and DLQ — webhook-relay pattern.
          </p>
        </Link>
        <Link
          href="/payments"
          className="group rounded-lg border border-border bg-panel p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">Payments</h2>
          <p className="text-sm text-muted">
            Ledger entries, refunds, payouts — stripe-ledger pattern.
          </p>
        </Link>
        <Link
          href="/llm-budget"
          className="group rounded-lg border border-border bg-panel p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">LLM budget</h2>
          <p className="text-sm text-muted">
            Daily ceiling and allow/deny gate — llm-guardrails pattern.
          </p>
        </Link>
      </section>
      <p className="mt-8 text-xs text-muted font-mono">
        env: {seed.meta.environment} · {seed.meta.region} · updated{" "}
        {new Date(seed.meta.updatedAt).toLocaleString()}
      </p>
    </Shell>
  );
}
