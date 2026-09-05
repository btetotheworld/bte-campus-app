import { describe, expect, it } from "vitest";
import type { ActionResult } from "@/lib/actions/result";

describe("ActionResult", () => {
  it("carries data on success and a message on failure", () => {
    const ok: ActionResult<string> = { ok: true, data: "signed in" };
    const fail: ActionResult<string> = {
      ok: false,
      error: "That email or password is wrong.",
    };
    expect(ok.ok).toBe(true);
    expect(fail.ok).toBe(false);
  });
});
