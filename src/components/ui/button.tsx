import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded text-sm font-semibold whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy text-white hover:bg-navy-hover active:bg-navy-active",
        secondary:
          "border border-border bg-bg text-ink hover:bg-surface active:bg-surface-2",
        ghost: "text-ink hover:bg-surface active:bg-surface-2",
        destructive:
          "bg-danger text-white hover:bg-danger-hover active:bg-danger-active",
      },
      size: {
        sm: "h-(--control-height-sm) px-3",
        default: "h-(--control-height) px-3",
        lg: "h-(--control-height-lg) px-3",
        touch: "h-(--control-height-touch) px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
