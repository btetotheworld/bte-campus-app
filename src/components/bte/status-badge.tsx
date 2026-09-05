import { Badge } from "@/components/ui/badge";

export type StatusTone = "neutral" | "success" | "warning" | "danger";

const TONE_CLASS = {
  neutral: "bg-surface-2 text-ink",
  success: "bg-surface-2 text-success",
  warning: "bg-surface-2 text-warning",
  danger: "bg-surface-2 text-danger",
} as const;

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <Badge variant="neutral" className={TONE_CLASS[tone]}>
      {label}
    </Badge>
  );
}
