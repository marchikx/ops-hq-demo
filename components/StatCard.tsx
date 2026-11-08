export function StatCard({
  label,
  value,
  hint,
  ok,
}: {
  label: string;
  value: string;
  hint?: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {hint ? (
        <span
          className={`text-xs ${ok === false ? "text-amber-400" : ok ? "text-accent" : "text-muted"}`}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
