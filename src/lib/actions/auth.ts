"use server";

import { redirect } from "next/navigation";
import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { forgotPasswordSchema, signInSchema } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  input: unknown
): Promise<ActionResult<{ ok: true }>> {
  return runAction(signInSchema, input, async ({ email, password }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { ok: false, error: "That email or password is wrong." };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "That email or password is wrong." };
    }

    const { data: person } = await supabase
      .from("people")
      .select("id, status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!person) {
      await supabase.auth.signOut();
      return {
        ok: false,
        error: "This login is not linked to a person record.",
      };
    }

    if (person.status === "inactive") {
      await supabase.auth.signOut();
      return {
        ok: false,
        error:
          "This account is inactive. Ask a coordinator if that is a mistake.",
      };
    }

    return { ok: true, data: { ok: true } };
  });
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/sign-in?reason=sign-out-failed");
  }
  redirect("/sign-in");
}

export async function requestPasswordReset(
  input: unknown
): Promise<ActionResult<{ sent: true }>> {
  return runAction(forgotPasswordSchema, input, async ({ email }) => {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/sign-in`,
    });
    if (error) {
      return {
        ok: false,
        error: "The reset email could not be sent. Try again in a moment.",
      };
    }
    return { ok: true, data: { sent: true } };
  });
}
