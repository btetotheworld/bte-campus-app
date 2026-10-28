"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/actions/run-action";
import { getSessionPerson } from "@/lib/auth/session";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { archiveDepartmentSchema } from "@/lib/schemas/archive-department";
import { createClient } from "@/lib/supabase/server";

export async function archiveDepartment(input: unknown) {
  return runAction(archiveDepartmentSchema, input, async ({ id }) => {
    if (!(await getSessionPerson())) {
      return {
        ok: false,
        error: "Sign in again before archiving a department.",
      };
    }
    const access = await loadPlatformAccess();
    if (!canAccess(access, "departments", "update")) {
      return {
        ok: false,
        error: "You cannot archive departments. Ask a people manager for help.",
      };
    }
    const supabase = await createClient();
    // RLS enforces global update permission. Keep every related row untouched.
    // The null filter preserves the original timestamp on repeated requests.
    const { data, error } = await supabase
      .from("departments")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id)
      .is("archived_at", null)
      .select("id")
      .maybeSingle();
    if (error || !data) {
      return {
        ok: false,
        error:
          "The department could not be archived. It may already be archived or you may no longer have access. Refresh the page and try again.",
      };
    }
    revalidatePath("/departments");
    revalidatePath("/departments/archived");
    revalidatePath(`/departments/${id}`);
    return { ok: true, data };
  });
}
