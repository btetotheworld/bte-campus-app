import { ModuleGate } from "@/app/(platform)/module-gate";
import { PageHeader } from "@/components/bte/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { DepartmentForm } from "./department-form";

export const metadata = { title: "Create department" };

export default async function NewDepartmentPage() {
  const access = await loadPlatformAccess();
  return (
    <ModuleGate
      access={access}
      module="departments"
      operation="read"
      title="Departments"
    >
      <PageHeader
        title="Create department"
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      {canAccess(access, "departments", "create") &&
      canAccess(access, "departments", "update") ? (
        <DepartmentForm />
      ) : (
        <Alert variant="destructive">
          <AlertTitle>You cannot create departments</AlertTitle>
          <AlertDescription>Ask a people manager for help.</AlertDescription>
        </Alert>
      )}
    </ModuleGate>
  );
}
