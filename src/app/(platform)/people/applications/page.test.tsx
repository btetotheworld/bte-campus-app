import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ access: vi.fn(), applications: vi.fn() }));

vi.mock("@/lib/auth/permissions", () => ({
  loadPlatformAccess: mocks.access,
}));
vi.mock("./application-data", () => ({
  loadSubmittedApplications: mocks.applications,
}));

import JoinApplicationsPage from "./page";

describe("JoinApplicationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "join_apps", operation: "read" }],
    });
    mocks.applications.mockResolvedValue([
      {
        id: "11111111-1111-1111-1111-100000000001",
        person_id: "11111111-1111-1111-1111-100000000002",
        department_id: null,
        submitted_at: "2026-11-06T10:00:00Z",
        created_at: "2026-11-05T10:00:00Z",
        person: {
          id: "11111111-1111-1111-1111-100000000002",
          full_name: "Example Applicant",
          email: "applicant@example.org",
        },
        department: null,
      },
    ]);
  });

  afterEach(cleanup);

  it("lists submitted applications for authorized reviewers", async () => {
    render(await JoinApplicationsPage());
    expect(
      screen.getByRole("link", { name: "Example Applicant" })
    ).toHaveAttribute(
      "href",
      "/people/applications/11111111-1111-1111-1111-100000000001"
    );
    expect(screen.getByText("No department selected")).toBeVisible();
  });

  it("blocks callers without read permission before loading applications", async () => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions: [] });
    render(await JoinApplicationsPage());
    expect(mocks.applications).not.toHaveBeenCalled();
  });

  it("shows the empty state when there is nothing to review", async () => {
    mocks.applications.mockResolvedValue([]);
    render(await JoinApplicationsPage());
    expect(
      screen.getByText("There are no submitted join applications to review.")
    ).toBeVisible();
  });
});
