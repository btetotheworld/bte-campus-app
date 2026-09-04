import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BTE Platform",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col items-start justify-center px-4 md:px-6 lg:px-8">
      <p className="meta-label mb-2 text-ink-muted">BTE platform</p>
      <h1 className="mb-3 text-h1">Believers Tech Expo</h1>
      <p className="mb-8 max-w-prose text-body text-ink-secondary">
        Nothing has been scaffolded here yet beyond the foundation. See
        README.md for how this repository is put together and where the rules
        live.
      </p>
      <Link
        href="/styleguide"
        className="text-body font-semibold text-navy underline"
      >
        View the styleguide
      </Link>
    </main>
  );
}
