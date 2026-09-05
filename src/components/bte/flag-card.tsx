import type { ReactNode } from "react";

export type FlagSeverity = "warning" | "danger";

export function FlagCard({
  title,
  body,
  action,
  severity,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  severity: FlagSeverity;
}) {
  const severityLabel = severity === "danger" ? "Urgent" : "Needs attention";

  return (
    <article className="flex flex-col gap-3 bg-surface p-4">
      <p className="meta-label text-ink-muted">{severityLabel}</p>
      <h3 className="text-h3">{title}</h3>
      <p className="text-body text-ink-secondary">{body}</p>
      {action}
    </article>
  );
}
