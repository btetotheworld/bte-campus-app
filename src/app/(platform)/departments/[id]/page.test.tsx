import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  eq: vi.fn(),
  record: vi.fn(),
}));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ select: () => ({ eq: mocks.eq }) }),
  })),
}));
import DepartmentPage from "./page";

const SEED_ID = "aaaaaaaa-0000-0000-0000-000000000001";

describe("DepartmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    mocks.eq.mockReturnValue({ maybeSingle: mocks.record });
    mocks.record.mockResolvedValue({
      data: { id: SEED_ID, name: "BTE core", kind: "team", archived_at: null },
      error: null,
    });
  });
  afterEach(cleanup);

  it.each([SEED_ID, SEED_ID.toUpperCase()])(
    "opens a seed-format UUID: %s",
    async (id) => {
      render(await DepartmentPage({ params: Promise.resolve({ id }) }));
      expect(screen.getByRole("heading", { name: "BTE core" })).toBeVisible();
      expect(mocks.eq).toHaveBeenCalledWith("id", id);
    }
  );

  it.each([
    "invalid",
    "aaaaaaaa-0000-0000-0000-00000000000g",
    `${SEED_ID}/extra`,
  ])("rejects a malformed ID before querying: %s", async (id) => {
    await expect(
      DepartmentPage({ params: Promise.resolve({ id }) })
    ).rejects.toThrow("NOT_FOUND");
    expect(mocks.eq).not.toHaveBeenCalled();
  });

  it("denies membership-only access before reading the record", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "meetings", operation: "read" }],
    });
    render(await DepartmentPage({ params: Promise.resolve({ id: SEED_ID }) }));
    expect(
      screen.getByText(/You do not have access to departments/)
    ).toBeVisible();
    expect(mocks.eq).not.toHaveBeenCalled();
  });

  it("allows an auditor to read a record", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "departments", operation: "read" }],
    });
    render(await DepartmentPage({ params: Promise.resolve({ id: SEED_ID }) }));
    expect(screen.getByRole("heading", { name: "BTE core" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Archive department" })
    ).not.toBeInTheDocument();
  });

  it("keeps archived records readable with the archive time in WAT", async () => {
    mocks.record.mockResolvedValue({
      data: {
        id: SEED_ID,
        name: "BTE core",
        kind: "team",
        archived_at: "2026-09-09T12:00:00.000Z",
      },
      error: null,
    });
    render(await DepartmentPage({ params: Promise.resolve({ id: SEED_ID }) }));
    expect(screen.getByText("Archived")).toBeVisible();
    expect(screen.getByText(/13:00 WAT/)).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Archive department" })
    ).not.toBeInTheDocument();
  });

  it("shows not found when RLS returns no record", async () => {
    mocks.record.mockResolvedValue({ data: null, error: null });
    await expect(
      DepartmentPage({ params: Promise.resolve({ id: SEED_ID }) })
    ).rejects.toThrow("NOT_FOUND");
  });

  it("surfaces a read failure", async () => {
    mocks.record.mockResolvedValue({
      data: null,
      error: { message: "offline" },
    });
    await expect(
      DepartmentPage({ params: Promise.resolve({ id: SEED_ID }) })
    ).rejects.toThrow("The department could not be loaded.");
  });
});
