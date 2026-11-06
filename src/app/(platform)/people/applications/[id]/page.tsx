import { ModuleGate } from "@/app/(platform)/module-gate";
import { DefinitionList } from "@/components/bte/definition-list";
import { PageHeader } from "@/components/bte/page-header";
import { StatusBadge } from "@/components/bte/status-badge";
import { canAccess } from "@/lib/auth/nav-access";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import {
  loadActiveDepartments,
  loadSubmittedApplication,
} from "../application-data";
import { ApplicationDecisionForm } from "./application-decision-form";

export const metadata = { title: "Join application" };

const date = (value: string | null) =>
  value
    ? `${new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Lagos",
      }).format(new Date(value))} WAT`
    : "Not recorded";

export default async function JoinApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "join_apps", "read")) {
    return (
      <ModuleGate
        access={access}
        module="join_apps"
        operation="read"
        title="Join application"
      >
        {null}
      </ModuleGate>
    );
  }
  const application = await loadSubmittedApplication((await params).id);
  const canDecide = canAccess(access, "join_apps", "update");
  const departments = canDecide ? await loadActiveDepartments() : [];
  return (
    <>
      <PageHeader
        title={application.person.full_name}
        description="Review this submitted application before making a decision."
        crumbs={[
          { href: "/people", label: "People" },
          { href: "/people/applications", label: "Join applications" },
        ]}
      />
      <DefinitionList
        items={[
          { label: "Status", value: <StatusBadge label="Submitted" /> },
          { label: "Email", value: application.person.email },
          {
            label: "Requested department",
            value: application.department?.name ?? "No department selected",
          },
          { label: "Submitted at", value: date(application.submitted_at) },
        ]}
      />
      {canDecide ? (
        <section className="mt-12" aria-labelledby="decision-title">
          <h2 id="decision-title" className="mb-6 text-h2">
            Decision
          </h2>
          <ApplicationDecisionForm
            applicationId={application.id}
            departmentId={application.department_id}
            departments={departments}
          />
        </section>
      ) : null}
    </>
  );
}
