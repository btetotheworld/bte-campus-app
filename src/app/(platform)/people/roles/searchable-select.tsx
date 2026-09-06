"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export type SearchableOption = {
  value: string;
  label: string;
};

export function SearchableSelect({
  id,
  name,
  options,
  disabled,
  emptyMessage,
}: {
  id: string;
  name: string;
  options: SearchableOption[];
  disabled?: boolean;
  emptyMessage: string;
}) {
  const listId = `${id}-list`;
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  }, [options, query]);

  function choose(option: SearchableOption) {
    setValue(option.value);
    setQuery(option.label);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={disabled}
        value={open ? query : (selected?.label ?? "")}
        onChange={(event) => {
          setQuery(event.target.value);
          setValue("");
          setOpen(true);
        }}
        onFocus={() => {
          setQuery(selected?.label ?? query);
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-24 w-full overflow-y-auto rounded border border-border bg-bg shadow-floating"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-muted">{emptyMessage}</li>
          ) : (
            filtered.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
              >
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
