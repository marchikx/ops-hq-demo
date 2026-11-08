const styles: Record<string, string> = {
  delivered: "bg-accent/15 text-accent border-accent/30",
  succeeded: "bg-accent/15 text-accent border-accent/30",
  allow: "bg-accent/15 text-accent border-accent/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  retrying: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  in_transit: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  dead_letter: "bg-red-500/10 text-red-400 border-red-500/25",
  deny: "bg-red-500/10 text-red-400 border-red-500/25",
  failed: "bg-red-500/10 text-red-400 border-red-500/25",
};

export function Badge({ status }: { status: string }) {
  const cls = styles[status] ?? "bg-panel text-muted border-border";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium font-mono ${cls}`}
    >
      {status}
    </span>
  );
}
