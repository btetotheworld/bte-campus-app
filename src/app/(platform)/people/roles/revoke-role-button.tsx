"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revokePlatformRole } from "@/lib/actions/platform-roles";
import { Button } from "@/components/ui/button";

export function RevokeRoleButton({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onRevoke() {
    setError(null);
    setPending(true);
    const result = await revokePlatformRole({ assignmentId });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        loading={pending}
        onClick={onRevoke}
      >
        Revoke
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
