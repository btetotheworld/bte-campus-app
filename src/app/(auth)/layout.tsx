import type { ReactNode } from "react";
import Link from "next/link";
import { BteLogo } from "@/components/bte/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen">
      <section
        aria-label="Brand image placeholder"
        className="hidden w-1/3 shrink-0 flex-col justify-between bg-navy p-8 lg:flex lg:p-12"
      >
        <Link href="/sign-in" className="inline-flex">
          <BteLogo variant="white" />
        </Link>
        <p className="meta-label text-white">Image to be supplied</p>
      </section>
      <section className="flex flex-1 flex-col justify-center px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-prose">
          <div className="mb-8 lg:hidden">
            <Link href="/sign-in" className="inline-flex">
              <BteLogo variant="navy" />
            </Link>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
