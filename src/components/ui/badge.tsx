import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-sm px-2 font-mono text-mono-sm font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-ink",
        // Ink on ember is 6.71:1; white on ember is 2.59:1 and must never
        // appear. text-ink is re-applied after `className` below so a
        // consumer cannot merge in a competing text colour.
        ember: "bg-ember text-ink",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

function Badge({
  className,
  variant = "neutral",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({ variant }),
        className,
        variant === "ember" && "text-ink"
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
