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

| Token      | Hex       | Role                                                              |
| ---------- | --------- | ----------------------------------------------------------------- |
| `navy`     | `#2226B7` | Primary. Headings, primary buttons, active states, table headers. |
| `ember`    | `#FE7C09` | Accent. Fills, rules, large display type on navy.                 |
| `electric` | `#0000FF` | **Excluded from the UI palette.** See below.                      |

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
3. **Text on an ember fill is ink**, never white and never navy.
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

**Buttons** — heights 32 / 36 / 40. Variants: primary (navy fill, white text), secondary (border, ink text), ghost (no border), destructive (danger fill). One primary button per view. If two actions look equally important, one of them is not.

**Inputs** — 36px, 4px radius, real label above the field. Placeholder is never the label. Visible focus ring in navy. Error state shows a message, not just a red border.

**Cards** — used when content is a distinct object that could stand alone. Not used to wrap every section.

**Tables** — the primary interface of this product. Navy header row, white text, mono uppercase labels. Row height 44px. Zebra striping in `surface`. Subtle hover. No vertical rules.

**Badges** — 2px radius, mono 12px. Neutral by default.

**Empty states** — one line saying what would be here and one action. No illustration.

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
