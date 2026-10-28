import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";

export default function PersonRecordNotFound() {
  return (
    <>
      <PageHeader title="Person record unavailable" />
      <EmptyState
        message="This person record does not exist or you cannot access it."
        action={
          <Link
            href="/people/records"
            className="text-navy underline focus-visible:outline-solid"
          >
            Back to person records
          </Link>
        }
      />
    </>
  );
}
