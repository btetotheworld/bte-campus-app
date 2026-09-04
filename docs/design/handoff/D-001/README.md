# D-001 Component vocabulary

Handoff before Pass 2. Status: `draft`. Approval is the founder's.

This file is the resolved bundle. Token Check's `#1B1E92` is discarded. Use this directory and `docs/DESIGN_SYSTEM.md`, not a second colour sheet.

## Interaction colours

Derived: base mixed 8% (hover) and 15% (active) toward ink. Encoded as `color-mix` in `src/app/globals.css`.

| Token           | Resolves to | White on it |
| --------------- | ----------- | ----------- |
| `navy-hover`    | `#2125AA`   | 11.00 : 1   |
| `navy-active`   | `#21249F`   | 11.55 : 1   |
| `danger-hover`  | `#982B2B`   | 7.73 : 1    |
| `danger-active` | `#8E2A2A`   | 8.35 : 1    |

Do not use `#1B1E92`. That is navy 20% toward black.

## Control metrics

Spacing scale is for gaps. Control padding is height minus line-height.

| Height | Line height | Vertical padding | Use                     |
| ------ | ----------- | ---------------- | ----------------------- |
| 32     | 20          | 6px              | Compact button          |
| 36     | 24          | 6px              | Default button, input   |
| 40     | 24          | 8px              | Large button            |
| 44     | 24          | 10px             | Touch target, table row |

Horizontal padding: 12px. Textareas: 12px all round.

Badge: mono-sm 12/18, 2px padding each side, 22px tall. Padding-based, not height-based.

## Ember badge

Approved. Ink on ember is 6.71:1. White on ember is forbidden. The component hardcodes ink.

## What is not a `bte/` component

- Button, Input, Textarea, Label, Table, Badge, Toggle, ToggleGroup: restyle `components/ui/`.
- Breadcrumb: folded into PageHeader.
- Sidebar and shell: `app/(platform)/layout.tsx`, sprint 1.

## Genuinely new in `components/bte/`

FormField, DataTable, StatusBadge, EmptyState, PageHeader, Stepper, SegmentedControl, DefinitionList, FlagCard, StatTile, Chip, StepProgress, RosterRow.

Compositions, not forks: SegmentedControl wraps ToggleGroup. Chip wraps Toggle. FormField wraps Input, Textarea and Label. DataTable wraps Table. StatusBadge wraps Badge.

## Pass 2

Build against this file and `docs/DESIGN_SYSTEM.md`. Name `D-001` on the PR.
