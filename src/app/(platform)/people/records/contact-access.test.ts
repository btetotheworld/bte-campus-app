import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  roles: vi.fn(),
  memberships: vi.fn(),
  shared: vi.fn(),
  from: vi.fn(),
  scope: vi.fn(),
  active: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.session }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ from: mocks.from }),
}));
import { canReadPersonContact } from "./contact-access";

describe("canReadPersonContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ id: "viewer" });
    mocks.roles.mockResolvedValue({ data: [{ role: "auditor" }], error: null });
    mocks.memberships.mockResolvedValue({
      data: [{ department_id: "own-dept" }],
      error: null,
    });
    mocks.shared.mockResolvedValue({ data: [], error: null });
    mocks.scope.mockReturnValue({ limit: mocks.shared });
    mocks.active.mockReturnValue({ in: mocks.scope });
    mocks.from.mockImplementation((table: string) =>
      table === "platform_roles"
        ? { select: () => ({ eq: mocks.roles }) }
        : {
            select: () => ({
              eq: (_key: string, id: string) => ({
                is: id === "viewer" ? mocks.memberships : mocks.active,
              }),
            }),
          }
    );
  });
  it("denies signed-out callers without querying", async () => {
    mocks.session.mockResolvedValue(null);
    expect(await canReadPersonContact("target")).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("allows one's own contacts", async () => {
    expect(await canReadPersonContact("viewer")).toBe(true);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it.each(["founder", "people_manager"])(
    "allows %s global contacts",
    async (role) => {
      mocks.roles.mockResolvedValue({ data: [{ role }], error: null });
      expect(await canReadPersonContact("target")).toBe(true);
      expect(mocks.memberships).not.toHaveBeenCalled();
    }
  );
  it.each(["auditor", "program_coordinator"])(
    "denies unrelated contacts for %s",
    async (role) => {
      mocks.roles.mockResolvedValue({ data: [{ role }], error: null });
      expect(await canReadPersonContact("target")).toBe(false);
    }
  );
  it("requires active memberships in the same department", async () => {
    mocks.shared.mockResolvedValue({ data: [{ id: "shared" }], error: null });
    expect(await canReadPersonContact("target")).toBe(true);
    expect(mocks.memberships).toHaveBeenCalledWith("ended_at", null);
    expect(mocks.active).toHaveBeenCalledWith("ended_at", null);
    expect(mocks.scope).toHaveBeenCalledWith("department_id", ["own-dept"]);
  });
  it("denies contact access when the viewer has no live memberships", async () => {
    mocks.memberships.mockResolvedValue({ data: [], error: null });
    expect(await canReadPersonContact("target")).toBe(false);
    expect(mocks.shared).not.toHaveBeenCalled();
  });
  it.each(["roles", "memberships", "shared"] as const)(
    "fails closed on %s errors",
    async (source) => {
      mocks[source].mockResolvedValue({
        data: null,
        error: { message: "offline" },
      });
      await expect(canReadPersonContact("target")).rejects.toThrow(
        "Contact permissions could not be loaded."
      );
    }
  );
});
