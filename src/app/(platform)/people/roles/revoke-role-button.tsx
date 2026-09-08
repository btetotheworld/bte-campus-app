"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revokePlatformRole } from "@/lib/actions/platform-roles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RevokeRoleButton({
  assignmentId,
  personId,
  actorPersonId,
  personName,
  roleLabel,
}: {
  assignmentId: string;
  personId: string;
  actorPersonId: string;
  personName: string;
  roleLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (personId === actorPersonId) {
    return <p className="text-sm text-ink-muted">This is your access</p>;
  }

  async function onConfirm() {
    setError(null);
    setPending(true);
    const result = await revokePlatformRole({ assignmentId });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Revoke
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Revoke this role</DialogTitle>
            <DialogDescription>
              This removes {roleLabel.toLowerCase()} from {personName}. They
              lose that access immediately.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={pending}
              onClick={onConfirm}
            >
              Revoke role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
