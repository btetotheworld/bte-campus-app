# DESIGN_SYSTEM.md

Authoritative for anything visual in this repository. Where this document and a request disagree, this document wins unless a human overrides it in the current conversation.

Brand ownership sits with the BTE Graphics and Brand Design Lead. Values marked **provisional** below are engineering proposals awaiting sign-off. Everything else is fixed.

---

## 1. Philosophy

The interface should read as though a product designer made deliberate choices, not as though a model produced something impressive.

- Clarity over decoration.
- Consistency over novelty.
- Whitespace over borders.
- Hierarchy over colour.
- Motion communicates a state change or it does not exist.
- When two solutions work, take the simpler one.

**Do not produce:** gradients, glassmorphism, decorative shadows, cards around everything, floating rounded panels, multiple competing accents, decorative icons, animation without a state change, or more than one accent colour on a screen.

---

## 2. Colour

### Brand palette — fixed

| Token      | Hex       | Role                                                                             |
| ---------- | --------- | -------------------------------------------------------------------------------- |
| `navy`     | `#2226B7` | Primary. Headings, primary buttons, table headers. Hover and active are derived. |
| `ember`    | `#FE7C09` | Accent. Fills, rules, large display type on navy.                                |
| `electric` | `#0000FF` | **Excluded from the UI palette.** See below.                                     |

### Measured contrast — these are constraints, not guidance

| Pair              | Ratio        | Verdict                                                              |
| ----------------- | ------------ | -------------------------------------------------------------------- |
| Navy on white     | 10.35 : 1    | Safe everywhere                                                      |
| White on navy     | 10.35 : 1    | Safe everywhere                                                      |
| Ember on white    | **2.59 : 1** | **Fails everything.** Not text, not icons, not meaningful borders    |
| Ember on navy     | 3.99 : 1     | Large text (24px+, or 19px bold) and UI graphics only. Not body text |
| Electric on navy  | **1.20 : 1** | Forbidden in either direction                                        |
| Electric on white | 8.59 : 1     | Passes, but see below                                                |

### Rules that follow

1. **Ember never carries meaning on white.** It may be a fill, a rule, or a block of colour. It may not be text, an icon a user must read, or a border that indicates state. If information depends on it, use navy or ink.
2. **Ember on navy is display only.** Large headings and graphic elements. Never body copy.
3. **Text on an ember fill is ink**, never white and never navy. This includes the ember badge. Ink on ember is 6.71:1. The component enforces ink. Do not accept a colour prop that could put white on ember.
4. **Electric is not in the UI palette.** It passes on white but sits 1.20:1 against navy, and navy is the dominant surface colour in this product. Any layout change that brings the two together produces an invisible element. Excluding it removes a whole class of accessibility failure for a colour that adds nothing navy does not already do. Keep it for brand collateral where the layout is controlled.
5. **One accent per screen.** If a screen already uses ember, it does not also use a semantic colour for emphasis.

### Neutrals — provisional

The brand palette has no neutrals. These are an engineering proposal pending sign-off.

| Token           | Hex       |
| --------------- | --------- |
| `bg`            | `#FFFFFF` |
| `surface`       | `#F7F7F5` |
| `surface-2`     | `#EFEFEC` |
| `border`        | `#E2E2DE` |
| `border-strong` | `#C9C9C4` |
| `ink`           | `#1A1A1A` |
| `ink-secondary` | `#4A4A48` |
| `ink-muted`     | `#6B6B6B` |

`ink-muted` on white is 5.33:1. Do not go lighter for anything a user must read.

### Semantic — provisional

`success #0F6E56` · `warning #854F0B` · `danger #A32D2D` · `info` uses navy.

Semantic colour appears only when it carries meaning. A neutral chip is the default; a red one means something is wrong.

### Interaction states

Not brand tokens. Derived: the base fill mixed 8% (hover) and 15% (active) toward `ink`. Do not hardcode a third mix, and do not use `#1B1E92` (navy mixed 20% toward black). White on each of these passes.

| Token           | Mix              | Resolves to | White on it |
| --------------- | ---------------- | ----------- | ----------- |
| `navy-hover`    | navy 92% + ink   | `#2125AA`   | 11.00 : 1   |
| `navy-active`   | navy 85% + ink   | `#21249F`   | 11.55 : 1   |
| `danger-hover`  | danger 92% + ink | `#982B2B`   | 7.73 : 1    |
| `danger-active` | danger 85% + ink | `#8E2A2A`   | 8.35 : 1    |

Encoded in `globals.css` as `color-mix`, so any future fill colour gets the same states without a new hex.

---

## 3. Typography

**Archivo** for everything. **IBM Plex Mono** for metadata, IDs, timestamps, code and table labels. Both load through `next/font/google`. No third family.

| Token     | Size / line height | Weight | Use                     |
| --------- | ------------------ | ------ | ----------------------- |
| `display` | 40 / 48            | 600    | Page title, sparingly   |
| `h1`      | 30 / 38            | 600    | Page heading            |
| `h2`      | 22 / 30            | 600    | Section                 |
| `h3`      | 18 / 26            | 600    | Sub-section, card title |
| `body-lg` | 16 / 26            | 400    | Lead paragraph          |
| `body`    | 15 / 24            | 400    | Default                 |
| `sm`      | 13 / 20            | 400    | Secondary, help text    |
| `mono-sm` | 12 / 18            | 500    | Labels, IDs, timestamps |

Nine sizes. Do not add a tenth.

Two weights: 400 and 600. Never 700. Establish hierarchy with weight and colour before reaching for size.

Mono labels are uppercase with letter spacing. This is the only place uppercase is permitted.

---

## 4. Spacing

4px base. Allowed values only:

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`

Nothing else. No `gap-[13px]`.

| Value | Use                        |
| ----- | -------------------------- |
| 4     | Icon to text               |
| 8     | Tightly related elements   |
| 12    | Inside a component         |
| 16    | Standard component spacing |
| 24    | Between components         |
| 32    | Between groups             |
| 48    | Between sections           |
| 64+   | Page-level                 |

Related elements sit closer. Unrelated elements sit further apart. That is how hierarchy is built here, before any border is considered.

The scale governs layout gaps between things. Padding inside a fixed-height control is arithmetic, not a choice, and is not a reason to add 6px or 10px to this scale. A 36px input with 15/24 text has exactly 6px above and below.

| Height | Line height | Vertical padding |
| ------ | ----------- | ---------------- |
| 32     | 20          | 6px              |
| 36     | 24          | 6px              |
| 40     | 24          | 8px              |
| 44     | 24          | 10px             |

Horizontal padding stays on the scale: 12px. Textareas have no fixed height, so they use the scale: 12px all round. That is the one place to normalise.

These values live as `--control-height-*` and `--control-padding-*` in `globals.css`, not as `--spacing-*`. Do not write `p-[6px]` or `h-[44px]`.

---

## 5. Layout

- Content max width `1200px`. Data-dense tables may use `1440px`.
- Page padding: 16 mobile, 24 tablet, 32 desktop.
- Do not stretch content across the full viewport.

---

## 6. Radius

**Maximum 4px on any rectangle.** This is a brand constraint, not a preference, and it is the single most visible thing separating this product from generic AI output.

| Token         | Value  | Use                                                     |
| ------------- | ------ | ------------------------------------------------------- |
| `radius-sm`   | 2px    | Chips, small controls                                   |
| `radius`      | 4px    | Everything else: buttons, inputs, cards, panels, modals |
| `radius-full` | 9999px | Avatars only                                            |

No 8px. No 12px. No 16px. Pills are for avatars and nothing else.

---

## 7. Borders and elevation

Default border: `1px solid border`.

Borders are for inputs, tables, dividers, and boundaries between interactive regions. They are not the default way to separate content — spacing is.

**Shadows are near-absent.** Only genuinely floating layers get one: dropdowns, popovers, modals, toasts. One shadow value:

`0 4px 12px rgba(26,26,26,0.10)`

Cards do not get shadows. Cards mostly do not get borders either — a card is a surface change and some spacing.

---

## 8. Components

shadcn/ui provides the primitives in `components/ui/`. Do not fork them. Configure through tokens; compose in `components/bte/`.

**Buttons.** Heights 32 / 36 / 40, and 44 for touch contexts (section 12). Variants: primary (navy fill, white text), secondary (border, ink text), ghost (no border), destructive (danger fill). Hover and active use the derived tokens in section 2. One primary button per view. If two actions look equally important, one of them is not. Button is a restyled `components/ui/` primitive, not a `bte/` component.

**Inputs.** 36px, 4px radius, real label above the field. Placeholder is never the label. Visible focus ring in navy. Error state shows a message, not just a red border.

**Cards.** Used when content is a distinct object that could stand alone. Not used to wrap every section.

**Tables.** The primary interface of this product. Navy header row, white text, mono uppercase labels. Row height 44px. Zebra striping in `surface`. Subtle hover. No vertical rules.

**Badges.** 2px radius, mono 12px / 18 line height, 2px padding each side (22px tall). Padding-based, not height-based. Neutral by default. An ember badge is approved: ink on ember is 6.71:1. White on ember is 2.59:1 and must never appear. The component hardcodes ink on the ember variant. Nobody can pass a text colour.

**Empty states.** One line saying what would be here and one action. No illustration.

**Page header.** Title, optional description, optional action, breadcrumbs folded in. No standalone breadcrumb component.

**Shell.** Sidebar and app chrome live in `app/(platform)/layout.tsx`. Not a `bte/` component.

**Ownership.** Restyle in `components/ui/`: Button, Input, Textarea, Label, Table, Badge, Toggle, ToggleGroup. Compose in `components/bte/`: FormField, DataTable, StatusBadge, EmptyState, PageHeader, Stepper, SegmentedControl, DefinitionList, FlagCard, StatTile, Chip, StepProgress, RosterRow. SegmentedControl wraps ToggleGroup. Chip wraps Toggle. FormField wraps Input, Textarea and Label. DataTable wraps Table. StatusBadge wraps Badge.

---

## 9. Icons

Lucide, outline, one family. Sizes: 16 inline, 18 controls, 20 emphasis, 24 navigation. Stroke 1.5 throughout.

An icon appears because it communicates something. Not because a row looked empty. Icon-only buttons need an accessible label.

---

## 10. Motion

Durations: 150ms for state changes, 200ms for entrances, 250ms maximum. Nothing longer.

`ease-out` entering, `ease-in` leaving.

Animate: hover, focus, press, dropdown, modal, expand, collapse, loading, toast.

Do not animate: page loads, list items appearing one after another, anything decorative, anything that draws attention without a state change behind it.

Respect `prefers-reduced-motion`.

---

## 11. States

Every interactive component implements: default, hover, focus, active, disabled, loading. Every data view implements: loading, empty, error, populated.

A component with only a default state is not finished.

---

## 12. Accessibility

- 4.5:1 for body text, 3:1 for large text and UI graphics. Section 2 is the reference.
- Visible focus on everything reachable by keyboard. Never remove the outline without replacing it.
- Semantic HTML. A `div` with `onClick` is not a button.
- Colour never carries meaning alone. Pair it with text, an icon or a shape.
- Touch targets 44px minimum.

---

## 13. For AI agents

Before you write a component:

1. Does one already exist in `components/ui/` or `components/bte/`?
2. Does an existing token solve this?
3. Is there a simpler version with fewer elements?

Then check what you produced:

- Every spacing value from section 4?
- Every colour a token?
- Every radius 4px or less?
- Every font size from section 3?
- Any shadow that is not on a floating layer?
- Any card that could be spacing instead?
- Any icon that carries no information?
- Any animation without a state change behind it?
- Anything that could be removed without losing usability?

If the answer to that last one is yes, remove it.
