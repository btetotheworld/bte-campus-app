"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { getSessionPerson } from "@/lib/auth/session";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { updatePersonSchema, verifyPersonSchema } from "@/lib/schemas/people";
import { createClient } from "@/lib/supabase/server";

export async function verifyPerson(
  input: unknown
): Promise<ActionResult<{ verified: true }>> {
  return runAction(verifyPersonSchema, input, async ({ personId }) => {
    if (!(await getSessionPerson())) {
      return {
        ok: false,
        error: "Sign in again before verifying a person.",
      };
    }
    const access = await loadPlatformAccess();
    if (!canAccess(access, "people", "update")) {
      return {
        ok: false,
        error: "You cannot verify people. Ask a people manager for help.",
      };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc("verify_person_by_admin", {
      p_person_id: personId,
    });
    if (error) {
      if (error.message.includes("not authorized to verify a person")) {
        return {
          ok: false,
          error: "You cannot verify people. Ask a people manager for help.",
        };
      }
      if (error.message.includes("person not found")) {
        return {
          ok: false,
          error:
            "This person record could not be found. Refresh and try again.",
        };
      }
      if (error.message.includes("only a pending person can be verified")) {
        return {
          ok: false,
          error: "Only a pending person can be verified.",
        };
      }
      return {
        ok: false,
        error:
          "This person could not be verified. Refresh the record and try again.",
      };
    }
    revalidatePath("/people");
    revalidatePath("/people/records");
    revalidatePath(`/people/records/${personId}`);
    return { ok: true, data: { verified: true } };
  });
}

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
