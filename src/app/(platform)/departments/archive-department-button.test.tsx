import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ archive: vi.fn(), refresh: vi.fn() }));
vi.mock("./archive-action", () => ({ archiveDepartment: mocks.archive }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
import { ArchiveDepartmentButton } from "./archive-department-button";

describe("ArchiveDepartmentButton", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);
  function open() {
    render(
      <ArchiveDepartmentButton id="department-id" name="Example department" />
    );
    fireEvent.click(screen.getByRole("button", { name: "Archive department" }));
  }
  it("requires confirmation and lets the user cancel without writing", () => {
    open();
    expect(
      screen.getByRole("dialog", { name: "Archive Example department?" })
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mocks.archive).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("refreshes the record after a successful archive", async () => {
    mocks.archive.mockResolvedValue({
      ok: true,
      data: { id: "department-id" },
    });
    open();
    fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
    expect(mocks.archive).toHaveBeenCalledWith({ id: "department-id" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("keeps the dialog open and surfaces rejected writes", async () => {
    mocks.archive.mockResolvedValue({
      ok: false,
      error: "You cannot archive departments. Ask a people manager for help.",
    });
    open();
    fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "You cannot archive departments."
    );
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
  it("surfaces a failed connection", async () => {
    mocks.archive.mockRejectedValue(new Error("network failure"));
    open();
    fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Refresh the page before trying again."
    );
  });
});
