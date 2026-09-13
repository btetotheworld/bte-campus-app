"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/actions/run-action";
import { editPersonRecordSchema } from "@/lib/schemas/edit-person-record";
import { getSessionPerson } from "@/lib/auth/session";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { createClient } from "@/lib/supabase/server";

export async function editPersonRecord(input: unknown) {
  return runAction(
    editPersonRecordSchema,
    input,
    async ({ id, full_name, phone }) => {
      if (!(await getSessionPerson())) {
        return {
          ok: false,
          error: "Sign in again before editing a person record.",
        };
      }
      const access = await loadPlatformAccess();
      if (!canAccess(access, "people", "update")) {
        return {
          ok: false,
          error:
            "You cannot edit person records. Ask a people manager for help.",
        };
      }
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("people")
        .update({ full_name, phone })
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error || !data) {
        return {
          ok: false,
          error:
            "The person record could not be saved. Refresh the record and check your access before trying again.",
        };
      }
      revalidatePath("/people");
      revalidatePath("/people/records");
      revalidatePath(`/people/records/${id}`);
      revalidatePath(`/people/records/${id}/edit`);
      revalidatePath("/profile");
      return { ok: true, data };
    }
  );
}
