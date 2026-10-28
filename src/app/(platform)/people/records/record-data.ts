import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { personRecordIdSchema } from "@/lib/schemas/edit-person-record";
import type { Database } from "@/lib/db/types";
import { canReadPersonContact } from "./contact-access";

export type PersonRecord = Pick<
  Database["public"]["Tables"]["people"]["Row"],
  | "id"
  | "full_name"
  | "status"
  | "kind"
  | "graduation_year"
  | "year_group"
  | "created_at"
  | "verified_at"
> & {
  contact: Pick<
    Database["public"]["Tables"]["people"]["Row"],
    "email" | "phone"
  > | null;
};

// Call after the read permission gate. Do not fetch contacts without their scope check.
export async function loadPersonRecord(id: string): Promise<PersonRecord> {
  if (!personRecordIdSchema.safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select(
      "id, full_name, status, kind, graduation_year, year_group, created_at, verified_at"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("The person record could not be loaded.");
  if (!data) notFound();
  if (!(await canReadPersonContact(id))) return { ...data, contact: null };
  const { data: contact, error: contactError } = await supabase
    .from("people")
    .select("email, phone")
    .eq("id", id)
    .maybeSingle();
  if (contactError)
    throw new Error("The person's contact details could not be loaded.");
  if (!contact) notFound();
  return { ...data, contact };
}

export const personStatusLabels = {
  pending: "Pending",
  verified: "Verified",
  hidden: "Hidden",
  inactive: "Inactive",
} satisfies Record<PersonRecord["status"], string>;
