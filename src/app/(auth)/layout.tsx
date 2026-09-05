import type { ReactNode } from "react";
import { BteLogo } from "@/components/bte/logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-4 py-16 md:px-6 lg:px-8">
      <div className="w-full max-w-prose">
        <Link href="/" className="mb-8 inline-flex">
          <BteLogo variant="navy" />
        </Link>
        {children}
      </div>
    </main>
  );
}
