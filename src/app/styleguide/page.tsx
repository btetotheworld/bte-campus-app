import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "BTE Platform styleguide",
  description: "Working reference for every token in docs/DESIGN_SYSTEM.md.",
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="meta-label text-ink-muted">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <header className="mb-16">
        <p className="meta-label mb-2 text-ink-muted">
          Design system reference
        </p>
        <h1 className="text-h1">Styleguide</h1>
        <p className="mt-3 max-w-prose text-body text-ink-secondary">
          Every token from docs/DESIGN_SYSTEM.md, rendered as it actually
          compiles. This is a working reference for engineers, not a marketing
          page. If a value shown here does not match the document, the document
          wins and this page is wrong.
        </p>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Colour                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-24">
        <SectionLabel>Colour</SectionLabel>
        <h2 className="mb-8 text-h2">Brand</h2>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded border border-border">
            <div className="h-24 rounded-t bg-navy" />
            <div className="p-4">
              <p className="meta-label mb-1 text-ink-muted">--color-navy</p>
              <p className="text-body font-semibold">navy · #2226B7</p>
              <p className="mt-1 text-sm text-ink-muted">
                10.35:1 on white. Safe everywhere. Primary, headings, primary
                buttons, active states, table headers.
              </p>
            </div>
          </div>

          <div className="rounded border border-border">
            <div className="ember-fill flex h-24 items-end rounded-t p-3">
              <span className="meta-label">Ink text on ember fill</span>
            </div>
            <div className="p-4">
              <p className="meta-label mb-1 text-ink-muted">--color-ember</p>
              <p className="text-body font-semibold">ember · #FE7C09</p>
              <p className="mt-1 text-sm text-danger">
                2.59:1 on white. Fails everything as text. Fill only, with ink
                text on top. Never white, never navy, never used as text or an
                icon colour.
              </p>
            </div>
          </div>
        </div>

        <p className="mb-12 max-w-prose text-sm text-ink-muted">
          Electric (#0000FF) is deliberately excluded from this palette and from
          globals.css. It sits at 1.20:1 against navy, and navy is the dominant
          surface in this product, so it is not a token an agent can reach for
          here.
        </p>

        <h2 className="mb-8 text-h2">
          Neutrals: provisional, pending brand sign-off
        </h2>
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border border-border">
            <div className="h-16 rounded-t border-b border-border bg-bg" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">bg</p>
              <p className="text-sm">#FFFFFF</p>
              <p className="text-sm text-ink-muted">Page background</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-surface" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">surface</p>
              <p className="text-sm">#F7F7F5</p>
              <p className="text-sm text-ink-muted">1.07:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-surface-2" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">surface-2</p>
              <p className="text-sm">#EFEFEC</p>
              <p className="text-sm text-ink-muted">1.15:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-border" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">border</p>
              <p className="text-sm">#E2E2DE</p>
              <p className="text-sm text-ink-muted">1.30:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-border-strong" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">border-strong</p>
              <p className="text-sm">#C9C9C4</p>
              <p className="text-sm text-ink-muted">1.66:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-ink" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">ink</p>
              <p className="text-sm">#1A1A1A</p>
              <p className="text-sm text-ink-muted">17.40:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-ink-secondary" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">ink-secondary</p>
              <p className="text-sm">#4A4A48</p>
              <p className="text-sm text-ink-muted">8.88:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="h-16 rounded-t bg-ink-muted" />
            <div className="p-3">
              <p className="meta-label text-ink-muted">ink-muted</p>
              <p className="text-sm">#6B6B6B</p>
              <p className="text-sm text-ink-muted">
                5.33:1 on white. Do not go lighter.
              </p>
            </div>
          </div>
        </div>

        <h2 className="mb-8 text-h2">
          Semantic: provisional. Only when the colour carries meaning
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border border-border">
            <div className="flex h-16 items-center rounded-t bg-success px-4">
              <span className="text-sm font-semibold text-white">Success</span>
            </div>
            <div className="p-3">
              <p className="meta-label text-ink-muted">success</p>
              <p className="text-sm">#0F6E56 · 6.20:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="flex h-16 items-center rounded-t bg-warning px-4">
              <span className="text-sm font-semibold text-white">Warning</span>
            </div>
            <div className="p-3">
              <p className="meta-label text-ink-muted">warning</p>
              <p className="text-sm">#854F0B · 6.73:1 on white</p>
            </div>
          </div>
          <div className="rounded border border-border">
            <div className="flex h-16 items-center rounded-t bg-danger px-4">
              <span className="text-sm font-semibold text-white">Danger</span>
            </div>
            <div className="p-3">
              <p className="meta-label text-ink-muted">danger</p>
              <p className="text-sm">#A32D2D · 7.07:1 on white</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Type                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-24">
        <SectionLabel>
          Type: eight steps, Archivo and IBM Plex Mono
        </SectionLabel>

        <div className="mt-6 border-t border-border">
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-display">Aa BTE Campus</span>
            <span className="meta-label shrink-0 text-ink-muted">
              display · 40/48 · 600
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-h1">Aa BTE Campus</span>
            <span className="meta-label shrink-0 text-ink-muted">
              h1 · 30/38 · 600
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-h2">Aa BTE Campus</span>
            <span className="meta-label shrink-0 text-ink-muted">
              h2 · 22/30 · 600
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-h3">Aa BTE Campus</span>
            <span className="meta-label shrink-0 text-ink-muted">
              h3 · 18/26 · 600
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-body-lg">Aa BTE Campus, lead paragraph</span>
            <span className="meta-label shrink-0 text-ink-muted">
              body-lg · 16/26 · 400
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-body">Aa BTE Campus, default body copy</span>
            <span className="meta-label shrink-0 text-ink-muted">
              body · 15/24 · 400
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="text-sm text-ink-secondary">
              Aa BTE Campus, secondary and help text
            </span>
            <span className="meta-label shrink-0 text-ink-muted">
              sm · 13/20 · 400
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
            <span className="meta-label">Aa Bte Campus Ids Labels</span>
            <span className="meta-label shrink-0 text-ink-muted">
              mono-sm · 12/18 · 600*
            </span>
          </div>
        </div>

        <p className="mt-6 max-w-prose text-sm text-ink-muted">
          * DESIGN_SYSTEM.md&apos;s type table lists mono-sm at weight 500, but
          section 3 states only two weights exist (400 and 600), and globals.css
          defines only --font-weight-normal (400) and --font-weight-semibold
          (600). 500 is not a token that compiles. This page uses 600, matching
          the .meta-label utility already in globals.css. Flagged for a human
          decision, not silently corrected.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Spacing                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-24">
        <SectionLabel>Spacing: 4px base, twelve steps</SectionLabel>
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">4</span>
            <div className="h-3 w-1 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">8</span>
            <div className="h-3 w-2 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">12</span>
            <div className="size-3 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">16</span>
            <div className="h-3 w-4 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">20</span>
            <div className="h-3 w-5 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">24</span>
            <div className="h-3 w-6 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">32</span>
            <div className="h-3 w-8 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">40</span>
            <div className="h-3 w-10 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">48</span>
            <div className="h-3 w-12 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">64</span>
            <div className="h-3 w-16 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">80</span>
            <div className="h-3 w-20 bg-navy" />
          </div>
          <div className="flex items-center gap-4">
            <span className="meta-label w-16 shrink-0 text-ink-muted">96</span>
            <div className="h-3 w-24 bg-navy" />
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          These twelve values are the only spacing steps that exist. p-7,
          gap-[13px] and similar are not classes Tailwind can produce from this
          theme.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Radius                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-24">
        <SectionLabel>Radius: maximum 4px on any rectangle</SectionLabel>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-sm bg-navy" />
            <div>
              <p className="meta-label text-ink-muted">radius-sm</p>
              <p className="text-sm">2px · chips, small controls</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-16 rounded bg-navy" />
            <div>
              <p className="meta-label text-ink-muted">radius (default)</p>
              <p className="text-sm">
                4px · buttons, inputs, cards, panels, modals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-navy" />
            <div>
              <p className="meta-label text-ink-muted">radius-full</p>
              <p className="text-sm">9999px · avatars only</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          No 8px, no 12px, no 16px. rounded-lg, rounded-xl and rounded-2xl are
          not classes Tailwind can produce from this theme.
        </p>
      </section>
    </main>
  );
}
