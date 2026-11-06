import Link from "next/link";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";
import { canAccess } from "@/lib/auth/nav-access";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { loadSubmittedApplications } from "./application-data";
import { ApplicationTable } from "./application-table";

export const metadata = { title: "Join applications" };

export default async function JoinApplicationsPage() {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "join_apps", "read")) {
    return (
      <ModuleGate
        access={access}
        module="join_apps"
        operation="read"
        title="Join applications"
      >
        {null}
      </ModuleGate>
    );
  }
  const applications = await loadSubmittedApplications();
  return (
    <>
      <PageHeader
        title="Join applications"
        description="Review submitted applications to join a BTE team."
        crumbs={[{ href: "/people", label: "People" }]}
      />
      {applications.length ? (
        <ApplicationTable applications={applications} />
      ) : (
        <EmptyState
          message="There are no submitted join applications to review."
          action={
            <Link
              href="/people"
              className="text-navy underline focus-visible:outline-solid"
            >
              Back to people
            </Link>
          }
        />
      )}
    </>
  );
}
