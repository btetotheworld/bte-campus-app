"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSent(false);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await requestPasswordReset({
      email: String(form.get("email") ?? ""),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The reset email was not sent</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {sent ? (
        <Alert>
          <AlertTitle>Check that inbox</AlertTitle>
          <AlertDescription>
            If that email is on a person record, a reset link is on its way.
          </AlertDescription>
        </Alert>
      ) : null}

      <FormField
        id="email"
        label="Email"
        hint="We send a reset link only when this address is on a person record."
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
        <Button type="submit" loading={pending}>
          Send reset link
        </Button>
        <Link href="/sign-in" className="text-sm text-navy underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
