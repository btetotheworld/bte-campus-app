export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-surface p-4">
      <p className="meta-label text-ink-muted">{label}</p>
      <p className="text-h2 text-navy">{value}</p>
      {hint ? <p className="text-sm text-ink-muted">{hint}</p> : null}
    </div>
  );
}
