import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ rpc })),
}));

import { loadAutoVerifyStatus } from "@/lib/people/auto-verify-status";

describe("loadAutoVerifyStatus", () => {
  beforeEach(() => {
    rpc.mockReset();
  });

  it("maps the status payload from the database", async () => {
    rpc.mockResolvedValue({
      data: { ready_count: 2, waiting_count: 5 },
      error: null,
    });
    await expect(loadAutoVerifyStatus()).resolves.toEqual({
      readyCount: 2,
      waitingCount: 5,
    });
    expect(rpc).toHaveBeenCalledWith("auto_verify_status");
  });

  it("returns null when the call fails", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "denied" } });
    await expect(loadAutoVerifyStatus()).resolves.toBeNull();
  });
});
