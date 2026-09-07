import { getSessionPerson } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function getDepartmentAccess() {
  const person = await getSessionPerson();
  if (!person) return { signedIn: false, canCreate: false };

  const supabase = await createClient();
  const { data: roles, error: roleError } = await supabase
    .from("platform_roles")
    .select("role")
    .eq("person_id", person.id);
  if (roleError) throw new Error("Department permissions could not be loaded.");
  // Matches the founder override in has_permission(), without redefining roles.
  if (roles?.some(({ role }) => role === "founder")) {
    return { signedIn: true, canCreate: true };
  }
  if (!roles?.length) return { signedIn: true, canCreate: false };

  const { data: permissions, error } = await supabase
    .from("role_permissions")
    .select("operation")
    .in(
      "role",
      roles.map(({ role }) => role)
    )
    .eq("module", "departments")
    .eq("scope", "global");
  if (error) throw new Error("Department permissions could not be loaded.");
  // departments_write currently also requires update permission for inserts.
  return {
    signedIn: true,
    canCreate: ["create", "update"].every((operation) =>
      permissions?.some((permission) => permission.operation === operation)
    ),
  };
}
