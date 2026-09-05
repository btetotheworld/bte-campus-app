"use client";

import { Toggle } from "@/components/ui/toggle";

export function Chip({
  pressed,
  onPressedChange,
  children,
}: {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: string;
}) {
  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={pressed}
      onPressedChange={onPressedChange}
      className="rounded-sm"
    >
      {children}
    </Toggle>
  );
}
