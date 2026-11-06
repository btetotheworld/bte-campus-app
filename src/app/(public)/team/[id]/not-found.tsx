import Link from "next/link";
import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";

export default function PublicDepartmentNotFound() {
  return (
    <>
      <PageHeader title="Department unavailable" />
      <EmptyState
        message="This department does not exist or is not public."
        action={
          <Link
            href="/team"
            className="text-navy underline focus-visible:outline-solid"
          >
            Back to teams and departments
          </Link>
        }
      />
    </>
  );
}
