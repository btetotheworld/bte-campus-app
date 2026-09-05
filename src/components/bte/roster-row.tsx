import type { ReactNode } from "react";

export function RosterRow({
  name,
  role,
  status,
}: {
  name: string;
  role: string;
  status?: ReactNode;
}) {
  return (
    <div className="flex h-(--control-height-touch) items-center justify-between gap-4 border-b border-border">
      <div className="overflow-hidden">
        <p className="truncate text-body font-semibold text-ink">{name}</p>
        <p className="truncate text-sm text-ink-muted">{role}</p>
      </div>
      {status}
    </div>
  );
}
