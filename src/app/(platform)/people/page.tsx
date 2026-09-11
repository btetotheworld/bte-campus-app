import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { canAccess } from "@/lib/auth/nav-access";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { getSessionPerson } from "@/lib/auth/session";
import { loadAutoVerifyStatus } from "@/lib/people/auto-verify-status";
import { createClient } from "@/lib/supabase/server";

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
  const person = await getSessionPerson();
  const supabase = await createClient();
  let isFounder = false;
  if (person) {
    const { data } = await supabase
      .from("platform_roles")
      .select("id")
      .eq("person_id", person.id)
      .eq("role", "founder")
      .maybeSingle();
    isFounder = Boolean(data);
  }

  const autoVerify = canAccess(access, "people", "read")
    ? await loadAutoVerifyStatus()
    : null;

  return (
    <ModuleGate access={access} module="people" operation="read" title="People">
      <PageHeader title="People" />
      {autoVerify ? (
        <section className="mb-8">
          <h2 className="mb-2 text-h2">Auto-verify</h2>
          <p className="text-body text-ink-secondary">
            {autoVerifyMessage(autoVerify)}
          </p>
        </section>
      ) : null}
      <EmptyState
        message="This people list has not been built yet. Sprint 2 owns it."
        action={
          isFounder ? (
            <Link href="/people/roles" className="text-navy underline">
              Grant a platform role
            </Link>
          ) : null
        }
      />
    </ModuleGate>
  );
}
