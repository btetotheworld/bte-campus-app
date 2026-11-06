import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ profile: vi.fn() }));
vi.mock("./public-profile-data", () => ({
  loadPublicProfile: mocks.profile,
  publicBadgeLabel: (kind: string) =>
    kind.charAt(0).toUpperCase() + kind.slice(1),
}));

import PublicProfilePage from "./page";

const params = Promise.resolve({
  id: "11111111-1111-1111-1111-100000000001",
});

describe("PublicProfilePage", () => {
  afterEach(cleanup);

  it("renders only the public profile fields available before issue 60", async () => {
    mocks.profile.mockResolvedValue({
      id: "11111111-1111-1111-1111-100000000001",
      fullName: "Example Person",
      badges: [{ kind: "called", awardedAt: "2026-11-06T10:00:00Z" }],
    });
    render(await PublicProfilePage({ params }));
    expect(
      screen.getByRole("heading", { name: "Example Person" })
    ).toBeVisible();
    expect(screen.getByText("Called")).toBeVisible();
    expect(screen.queryByText(/example@/i)).not.toBeInTheDocument();
  });

  it("shows a direct empty state when there are no badges", async () => {
    mocks.profile.mockResolvedValue({
      id: "11111111-1111-1111-1111-100000000001",
      fullName: "Example Person",
      badges: [],
    });
    render(await PublicProfilePage({ params }));
    expect(
      screen.getByText("This person has no BTE badges yet.")
    ).toBeVisible();
  });
});
