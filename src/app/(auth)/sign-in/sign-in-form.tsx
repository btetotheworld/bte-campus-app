"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(
      "Sign in is not connected yet. Add @supabase/ssr and @supabase/supabase-js, then wire the session in src/lib/auth/. Until then the shell is open so other slices can be built."
    );
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
        <Button type="submit">Sign in</Button>
        <Link href="/forgot-password" className="text-sm text-navy underline">
          Reset your password
        </Link>
      </div>
    </form>
  );
}
