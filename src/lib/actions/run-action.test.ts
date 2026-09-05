import { describe, expect, it } from "vitest";
import { z } from "zod";
import { runAction } from "@/lib/actions/run-action";

const schema = z.object({
  name: z.string().min(1, "Enter a name"),
});

describe("runAction", () => {
  it("returns the first schema error without calling execute", async () => {
    let called = false;
    const result = await runAction(schema, { name: "" }, async () => {
      called = true;
      return { ok: true, data: true };
    });
    expect(called).toBe(false);
    expect(result).toEqual({ ok: false, error: "Enter a name" });
  });

  it("passes parsed input to execute", async () => {
    const result = await runAction(schema, { name: "Ada" }, async (data) => {
      return { ok: true, data: data.name };
    });
    expect(result).toEqual({ ok: true, data: "Ada" });
  });

  it("surfaces a thrown error as a typed failure", async () => {
    const result = await runAction(schema, { name: "Ada" }, async () => {
      throw new Error("network");
    });
    expect(result).toEqual({
      ok: false,
      error: "Something went wrong. Try again.",
    });
  });
});
