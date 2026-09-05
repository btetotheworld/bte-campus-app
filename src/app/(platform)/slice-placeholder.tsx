import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";

export function SlicePlaceholder({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState message={message} />
    </>
  );
}
