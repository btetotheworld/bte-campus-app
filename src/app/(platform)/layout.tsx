import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BteLogo } from "@/components/bte/logo";
import { PlatformNav } from "@/app/(platform)/platform-nav";
import { signOut } from "@/lib/actions/auth";
import { getSessionPerson } from "@/lib/auth/session";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const person = await getSessionPerson();
  if (!person) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-8 border-b border-border bg-surface px-4 py-6 md:w-1/5 md:border-r md:border-b-0 md:py-8">
        <Link href="/" className="inline-flex">
          <BteLogo variant="navy" />
        </Link>
        <PlatformNav />
        <div className="mt-auto flex flex-col items-start gap-2 text-sm text-ink-muted">
          <p>{person ? person.full_name : "Signed in"}</p>
          <form action={signOut}>
            <button type="submit" className="text-navy underline">
              Sign out
            </button>
          </form>
          <Link href="/styleguide" className="text-navy underline">
            Styleguide
          </Link>
        </div>
      </aside>
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-content px-4 py-8 md:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
