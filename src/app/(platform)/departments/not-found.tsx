import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";

export default function DepartmentNotFound() {
  return (
    <>
      <PageHeader title="Department unavailable" />
      <EmptyState
        message="This department does not exist or you cannot access it."
        action={
          <Link href="/departments" className="text-navy underline">
            Back to departments
          </Link>
        }
      />
    </>
  );
}
