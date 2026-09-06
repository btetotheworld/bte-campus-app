"use server";

import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { getSessionPerson } from "@/lib/auth/session";
import {
  grantPlatformRoleSchema,
  revokePlatformRoleSchema,
} from "@/lib/schemas/platform-roles";
import { createClient } from "@/lib/supabase/server";
import {
  grantErrorMessage,
  revokeErrorMessage,
} from "@/lib/actions/platform-role-messages";

export async function grantPlatformRole(
  input: unknown
): Promise<ActionResult<{ granted: true }>> {
  return runAction(
    grantPlatformRoleSchema,
    input,
    async ({ personId, role }) => {
      const actor = await getSessionPerson();
      if (!actor) {
        return { ok: false, error: "Sign in before granting a role." };
      }
      if (actor.id === personId) {
        return { ok: false, error: "You cannot grant a role to yourself." };
      }

      const supabase = await createClient();
      const { error } = await supabase.from("platform_roles").insert({
        person_id: personId,
        role,
        granted_by: actor.id,
      });
      if (error) {
        return { ok: false, error: grantErrorMessage(error.message) };
      }
      return { ok: true, data: { granted: true } };
    }
  );
}

export async function revokePlatformRole(
  input: unknown
): Promise<ActionResult<{ revoked: true }>> {
  return runAction(
    revokePlatformRoleSchema,
    input,
    async ({ assignmentId }) => {
      const actor = await getSessionPerson();
      if (!actor) {
        return { ok: false, error: "Sign in before revoking a role." };
      }

      const supabase = await createClient();
      const { error } = await supabase
        .from("platform_roles")
        .delete()
        .eq("id", assignmentId);
      if (error) {
        return { ok: false, error: revokeErrorMessage(error.message) };
      }
      return { ok: true, data: { revoked: true } };
    }
  );
}
