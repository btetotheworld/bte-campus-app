import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ access: vi.fn() }));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("./department-form", () => ({
  DepartmentForm: () => <form aria-label="Create department" />,
}));
import NewDepartmentPage from "./page";

describe("NewDepartmentPage", () => {
  afterEach(cleanup);

  it("shows the form to a founder", async () => {
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    render(await NewDepartmentPage());
    expect(
      screen.getByRole("form", { name: "Create department" })
    ).toBeVisible();
  });

  it("denies direct navigation without department read access", async () => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions: [] });
    render(await NewDepartmentPage());
    expect(
      screen.getByText(/You do not have access to departments/)
    ).toBeVisible();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it.each([["read"], ["read", "create"], ["read", "update"]])(
    "hides the form without both write permissions: %j",
    async (...operations) => {
      mocks.access.mockResolvedValue({
        isFounder: false,
        permissions: operations.map((operation) => ({
          module: "departments",
          operation,
        })),
      });
      render(await NewDepartmentPage());
      expect(screen.getByText("You cannot create departments")).toBeVisible();
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    }
  );

  it("shows the form with read, create and update permissions", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: ["read", "create", "update"].map((operation) => ({
        module: "departments",
        operation,
      })),
    });
    render(await NewDepartmentPage());
    expect(
      screen.getByRole("form", { name: "Create department" })
    ).toBeVisible();
  });
});
