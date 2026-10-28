import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  not: vi.fn(),
  rows: vi.fn(),
}));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({ select: () => ({ not: mocks.not }) }),
  }),
}));
import ArchivedDepartmentsPage from "./page";

describe("ArchivedDepartmentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    mocks.not.mockReturnValue({ order: () => ({ order: mocks.rows }) });
  });
  afterEach(cleanup);
  it("queries only archived rows and links to their retained records", async () => {
    mocks.rows.mockResolvedValue({
      data: [{ id: "example", name: "Example department", kind: "team" }],
      error: null,
    });
    render(await ArchivedDepartmentsPage());
    expect(mocks.not).toHaveBeenCalledWith("archived_at", "is", null);
    expect(
      screen.getByRole("link", { name: "Example department" })
    ).toHaveAttribute("href", "/departments/example");
  });
  it("offers a way back when no archived departments are visible", async () => {
    mocks.rows.mockResolvedValue({ data: [], error: null });
    render(await ArchivedDepartmentsPage());
    expect(
      screen.getByText("There are no archived departments you can access.")
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View active departments" })
    ).toHaveAttribute("href", "/departments");
  });
  it("does not disguise a query failure as an empty state", async () => {
    mocks.rows.mockResolvedValue({ data: null, error: { message: "offline" } });
    await expect(ArchivedDepartmentsPage()).rejects.toThrow(
      "Archived departments could not be loaded."
    );
  });
  it("denies access before querying history", async () => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions: [] });
    render(await ArchivedDepartmentsPage());
    expect(mocks.not).not.toHaveBeenCalled();
  });
});
