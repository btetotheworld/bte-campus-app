import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { PageHeader } from "@/components/bte/page-header";
import { loadPersonRecord } from "../../record-data";
import { PersonRecordForm } from "./person-record-form";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit person record" };

export default async function EditPersonRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "people", "update")) {
    return (
      <ModuleGate
        access={access}
        module="people"
        operation="update"
        title="Edit person record"
      >
        {null}
      </ModuleGate>
    );
  }
  const person = await loadPersonRecord((await params).id);
  if (!person.contact) notFound();
  return (
    <>
      <PageHeader
        title="Edit person record"
        crumbs={[
          { href: "/people/records", label: "Person records" },
          { href: `/people/records/${person.id}`, label: person.full_name },
        ]}
      />
      <PersonRecordForm
        person={{
          id: person.id,
          full_name: person.full_name,
          phone: person.contact.phone,
        }}
      />
    </>
  );
}
