import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/bte/page-header";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: person, error } = await supabase
    .from("people")
    .select("full_name, email, phone, graduation_year, year_group, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !person || person.status === "inactive") {
    redirect("/sign-in?reason=unlinked");
  }

  return (
    <>
      <PageHeader
        title="My profile"
        description="Keep the contact details on your person record up to date."
      />
      <div className="max-w-prose">
        <ProfileForm person={person} />
      </div>
    </>
  );
}
