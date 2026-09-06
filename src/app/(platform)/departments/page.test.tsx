import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ access: vi.fn(), rows: vi.fn() }));
vi.mock("./access", () => ({ getDepartmentAccess: mocks.access }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({
      select: () => ({ is: () => ({ order: () => ({ order: mocks.rows }) }) }),
    }),
  })),
}));
import DepartmentsPage from "./page";

describe("DepartmentsPage", () => {
  afterEach(cleanup);
  it("renders working links to creation and the returned record", async () => {
    mocks.access.mockResolvedValue({ signedIn: true, canCreate: true });
    mocks.rows.mockResolvedValue({
      data: [{ id: "example-id", name: "Example department", kind: "team" }],
      error: null,
    });
    render(await DepartmentsPage());
    expect(
      screen.getByRole("link", { name: "Create department" })
    ).toHaveAttribute("href", "/departments/new");
    expect(
      screen.getByRole("link", { name: "Example department" })
    ).toHaveAttribute("href", "/departments/example-id");
  });
  it("shows an empty state without a create action for read-only users", async () => {
    mocks.access.mockResolvedValue({ signedIn: true, canCreate: false });
    mocks.rows.mockResolvedValue({ data: [], error: null });
    render(await DepartmentsPage());
    expect(
      screen.getByText("There are no active departments you can access.")
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Create department" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
  it("surfaces a failed query instead of showing an empty list", async () => {
    mocks.access.mockResolvedValue({ signedIn: true, canCreate: true });
    mocks.rows.mockResolvedValue({ data: null, error: { message: "offline" } });
    await expect(DepartmentsPage()).rejects.toThrow(
      "Departments could not be loaded"
    );
  });
});
