import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Database, membership_role } from "@/lib/db/types";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { personRecordIdSchema } from "@/lib/schemas/edit-person-record";

type Department = Pick<
  Database["public"]["Tables"]["departments"]["Row"],
  "id" | "name" | "kind"
>;
type Membership = Pick<
  Database["public"]["Tables"]["memberships"]["Row"],
  "person_id" | "department_id" | "role"
>;
type Person = Pick<
  Database["public"]["Tables"]["people"]["Row"],
  "id" | "full_name"
>;

export type PublicTeamMember = Person & { role: membership_role };
export type PublicDepartment = Department & { team: PublicTeamMember[] };

const roleLabels = {
  founder: "Founder",
  coordinator: "Coordinator",
  campus_lead: "Campus lead",
  assistant_lead: "Assistant lead",
  practitioner: "Practitioner",
  member: "Volunteer",
} satisfies Record<membership_role, string>;

export function publicRoleLabel(role: membership_role): string {
  return roleLabels[role];
}

function publicClient() {
  return createClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function assemblePublicDepartments(
  departments: Department[],
  memberships: Membership[],
  people: Person[]
): PublicDepartment[] {
  const peopleById = new Map(people.map((person) => [person.id, person]));
  return departments.map((department) => ({
    ...department,
    team: memberships
      .filter((membership) => membership.department_id === department.id)
      .flatMap((membership) => {
        const person = peopleById.get(membership.person_id);
        return person ? [{ ...person, role: membership.role }] : [];
      })
      .sort((a, b) => a.full_name.localeCompare(b.full_name)),
  }));
}

export async function loadPublicDepartments(): Promise<PublicDepartment[]> {
  // This client deliberately has no viewer cookies. Issue #60 must make RLS
  // return only published departments and opted-in, verified team people.
  const supabase = publicClient();
  const { data: departments, error: departmentsError } = await supabase
    .from("departments")
    .select("id, name, kind")
    .is("archived_at", null)
    .order("name")
    .order("id");
  if (departmentsError) {
    throw new Error("The public team directory could not be loaded.");
  }
  if (!departments?.length) return [];

  const departmentIds = departments.map((department) => department.id);
  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("person_id, department_id, role")
    .in("department_id", departmentIds)
    .is("ended_at", null);
  if (membershipsError) {
    throw new Error("The public team directory could not be loaded.");
  }
  const personIds = [
    ...new Set((memberships ?? []).map((membership) => membership.person_id)),
  ];
  const { data: people, error: peopleError } = personIds.length
    ? await supabase
        .from("people")
        .select("id, full_name")
        .in("id", personIds)
        .eq("status", "verified")
        .eq("kind", "team")
    : { data: [], error: null };
  if (peopleError) {
    throw new Error("The public team directory could not be loaded.");
  }
  return assemblePublicDepartments(
    departments,
    memberships ?? [],
    people ?? []
  );
}

export async function loadPublicDepartment(
  id: string
): Promise<PublicDepartment> {
  if (!personRecordIdSchema.safeParse(id).success) notFound();
  const department = (await loadPublicDepartments()).find(
    (candidate) => candidate.id === id
  );
  if (!department) notFound();
  return department;
}
