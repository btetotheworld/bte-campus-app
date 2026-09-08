import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SessionPerson = {
  id: string;
  full_name: string;
  email: string;
  status: string;
};

export const getSessionPerson = cache(
  async function getSessionPerson(): Promise<SessionPerson | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("people")
      .select("id, full_name, email, status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error || !data || data.status === "inactive") {
      return null;
    }

    return data;
  }
);
