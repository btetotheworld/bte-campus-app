import { notFound } from "next/navigation";
import type { Database } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";
import { joinApplicationIdSchema } from "@/lib/schemas/people";

type ApplicationRow = Pick<
  Database["public"]["Tables"]["join_applications"]["Row"],
  "id" | "person_id" | "department_id" | "submitted_at" | "created_at"
>;

type Person = Pick<
  Database["public"]["Tables"]["people"]["Row"],
  "id" | "full_name" | "email"
>;

type Department = Pick<
  Database["public"]["Tables"]["departments"]["Row"],
  "id" | "name"
>;

export type SubmittedApplication = ApplicationRow & {
  person: Person;
  department: Department | null;
};

export async function loadSubmittedApplications(): Promise<
  SubmittedApplication[]
> {
  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from("join_applications")
    .select("id, person_id, department_id, submitted_at, created_at")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false })
    .order("id");

  if (error) throw new Error("Join applications could not be loaded.");
  if (!applications?.length) return [];

  const personIds = [...new Set(applications.map((item) => item.person_id))];
  const departmentIds = [
    ...new Set(
      applications.flatMap((item) =>
        item.department_id ? [item.department_id] : []
      )
    ),
  ];
  const { data: people, error: peopleError } = await supabase
    .from("people")
    .select("id, full_name, email")
    .in("id", personIds);
  const { data: departments, error: departmentsError } = departmentIds.length
    ? await supabase
        .from("departments")
        .select("id, name")
        .in("id", departmentIds)
    : { data: [], error: null };

  if (peopleError || departmentsError) {
    throw new Error("Join application details could not be loaded.");
  }

  const peopleById = new Map((people ?? []).map((item) => [item.id, item]));
  const departmentsById = new Map(
    (departments ?? []).map((item) => [item.id, item])
  );

  return applications.map((application) => {
    const person = peopleById.get(application.person_id);
    if (!person) throw new Error("An applicant record could not be loaded.");
    return {
      ...application,
      person,
      department: application.department_id
        ? departmentsById.get(application.department_id) ?? null
        : null,
    };
  });
}

export async function loadSubmittedApplication(
  id: string
): Promise<SubmittedApplication> {
  if (!joinApplicationIdSchema.safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data: application, error } = await supabase
    .from("join_applications")
    .select("id, person_id, department_id, submitted_at, created_at")
    .eq("id", id)
    .eq("status", "submitted")
    .maybeSingle();
  if (error) throw new Error("The join application could not be loaded.");
  if (!application) notFound();
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("id, full_name, email")
    .eq("id", application.person_id)
    .maybeSingle();
  const { data: department, error: departmentError } =
    application.department_id
      ? await supabase
          .from("departments")
          .select("id, name")
          .eq("id", application.department_id)
          .maybeSingle()
      : { data: null, error: null };
  if (personError || departmentError) {
    throw new Error("The join application details could not be loaded.");
  }
  if (!person) throw new Error("The applicant record could not be loaded.");
  return { ...application, person, department };
}

export async function loadActiveDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name")
    .is("archived_at", null)
    .order("name")
    .order("id");
  if (error) throw new Error("Departments could not be loaded.");
  return data ?? [];
}
