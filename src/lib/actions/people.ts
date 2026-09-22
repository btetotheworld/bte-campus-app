"use server";

import { revalidatePath } from "next/cache";
import { getSessionAccess, loadPlatformAccess } from "@/lib/auth/permissions";
import { getSessionPerson } from "@/lib/auth/session";
import { runAction } from "@/lib/actions/run-action";
import type { ActionResult } from "@/lib/actions/result";
import { canAccess } from "@/lib/auth/nav-access";
import {
  approveJoinApplicationSchema,
  declineJoinApplicationSchema,
  updatePersonSchema,
  verifyPersonSchema,
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
