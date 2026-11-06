import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";

export default function PublicProfileNotFound() {
  return (
    <>
      <PageHeader title="Profile unavailable" />
      <EmptyState message="This profile does not exist or is not public." />
    </>
  );
}
