"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function PublicTeamError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Alert variant="destructive">
        <AlertTitle>The public team could not be loaded</AlertTitle>
        <AlertDescription>
          Try again. If the problem continues, contact BTE.
        </AlertDescription>
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
