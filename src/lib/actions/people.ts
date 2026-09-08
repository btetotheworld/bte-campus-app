"use server";

import { revalidatePath } from "next/cache";
import { getSessionAccess } from "@/lib/auth/permissions";
import { getSessionPerson } from "@/lib/auth/session";
import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import {
  approveJoinApplicationSchema,
  declineJoinApplicationSchema,
} from "@/lib/schemas/people";
import { createClient } from "@/lib/supabase/server";

function canManageJoinApplications(access: {
  isFounder: boolean;
  permissions: Array<{ module: string; operation: string }>;
}) {
  return (
    access.isFounder ||
    access.permissions.some(
      (permission) =>
        permission.module === "join_apps" && permission.operation === "update"
    )
  );
}

export async function approveJoinApplication(
  input: unknown
): Promise<ActionResult<{ approved: true }>> {
  return runAction(
    approveJoinApplicationSchema,
    input,
    async ({ applicationId, departmentId, role }) => {
      const actor = await getSessionPerson();
      if (!actor) {
        return { ok: false, error: "Sign in before approving an application." };
      }

      const access = await getSessionAccess(actor.id);
      if (!canManageJoinApplications(access)) {
        return { ok: false, error: "You cannot approve applications." };
      }

      const supabase = await createClient();
      const { data: application, error: applicationError } = await supabase
        .from("join_applications")
        .select("person_id, status")
        .eq("id", applicationId)
        .maybeSingle();

      if (
        applicationError ||
        !application ||
        application.status !== "submitted"
      ) {
        return {
          ok: false,
          error:
            "That application is not ready for approval. Refresh and try again.",
        };
      }

      const { error: personError } = await supabase
        .from("people")
        .update({ kind: "team" })
        .eq("id", application.person_id);
      if (personError) {
        return {
          ok: false,
          error: "The person could not be approved. Try again.",
        };
      }

      const { error: membershipError } = await supabase
        .from("memberships")
        .insert({
          person_id: application.person_id,
          department_id: departmentId,
          role,
        });
      if (membershipError) {
        return {
          ok: false,
          error: "The person was not assigned to the department. Try again.",
        };
      }

      const { error: statusError } = await supabase
        .from("join_applications")
        .update({ status: "approved" })
        .eq("id", applicationId);
      if (statusError) {
        return {
          ok: false,
          error: "The application status could not be saved.",
        };
      }

      revalidatePath("/people");
      return { ok: true, data: { approved: true } };
    }
  );
}

export async function declineJoinApplication(
  input: unknown
): Promise<ActionResult<{ declined: true }>> {
  return runAction(
    declineJoinApplicationSchema,
    input,
    async ({ applicationId }) => {
      const actor = await getSessionPerson();
      if (!actor) {
        return { ok: false, error: "Sign in before declining an application." };
      }

      const access = await getSessionAccess(actor.id);
      if (!canManageJoinApplications(access)) {
        return { ok: false, error: "You cannot decline applications." };
      }

      const supabase = await createClient();
      const { data: application, error: applicationError } = await supabase
        .from("join_applications")
        .select("person_id, status")
        .eq("id", applicationId)
        .maybeSingle();

      if (
        applicationError ||
        !application ||
        application.status !== "submitted"
      ) {
        return {
          ok: false,
          error:
            "That application is not ready for decline. Refresh and try again.",
        };
      }

      const { error: personError } = await supabase
        .from("people")
        .update({ status: "inactive" })
        .eq("id", application.person_id);
      if (personError) {
        return {
          ok: false,
          error: "The person could not be declined. Try again.",
        };
      }

      const { error: statusError } = await supabase
        .from("join_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);
      if (statusError) {
        return {
          ok: false,
          error: "The application status could not be saved.",
        };
      }

      revalidatePath("/people");
      return { ok: true, data: { declined: true } };
    }
  );
}
