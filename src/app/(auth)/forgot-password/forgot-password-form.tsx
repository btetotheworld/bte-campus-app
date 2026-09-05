"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(
      "Password reset is not connected yet. It waits on the same auth client as sign in."
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The reset email was not sent</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        id="email"
        label="Email"
        hint="We will send a reset link to this address once auth is wired."
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>

      <div className="flex flex-col items-start gap-3">
        <Button type="submit">Send reset link</Button>
        <Link href="/sign-in" className="text-sm text-navy underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
