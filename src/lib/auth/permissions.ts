import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SessionAccess } from "@/lib/auth/nav-access";
import { getSessionPerson } from "@/lib/auth/session";

export const getSessionAccess = cache(async function getSessionAccess(
  personId: string
): Promise<SessionAccess> {
  const supabase = await createClient();

  const [rolesResult, membershipsResult, catalogueResult] = await Promise.all([
    supabase.from("platform_roles").select("role").eq("person_id", personId),
    supabase
      .from("memberships")
      .select("role")
      .eq("person_id", personId)
      .is("ended_at", null),
    supabase.from("role_permissions").select("role, module, operation"),
  ]);

  if (rolesResult.error || membershipsResult.error || catalogueResult.error) {
    return { isFounder: false, permissions: [] };
  }

  const platformRoles = rolesResult.data ?? [];
  const isFounder = platformRoles.some((row) => row.role === "founder");
  const roleNames = new Set<string>([
    ...platformRoles.map((row) => row.role),
    ...(membershipsResult.data ?? []).map((row) => row.role),
  ]);

  const permissions = (catalogueResult.data ?? [])
    .filter((row) => roleNames.has(row.role))
    .map((row) => ({ module: row.module, operation: row.operation }));

  return { isFounder, permissions };
});

export async function loadPlatformAccess(): Promise<SessionAccess> {
  const person = await getSessionPerson();
  if (!person) {
    return { isFounder: false, permissions: [] };
  }
  return getSessionAccess(person.id);
}
