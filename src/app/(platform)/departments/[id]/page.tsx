import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/bte/page-header";
import { DefinitionList } from "@/components/bte/definition-list";
import { StatusBadge } from "@/components/bte/status-badge";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Department" };

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, kind, archived_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("The department could not be loaded.");
  if (!data) notFound();
  return (
    <>
      <PageHeader
        title={data.name}
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      <DefinitionList
        items={[
          {
            label: "Status",
            value: (
              <StatusBadge label={data.archived_at ? "Archived" : "Active"} />
            ),
          },
          {
            label: "Kind",
            value: data.kind === "team" ? "Team" : "Campus chapter",
          },
        ]}
      />
    </>
  );
}
