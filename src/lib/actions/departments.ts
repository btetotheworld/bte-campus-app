"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/actions/run-action";
import { createDepartmentSchema } from "@/lib/schemas/departments";
import { createClient } from "@/lib/supabase/server";
import { getSessionPerson } from "@/lib/auth/session";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";

export async function createDepartment(input: unknown) {
  return runAction(createDepartmentSchema, input, async ({ name, kind }) => {
    const person = await getSessionPerson();
    if (!person) {
      return {
        ok: false,
        error: "Sign in again before creating a department.",
      };
    }
    const access = await loadPlatformAccess();
    // departments_write requires update permission for inserts too.
    if (
      !canAccess(access, "departments", "create") ||
      !canAccess(access, "departments", "update")
    ) {
      return {
        ok: false,
        error: "You cannot create departments. Ask a people manager for help.",
      };
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("departments")
      .insert({ name, kind })
      .select("id")
      .single();
    if (error || !data) {
      return {
        ok: false,
        error:
          "The department could not be created. Refresh the department list before trying again.",
      };
    }
    revalidatePath("/departments");
    return { ok: true, data };
  });
}
