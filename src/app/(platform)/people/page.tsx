import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";

export const metadata: Metadata = { title: "People" };

export default async function PeoplePage() {
  const access = await loadPlatformAccess();

  return (
    <ModuleGate access={access} module="people" operation="read" title="People">
      <PageHeader
        title="People"
        description="View person records and manage access."
      />
      <nav aria-label="People" className="flex flex-col items-start gap-4">
        {canAccess(access, "people", "read") ? (
          <Link
            href="/people/records"
            className="inline-flex min-h-(--control-height-touch) items-center text-navy underline focus-visible:outline-solid"
          >
            View person records
          </Link>
        ) : null}
        {access.isFounder ? (
          <Link
            href="/people/roles"
            className="inline-flex min-h-(--control-height-touch) items-center text-navy underline focus-visible:outline-solid"
          >
            Grant a platform role
          </Link>
        ) : null}
      </nav>
    </ModuleGate>
  );
}
