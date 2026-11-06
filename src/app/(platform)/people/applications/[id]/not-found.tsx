import Link from "next/link";
import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";

export default function JoinApplicationNotFound() {
  return (
    <>
      <PageHeader title="Join application unavailable" />
      <EmptyState
        message="This application does not exist, is no longer submitted, or you cannot access it."
        action={
          <Link
            href="/people/applications"
            className="text-navy underline focus-visible:outline-solid"
          >
            Back to join applications
          </Link>
        }
      />
    </>
  );
}
