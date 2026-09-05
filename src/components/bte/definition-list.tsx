import type { ReactNode } from "react";

export type DefinitionItem = {
  label: string;
  value: ReactNode;
};

export function DefinitionList({ items }: { items: DefinitionItem[] }) {
  return (
    <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <dt className="meta-label text-ink-muted">{item.label}</dt>
          <dd className="text-body text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
