"use client";

import * as React from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      // Sonner only accepts these as CSS variables, not as Tailwind classes.
      style={
        {
          "--normal-bg": "var(--color-bg)",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "rounded border border-border bg-bg text-ink shadow-floating",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
