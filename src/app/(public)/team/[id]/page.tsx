import { DefinitionList } from "@/components/bte/definition-list";
import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";
import { RosterRow } from "@/components/bte/roster-row";
import {
  loadPublicDepartment,
  publicRoleLabel,
} from "../public-directory-data";

export const metadata = { title: "BTE department" };

export default async function PublicDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const department = await loadPublicDepartment((await params).id);
  return (
    <>
      <PageHeader
        title={department.name}
        description="Verified BTE volunteers serving in this department."
        crumbs={[{ href: "/team", label: "Teams and departments" }]}
      />
      <DefinitionList
        items={[
          {
            label: "Kind",
            value:
              department.kind === "campus_chapter"
                ? "Campus chapter"
                : "BTE team",
          },
        ]}
      />
      <section className="mt-12" aria-labelledby="team-title">
        <h2 id="team-title" className="mb-6 text-h2">
          Team
        </h2>
        {department.team.length ? (
          <div>
            {department.team.map((person) => (
              <RosterRow
                key={person.id}
                name={person.full_name}
                role={publicRoleLabel(person.role)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="This department has no public team members yet." />
        )}
      </section>
    </>
  );
}
