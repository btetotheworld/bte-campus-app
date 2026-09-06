import { PageHeader } from "@/components/bte/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateDepartmentLoading() {
  return (
    <div role="status" aria-label="Loading department form">
      <PageHeader
        title="Create department"
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      <div className="flex max-w-prose flex-col gap-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
