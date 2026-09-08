import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { getSessionPerson } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "People" };

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

  return (
    <ModuleGate
      access={access}
      module="people"
      operation="read"
      title="People"
    >
      <PageHeader title="People" />
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
