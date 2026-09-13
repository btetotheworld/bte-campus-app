import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const maybeSingle = vi.fn();
const updateEq = vi.fn();
const selectEq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq: selectEq }));
const update = vi.fn(() => ({ eq: updateEq }));
const from = vi.fn(() => ({ select, update }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { updateOwnProfile } from "@/lib/actions/people";

const validProfile = {
  full_name: "Ada Okafor",
  phone: "+234 800 000 0000",
  graduation_year: 2024,
  year_group: 4,
};

describe("updateOwnProfile", () => {
  beforeEach(() => {
    getUser.mockReset();
    maybeSingle.mockReset();
    updateEq.mockReset();
    from.mockClear();
  });

  it("rejects extra fields before calling Supabase", async () => {
    const result = await updateOwnProfile({
      ...validProfile,
      status: "inactive",
    });

    expect(result.ok).toBe(false);
    expect(getUser).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({
      ok: false,
      error: "You must be signed in to update your profile.",
    });
  });

  it("updates the current person's row with only editable fields", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "auth-user-id" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { id: "person-id", status: "verified" },
      error: null,
    });
    updateEq.mockResolvedValue({ error: null });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({ ok: true, data: { saved: true } });
    expect(update).toHaveBeenCalledWith(validProfile);
    expect(updateEq).toHaveBeenCalledWith("id", "person-id");
  });

  it("returns an error when the profile update fails", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "auth-user-id" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { id: "person-id", status: "verified" },
      error: null,
    });
    updateEq.mockResolvedValue({ error: { message: "RLS rejected" } });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({
      ok: false,
      error: "Your profile could not be saved. Try again.",
    });
  });
});
