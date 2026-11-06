import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  application: vi.fn(),
  departments: vi.fn(),
}));

vi.mock("@/lib/auth/permissions", () => ({
  loadPlatformAccess: mocks.access,
}));
vi.mock("../application-data", () => ({
  loadSubmittedApplication: mocks.application,
  loadActiveDepartments: mocks.departments,
}));
vi.mock("./application-decision-form", () => ({
  ApplicationDecisionForm: () => <div>Decision controls</div>,
}));

import JoinApplicationPage from "./page";

const params = Promise.resolve({
  id: "11111111-1111-1111-1111-100000000001",
});

describe("JoinApplicationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "join_apps", operation: "read" }],
    });
    mocks.application.mockResolvedValue({
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
    });
    mocks.departments.mockResolvedValue([]);
  });

  afterEach(cleanup);

  it("shows submitted application details without decision controls to read-only reviewers", async () => {
    render(await JoinApplicationPage({ params }));
    expect(
      screen.getByRole("heading", { name: "Example Applicant" })
    ).toBeVisible();
    expect(screen.getByText("applicant@example.org")).toBeVisible();
    expect(screen.queryByText("Decision controls")).not.toBeInTheDocument();
    expect(mocks.departments).not.toHaveBeenCalled();
  });

  it("loads decision controls only for reviewers with update permission", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [
        { module: "join_apps", operation: "read" },
        { module: "join_apps", operation: "update" },
      ],
    });
    render(await JoinApplicationPage({ params }));
    expect(screen.getByText("Decision controls")).toBeVisible();
    expect(mocks.departments).toHaveBeenCalledOnce();
  });

  it("blocks callers without read permission before loading the application", async () => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions: [] });
    render(await JoinApplicationPage({ params }));
    expect(mocks.application).not.toHaveBeenCalled();
  });
});
