import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("../actions", () => ({ createDepartment: mocks.create }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));
import { DepartmentForm } from "./department-form";

describe("DepartmentForm", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("focuses a blank name and shows an accessible field error", () => {
    render(<DepartmentForm />);
    fireEvent.click(screen.getByRole("button", { name: "Create department" }));
    const name = screen.getByRole("textbox", { name: "Department name" });
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter the department name.")).toBeVisible();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("keeps the entered name and restores controls after a transport failure", async () => {
    mocks.create.mockRejectedValue(new Error("offline"));
    render(<DepartmentForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Department name" }), {
      target: { value: "Example department" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create department" }));
    await waitFor(() =>
      expect(
        screen.getByText(/Check the department list before trying again/)
      ).toBeVisible()
    );
    expect(
      screen.getByRole("textbox", { name: "Department name" })
    ).toHaveValue("Example department");
    expect(
      screen.getByRole("button", { name: "Create department" })
    ).toBeEnabled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("opens the saved record only after a successful write", async () => {
    mocks.create.mockResolvedValue({ ok: true, data: { id: "example-id" } });
    render(<DepartmentForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Department name" }), {
      target: { value: "Example department" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create department" }));
    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith("/departments/example-id")
    );
    expect(mocks.refresh).toHaveBeenCalled();
  });
});
