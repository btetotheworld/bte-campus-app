"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/auth";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REASON_COPY: Record<string, string> = {
  inactive: "This account is inactive. Ask a coordinator if that is a mistake.",
  unlinked: "This login is not linked to a person record.",
  callback: "The reset link was not valid. Request a new one.",
  "sign-out-failed": "Sign out did not finish. Try again.",
};

export function SignInForm({
  nextPath,
  reason,
}: {
  nextPath: string;
  reason?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    reason ? (REASON_COPY[reason] ?? null) : null
  );
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(nextPath.startsWith("/") ? nextPath : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>You are not signed in</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FormField id="email" label="Email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </FormField>

      <div className="flex flex-col items-start gap-3">
        <Button type="submit" loading={pending}>
          Sign in
        </Button>
        <Link href="/forgot-password" className="text-sm text-navy underline">
          Reset your password
        </Link>
      </div>
    </form>
  );
}
