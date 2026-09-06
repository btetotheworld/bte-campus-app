"use server";

import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { getSessionPerson } from "@/lib/auth/session";
import {
  grantPlatformRoleSchema,
  revokePlatformRoleSchema,
} from "@/lib/schemas/platform-roles";
import { createClient } from "@/lib/supabase/server";

export function grantErrorMessage(message: string): string {
  if (message.includes("themselves")) {
    return "You cannot grant a role to yourself.";
  }
  if (message.includes("equal to or above")) {
    return "You cannot grant a role equal to or above your own.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "That person already holds this role.";
  }
  if (message.includes("Only an active")) {
    return "Sign in again, then try granting the role.";
  }
  return "The role could not be granted. Check the person and try again.";
}

export function revokeErrorMessage(message: string): string {
  if (message.includes("last founder")) {
    return "Removing the last founder is blocked.";
  }
  return "The role could not be revoked. Refresh and try again.";
}

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
