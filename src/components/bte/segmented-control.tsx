"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type SegmentedOption = {
  value: string;
  label: string;
};

export function SegmentedControl({
  value,
  onValueChange,
  options,
  ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedOption[];
  ariaLabel: string;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next);
      }}
      variant="outline"
      size="sm"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
