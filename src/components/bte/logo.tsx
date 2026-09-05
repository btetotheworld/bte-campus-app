import { cn } from "@/lib/utils";

type LogoVariant = "navy" | "white";

function BteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        transform="translate(16 16)"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      >
        <line x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(45)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(90)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(135)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(180)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(225)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(270)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
        <line transform="rotate(315)" x1="0" y1="-13.5" x2="0" y2="-6.5" />
      </g>
    </svg>
  );
}

export function BteLogo({
  variant = "navy",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Believers Tech Expo"
      className={cn(
        "inline-flex items-center gap-3",
        variant === "navy" ? "text-navy" : "text-white",
        className
      )}
    >
      <BteMark className="size-8" />
      <span
        aria-hidden="true"
        className="flex flex-col font-semibold uppercase"
      >
        <span className="text-h3">Believers</span>
        <span className="text-h3">Tech Expo</span>
      </span>
    </span>
  );
}

export function BteMarkIcon({ className }: { className?: string }) {
  return <BteMark className={cn("size-8 text-navy", className)} />;
}
