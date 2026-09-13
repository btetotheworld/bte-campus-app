import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ access: vi.fn(), record: vi.fn() }));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("../record-data", () => ({
  loadPersonRecord: mocks.record,
  personStatusLabels: { pending: "Pending" },
}));
import PersonRecordPage from "./page";
const params = Promise.resolve({ id: "person-id" });
describe("PersonRecordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "people", operation: "read" }],
    });
    mocks.record.mockResolvedValue({
      id: "person-id",
      full_name: "Example Person",
      status: "pending",
      kind: "community",
      created_at: "2026-09-09T12:00:00Z",
      verified_at: null,
      contact: null,
    });
  });
  afterEach(cleanup);
  it("lets read-only users view non-contact facts without an edit action", async () => {
    render(await PersonRecordPage({ params }));
    expect(
      screen.getByRole("heading", { name: "Example Person" })
    ).toBeVisible();
    expect(
      screen.getByText(
        /You do not have access to this person's contact details/
      )
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Edit person record" })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/13:00 WAT/)).toBeVisible();
    expect(screen.getByText(/Pending hides the public profile/)).toBeVisible();
  });
  it("blocks callers without read permission before loading the record", async () => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions: [] });
    render(await PersonRecordPage({ params }));
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it("shows editing only to authorized editors with contact access", async () => {
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    const record = await mocks.record();
    mocks.record.mockResolvedValue({
      ...record,
      contact: { email: "example@example.org", phone: null },
    });
    render(await PersonRecordPage({ params }));
    expect(
      screen.getByRole("link", { name: "Edit person record" })
    ).toHaveAttribute("href", "/people/records/person-id/edit");
  });
});
