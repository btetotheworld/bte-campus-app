import type { ReactNode } from "react";
import Link from "next/link";
import { BteLogo } from "@/components/bte/logo";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-content items-center justify-between gap-6 p-4 md:px-6 lg:px-8">
          <Link href="/team" className="inline-flex focus-visible:outline-solid">
            <BteLogo variant="navy" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex min-h-(--control-height-touch) items-center text-navy underline focus-visible:outline-solid"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
