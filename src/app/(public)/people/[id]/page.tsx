import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";
import { StatusBadge } from "@/components/bte/status-badge";
import { loadPublicProfile, publicBadgeLabel } from "./public-profile-data";

export const metadata = { title: "BTE profile" };

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await loadPublicProfile((await params).id);
  return (
    <>
      <PageHeader
        title={profile.fullName}
        description="A verified member of the BTE team."
      />
      <section aria-labelledby="badges-title">
        <h2 id="badges-title" className="mb-6 text-h2">
          BTE badges
        </h2>
        {profile.badges.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <StatusBadge
                key={`${badge.kind}-${badge.awardedAt}`}
                label={publicBadgeLabel(badge.kind)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="This person has no BTE badges yet." />
        )}
      </section>
    </>
  );
}
