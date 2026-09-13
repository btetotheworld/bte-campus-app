"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { updatePersonSchema } from "@/lib/schemas/people";
import { createClient } from "@/lib/supabase/server";

export async function updateOwnProfile(
  input: unknown
): Promise<ActionResult<{ saved: true }>> {
  return runAction(updatePersonSchema, input, async (profile) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        ok: false,
        error: "You must be signed in to update your profile.",
      };
    }

    const { data: person, error: personError } = await supabase
      .from("people")
      .select("id, status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (personError) {
      return {
        ok: false,
        error: "Your profile could not be loaded. Try again.",
      };
    }

    if (!person || person.status === "inactive") {
      return { ok: false, error: "Your profile cannot be updated." };
    }

    const { error: updateError } = await supabase
      .from("people")
      .update(profile)
      .eq("id", person.id);

    if (updateError) {
      return {
        ok: false,
        error: "Your profile could not be saved. Try again.",
      };
    }

    revalidatePath("/profile");
    return { ok: true, data: { saved: true } };
  });
}
