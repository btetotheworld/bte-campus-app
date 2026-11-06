import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Database, badge_kind } from "@/lib/db/types";
import { personRecordIdSchema } from "@/lib/schemas/edit-person-record";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export type PublicProfile = {
  id: string;
  fullName: string;
  badges: Array<{ kind: badge_kind; awardedAt: string }>;
};

const badgeLabels = {
  called: "Called",
  filled: "Filled",
  skilled: "Skilled",
} satisfies Record<badge_kind, string>;

export function publicBadgeLabel(kind: badge_kind): string {
  return badgeLabels[kind];
}

export async function loadPublicProfile(id: string): Promise<PublicProfile> {
  if (!personRecordIdSchema.safeParse(id).success) notFound();
  // This client never receives viewer cookies. Issue #60 must make RLS return
  // only an opted-in, verified team profile and its public badges.
  const supabase = createClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("id, full_name")
    .eq("id", id)
    .eq("status", "verified")
    .eq("kind", "team")
    .maybeSingle();
  if (personError) throw new Error("The public profile could not be loaded.");
  if (!person) notFound();
  const { data: badges, error: badgesError } = await supabase
    .from("badges")
    .select("badge, awarded_at")
    .eq("person_id", person.id)
    .order("awarded_at");
  if (badgesError) throw new Error("The public profile could not be loaded.");
  return {
    id: person.id,
    fullName: person.full_name,
    badges: (badges ?? []).map((badge) => ({
      kind: badge.badge,
      awardedAt: badge.awarded_at,
    })),
  };
}
