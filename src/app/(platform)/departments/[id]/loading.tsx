import { PageHeader } from "@/components/bte/page-header";
import { DefinitionList } from "@/components/bte/definition-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentLoading() {
  return (
    <div role="status" aria-label="Loading department">
      <PageHeader title="Department" />
      <DefinitionList
        items={[
          { label: "Status", value: <Skeleton className="h-4 w-20" /> },
          { label: "Kind", value: <Skeleton className="h-4 w-24" /> },
        ]}
      />
    </div>
  );
}
