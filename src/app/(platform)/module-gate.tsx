import type { ReactNode } from "react";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";
import { canAccess, type SessionAccess } from "@/lib/auth/nav-access";
import { loadPlatformAccess } from "@/lib/auth/permissions";

export function ModuleGate({
  access,
  module,
  operation,
  title,
  children,
}: {
  access: SessionAccess;
  module: string;
  operation: string;
  title: string;
  children: ReactNode;
}) {
  if (canAccess(access, module, operation)) {
    return children;
  }

  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        message={`You do not have access to ${title.toLowerCase()}. The nav lists what your roles allow.`}
      />
    </>
  );
}

export async function GatedPlaceholder({
  title,
  message,
  module,
  operation,
}: {
  title: string;
  message: string;
  module: string;
  operation: string;
}) {
  const access = await loadPlatformAccess();
  return (
    <ModuleGate
      access={access}
      module={module}
      operation={operation}
      title={title}
    >
      <SlicePlaceholder title={title} message={message} />
    </ModuleGate>
  );
}
