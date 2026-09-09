"use client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function PersonRecordsError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Alert variant="destructive">
        The person record could not be loaded. Try again. If the problem
        continues, contact a people manager.
      </Alert>
      <Button
        onClick={reset}
        size="touch"
        className="focus-visible:outline-solid"
      >
        Try again
      </Button>
    </div>
  );
}
