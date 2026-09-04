"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded text-sm font-semibold whitespace-nowrap transition-colors outline-none hover:bg-surface disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-navy data-[state=on]:text-white [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent text-ink",
        outline: "border border-border bg-bg text-ink hover:bg-surface",
      },
      size: {
        sm: "h-(--control-height-sm) min-w-(--control-height-sm) px-2",
        default: "h-(--control-height) min-w-(--control-height) px-3",
        lg: "h-(--control-height-lg) min-w-(--control-height-lg) px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
