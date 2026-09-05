import type { ReactNode } from "react";
import Link from "next/link";
import { StyleguideNav } from "@/app/styleguide/styleguide-nav";

export default function StyleguideLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <p className="mb-4 text-sm">
        <Link href="/" className="text-navy underline">
          Back to the platform
        </Link>
      </p>
      <StyleguideNav />
      {children}
    </div>
  );
}
