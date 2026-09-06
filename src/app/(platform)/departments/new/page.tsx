import { redirect } from "next/navigation";
import { PageHeader } from "@/components/bte/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDepartmentAccess } from "../access";
import { DepartmentForm } from "./department-form";

export const metadata = { title: "Create department" };

export default async function NewDepartmentPage() {
  const access = await getDepartmentAccess();
  if (!access.signedIn) redirect("/sign-in?next=%2Fdepartments%2Fnew");
  return (
    <>
      <PageHeader
        title="Create department"
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      {access.canCreate ? (
        <DepartmentForm />
      ) : (
        <Alert variant="destructive">
          <AlertTitle>You cannot create departments</AlertTitle>
          <AlertDescription>Ask a people manager for help.</AlertDescription>
        </Alert>
      )}
    </>
  );
}
