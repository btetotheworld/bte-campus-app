import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  result: vi.fn(),
  contact: vi.fn(),
}));
vi.mock("./contact-access", () => ({ canReadPersonContact: mocks.contact }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ from: () => ({ select: mocks.select }) }),
}));
import { loadPersonRecord } from "./record-data";
const id = "aaaaaaaa-0000-0000-0000-000000000001";
describe("loadPersonRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.select.mockReturnValue({ eq: () => ({ maybeSingle: mocks.result }) });
    mocks.result.mockResolvedValue({
      data: { id, full_name: "Example Person" },
      error: null,
    });
    mocks.contact.mockResolvedValue(false);
  });
  it("does not fetch contact columns for an unauthorized viewer", async () => {
    expect(await loadPersonRecord(id)).toEqual({
      id,
      full_name: "Example Person",
      contact: null,
    });
    expect(mocks.select).toHaveBeenCalledExactlyOnceWith(
      "id, full_name, status, kind, graduation_year, year_group, created_at, verified_at"
    );
  });
  it("fetches contacts only after authorization", async () => {
    mocks.contact.mockResolvedValue(true);
    mocks.result
      .mockResolvedValueOnce({ data: { id }, error: null })
      .mockResolvedValueOnce({
        data: { email: "example@example.org", phone: null },
        error: null,
      });
    expect((await loadPersonRecord(id)).contact).toEqual({
      email: "example@example.org",
      phone: null,
    });
    expect(mocks.select).toHaveBeenLastCalledWith("email, phone");
  });
  it("rejects invalid IDs before reading", async () => {
    await expect(loadPersonRecord("bad")).rejects.toThrow("NOT_FOUND");
    expect(mocks.select).not.toHaveBeenCalled();
  });
  it("returns not found for missing or RLS-hidden records", async () => {
    mocks.result.mockResolvedValue({ data: null, error: null });
    await expect(loadPersonRecord(id)).rejects.toThrow("NOT_FOUND");
    expect(mocks.contact).not.toHaveBeenCalled();
  });
  it("surfaces database failures", async () => {
    mocks.result.mockResolvedValue({
      data: null,
      error: { message: "offline" },
    });
    await expect(loadPersonRecord(id)).rejects.toThrow(
      "The person record could not be loaded."
    );
  });
});
