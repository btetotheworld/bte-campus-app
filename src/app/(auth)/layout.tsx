import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BteLogo } from "@/components/bte/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen">
      {/* Left panel: roughly 30% width on desktop with full background image */}
      <section
        aria-label="Believers Tech Expo introduction"
        className="relative hidden w-1/3 shrink-0 flex-col justify-between overflow-hidden border-r border-border bg-navy p-8 text-white lg:flex lg:p-12"
      >
        {/* Full background image */}
        <Image
          src="/campus-fellowship.jpg"
          alt="African campus fellowship students gathered in devotion around an open Bible and laptops"
          fill
          priority
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
        {/* Full background coverage overlay with navy fill to maintain contrast */}
        <div
          aria-hidden="true"
          // Overlay fills the background panel. Spacing scale has no 0 step.
          style={{ inset: 0 }}
          className="absolute bg-navy/85"
        />

        <div className="relative z-10 my-auto flex flex-col items-start text-left">
          <Link href="/sign-in" className="mb-8 inline-flex">
            <BteLogo variant="white" />
          </Link>
          <p className="meta-label mb-2 text-white">BTE Campus</p>
          <h2 className="text-h1 text-white">
            Equipping campus tech communities across Africa.
          </h2>
        </div>
      </section>

      {/* Right form panel: remaining 70% width */}
      <section className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 md:px-8 lg:px-12">
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
