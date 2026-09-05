import type { ReactNode } from "react";
import Link from "next/link";
import { BteLogo } from "@/components/bte/logo";
import { PlatformNav } from "@/app/(platform)/platform-nav";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-8 border-b border-border bg-surface px-4 py-6 md:w-1/5 md:border-r md:border-b-0 md:py-8">
        <Link href="/" className="inline-flex">
          <BteLogo variant="navy" />
        </Link>
        <PlatformNav />
        <p className="mt-auto text-sm text-ink-muted">
          Session is not wired yet.{" "}
          <Link href="/sign-in" className="text-navy underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/styleguide" className="text-navy underline">
            Styleguide
          </Link>
        </p>
      </aside>
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-content px-4 py-8 md:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
