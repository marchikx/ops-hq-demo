import Link from "next/link";
import { Shell } from "@/components/Shell";
import { StatCard } from "@/components/StatCard";
import { IncidentConsole } from "@/components/IncidentConsole";
import { loadSeed } from "@/lib/seed";
import { computeSuccessRate } from "@/lib/mockWebhook";
import {
  pendingExposureCents,
  formatMoney,
  isLedgerReconciled,
} from "@/lib/mockPayments";
import { remainingBudgetUsd, utilizationRatio } from "@/lib/mockLlm";

export default function OverviewPage() {
  const seed = loadSeed();
  const kpis = seed.overviewKpis;
  const successPct = (computeSuccessRate() * 100).toFixed(1);
  const pendingUsd = seed.payments.find(
    (p) => p.status === "pending" && p.currency === "USD",
  );

  return (
    <Shell>
      <section className="mb-10 animate-rise">
        <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">
          Andrii Marchuk · portfolio proof
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl leading-tight">
          Press a button. Watch a failure that usually costs money.
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm sm:text-base">
          This page is for hirers. The buttons run real code from my GitHub
          libraries in your browser. The cards below are sample data only — so
          the screen looks complete, not because this is production traffic.
        </p>
        <p className="text-xs text-muted mt-2">
          Hirer guide:{" "}
          <a
            className="text-accent underline"
            href="https://github.com/marchikx/ops-hq-demo/blob/main/FOR_HIRERS.md"
          >
            FOR_HIRERS.md
          </a>
        </p>
      </section>

      <div className="mb-10">
        <IncidentConsole />
      </div>

      <p className="text-xs text-muted mb-4">Sample snapshot (seed JSON) — not production:</p>
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
          hint="Seed ledger view"
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
            pendingUsd
              ? formatMoney(pendingExposureCents(), "USD")
              : formatMoney(0, "USD")
          }
          hint="Unsettled USD exposure (seed)"
        />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/deliveries"
          className="group rounded-lg border border-border bg-panel/70 p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">Deliveries table</h2>
          <p className="text-sm text-muted">Sample queue rows (seed).</p>
        </Link>
        <Link
          href="/payments"
          className="group rounded-lg border border-border bg-panel/70 p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">Payments table</h2>
          <p className="text-sm text-muted">Sample ledger rows (seed).</p>
        </Link>
        <Link
          href="/llm-budget"
          className="group rounded-lg border border-border bg-panel/70 p-5 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-medium mb-2 group-hover:text-accent">Budget table</h2>
          <p className="text-sm text-muted">Sample spend snapshot (seed).</p>
        </Link>
      </section>
    </Shell>
  );
}
