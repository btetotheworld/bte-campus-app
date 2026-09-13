import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { canAccess } from "@/lib/auth/nav-access";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { loadAutoVerifyStatus } from "@/lib/people/auto-verify-status";

export const metadata: Metadata = { title: "People" };

function autoVerifyMessage(status: {
  readyCount: number;
  waitingCount: number;
}) {
  const ready =
    status.readyCount === 0
      ? "No pending team volunteers are past the 90-day clock."
      : `${status.readyCount} pending team volunteer${status.readyCount === 1 ? " is" : "s are"} ready to verify on the next job run.`;
  const waiting =
    status.waitingCount === 0
      ? "No one is still inside the 90-day clock."
      : `${status.waitingCount} pending team volunteer${status.waitingCount === 1 ? " is" : "s are"} still inside the 90-day clock.`;
  return `${ready} ${waiting}`;
}

export default async function PeoplePage() {
  const access = await loadPlatformAccess();

  const autoVerify = canAccess(access, "people", "read")
    ? await loadAutoVerifyStatus()
    : null;

  return (
    <ModuleGate access={access} module="people" operation="read" title="People">
      <PageHeader
        title="People"
        description="View person records and manage access."
      />
      {autoVerify ? (
        <section className="mb-8">
          <h2 className="mb-2 text-h2">Auto-verify</h2>
          <p className="text-body text-ink-secondary">
            {autoVerifyMessage(autoVerify)}
          </p>
        </section>
      ) : null}
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
