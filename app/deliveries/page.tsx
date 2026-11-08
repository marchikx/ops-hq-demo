import { Shell } from "@/components/Shell";
import { Badge } from "@/components/Badge";
import {
  listDeliveries,
  countByStatus,
  nextOutboxAction,
} from "@/lib/mockWebhook";

export default function DeliveriesPage() {
  const deliveries = listDeliveries();
  const counts = countByStatus();

  return (
    <Shell title="Webhook outbox">
      <p className="text-sm text-muted mb-6">
        Mock outbox mirroring an async relay: 202 accept → worker → retries → DLQ.
      </p>
      <div className="flex flex-wrap gap-3 mb-8 text-sm font-mono text-muted">
        {Object.entries(counts).map(([k, v]) => (
          <span key={k} className="px-2 py-1 rounded bg-surface border border-border">
            {k}: {v}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-muted text-xs uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3">Next action</th>
              <th className="px-4 py-3 hidden md:table-cell">Destination</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deliveries.map((d) => (
              <tr key={d.id} className="bg-panel/50 hover:bg-panel">
                <td className="px-4 py-3 font-mono text-xs">{d.id}</td>
                <td className="px-4 py-3">{d.event}</td>
                <td className="px-4 py-3">
                  <Badge status={d.status} />
                </td>
                <td className="px-4 py-3 tabular-nums">{d.attempts}</td>
                <td className="px-4 py-3 font-mono text-xs text-accent">
                  {nextOutboxAction(d)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted truncate max-w-[200px]">
                  {d.destination}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deliveries.some((d) => d.error) ? (
        <div className="mt-6 text-sm">
          <h3 className="font-medium mb-2">Recent errors</h3>
          <ul className="space-y-2 text-muted font-mono text-xs">
            {deliveries
              .filter((d) => d.error)
              .map((d) => (
                <li key={d.id}>
                  {d.id}: {d.error}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </Shell>
  );
}
