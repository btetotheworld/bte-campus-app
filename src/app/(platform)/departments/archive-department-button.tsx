"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { archiveDepartment } from "./archive-action";

export function ArchiveDepartmentButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function archive() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await archiveDepartment({ id });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setOpen(false);
        router.refresh();
      } catch {
        setError(
          "The archive request could not be completed. Refresh the page before trying again."
        );
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) {
          setOpen(value);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="touch"
          className="focus-visible:outline-solid"
        >
          Archive department
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogTitle>Archive {name}?</DialogTitle>
        <DialogDescription>
          This department will leave the active list. Its record, memberships
          and chapter history will remain available.
        </DialogDescription>
        {error ? <Alert variant="destructive">{error}</Alert> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="touch"
              disabled={pending}
              className="focus-visible:outline-solid"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="touch"
            loading={pending}
            onClick={archive}
            className="focus-visible:outline-solid"
          >
            {pending ? "Archiving department" : "Confirm archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
