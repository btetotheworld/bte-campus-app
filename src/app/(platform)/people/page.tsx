import type { Metadata } from "next";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { ApprovalQueue } from "@/app/(platform)/people/approval-queue";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "People" };

export default async function PeoplePage() {
  const access = await loadPlatformAccess();
  const supabase = await createClient();
  const { data: applications, error: applicationsError } = await supabase
    .from("join_applications")
    .select("id, person_id, department_id")
    .eq("status", "submitted")
    .order("created_at");
  const { data: departments, error: departmentsError } = await supabase
    .from("departments")
    .select("id, name")
    .is("archived_at", null)
    .order("name");

  const personIds = [
    ...new Set((applications ?? []).map((item) => item.person_id)),
  ];
  const { data: people, error: peopleError } = personIds.length
    ? await supabase
        .from("people")
        .select("id, full_name, email")
        .in("id", personIds)
    : { data: [], error: null };

  return (
    <ModuleGate access={access} module="people" operation="read" title="People">
      <PageHeader title="People" />
      {applicationsError || departmentsError || peopleError ? (
        <EmptyState message="People records could not be loaded. Try again." />
      ) : applications?.length ? (
        <ApprovalQueue
          applications={applications.flatMap((application) => {
            const person = people?.find(
              (candidate) => candidate.id === application.person_id
            );
            return person
              ? [
                  {
                    id: application.id,
                    person,
                    departmentId: application.department_id,
                  },
                ]
              : [];
          })}
          departments={departments ?? []}
        />
      ) : (
        <EmptyState message="There are no submitted applications to review." />
      )}
    </ModuleGate>
  );
}
