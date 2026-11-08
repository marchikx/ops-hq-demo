import { Shell } from "@/components/Shell";
import { Badge } from "@/components/Badge";
import {
  getBudgetSnapshot,
  remainingBudgetUsd,
  utilizationRatio,
  assertLlmAllowed,
  topModelBySpend,
} from "@/lib/mockLlm";

export default function LlmBudgetPage() {
  const b = getBudgetSnapshot();
  const probeAllow = assertLlmAllowed(1.25);
  const probeDeny = assertLlmAllowed(45);

  return (
    <Shell title="LLM spend gate">
      <p className="text-sm text-muted mb-6">
        Daily ceiling guard before vendor calls — same contract as a production
        cost gate, exercised on seed spend.
      </p>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-lg border border-border bg-panel p-4">
          <span className="text-xs text-muted uppercase">Ceiling</span>
          <p className="text-2xl font-semibold tabular-nums">
            ${b.dailyCeilingUsd.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <span className="text-xs text-muted uppercase">Spent today</span>
          <p className="text-2xl font-semibold tabular-nums">
            ${b.spentTodayUsd.toFixed(2)}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(100, utilizationRatio() * 100)}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <span className="text-xs text-muted uppercase">Remaining</span>
          <p className="text-2xl font-semibold tabular-nums text-accent">
            ${remainingBudgetUsd().toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 text-sm font-mono">
        <span className="text-muted">Requests: {b.requestCountToday}</span>
        <span className="text-muted">Blocked: {b.blockedCountToday}</span>
        <span className="text-muted">Top model: {topModelBySpend()}</span>
        <Badge status={b.lastGateDecision} />
      </div>
      <h2 className="text-sm font-medium mb-3">Gate probes (mock)</h2>
      <ul className="text-sm font-mono space-y-2 mb-10 text-muted">
        <li>
          assertLlmAllowed(1.25) →{" "}
          <Badge status={probeAllow} />
        </li>
        <li>
          assertLlmAllowed(45) → <Badge status={probeDeny} />
        </li>
      </ul>
      <h2 className="text-sm font-medium mb-3">Model breakdown</h2>
      <div className="overflow-x-auto rounded-lg border border-border mb-10">
        <table className="w-full text-sm">
          <thead className="bg-surface text-muted text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Spend USD</th>
              <th className="px-4 py-3 text-left">Calls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {b.topModels.map((m) => (
              <tr key={m.model} className="bg-panel/50">
                <td className="px-4 py-3 font-mono text-xs">{m.model}</td>
                <td className="px-4 py-3 tabular-nums">${m.spendUsd.toFixed(2)}</td>
                <td className="px-4 py-3 tabular-nums">{m.calls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-sm font-medium mb-3">Recent blocks</h2>
      <ul className="space-y-2 text-xs font-mono text-muted">
        {b.recentBlocks.map((blk) => (
          <li key={blk.at} className="border border-border rounded px-3 py-2 bg-surface">
            {blk.at} · {blk.reason} · est ${blk.requestedUsd.toFixed(2)}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
