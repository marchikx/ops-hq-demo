import { Shell } from "@/components/Shell";
import { Badge } from "@/components/Badge";
import {
  listPayments,
  totalVolumeByCurrency,
  formatMoney,
  isLedgerReconciled,
} from "@/lib/mockPayments";

export default function PaymentsPage() {
  const payments = listPayments();
  const volumes = totalVolumeByCurrency();

  return (
    <Shell title="Payment ledger">
      <p className="text-sm text-muted mb-4">
        Immutable-style ledger mock: charges, refunds, and connect payouts with
        reconciliation flag.
      </p>
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`px-3 py-1 rounded border ${
            isLedgerReconciled()
              ? "border-accent/30 text-accent bg-accent/10"
              : "border-amber-500/30 text-amber-400"
          }`}
        >
          Reconciliation: {isLedgerReconciled() ? "OK" : "REVIEW"}
        </span>
        {Object.entries(volumes).map(([ccy, cents]) => (
          <span key={ccy} className="text-muted font-mono">
            Net {ccy}: {formatMoney(cents, ccy)}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-muted text-xs uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden sm:table-cell">Customer</th>
              <th className="px-4 py-3 hidden md:table-cell">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id} className="bg-panel/50 hover:bg-panel">
                <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                <td className="px-4 py-3 capitalize">{p.type}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatMoney(p.amountCents, p.currency)}
                </td>
                <td className="px-4 py-3">
                  <Badge status={p.status} />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-muted">
                  {p.customerRef}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-muted">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
