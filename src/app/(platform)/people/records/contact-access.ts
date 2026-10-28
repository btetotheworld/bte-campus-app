import { getSessionPerson } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

// RBAC section 8. This limits application reads; the matching database
// restriction is a separate foundation dependency, not replaced by this check.
export async function canReadPersonContact(personId: string): Promise<boolean> {
  const actor = await getSessionPerson();
  if (!actor) return false;
  if (actor.id === personId) return true;
  const supabase = await createClient();
  const { data: roles, error: roleError } = await supabase
    .from("platform_roles")
    .select("role")
    .eq("person_id", actor.id);
  if (roleError) throw new Error("Contact permissions could not be loaded.");
  if (
    roles?.some(({ role }) => role === "founder" || role === "people_manager")
  )
    return true;
  const { data: memberships, error: membershipError } = await supabase
    .from("memberships")
    .select("department_id")
    .eq("person_id", actor.id)
    .is("ended_at", null);
  if (membershipError)
    throw new Error("Contact permissions could not be loaded.");
  if (!memberships?.length) return false;
  const { data: shared, error } = await supabase
    .from("memberships")
    .select("id")
    .eq("person_id", personId)
    .is("ended_at", null)
    .in(
      "department_id",
      memberships.map(({ department_id }) => department_id)
    )
    .limit(1);
  if (error) throw new Error("Contact permissions could not be loaded.");
  return Boolean(shared?.length);
}
