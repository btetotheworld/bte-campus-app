import type { z } from "zod";
import type { ActionResult } from "@/lib/actions/result";

export async function runAction<TInput, TOutput>(
  schema: z.ZodType<TInput>,
  input: unknown,
  execute: (data: TInput) => Promise<ActionResult<TOutput>>
): Promise<ActionResult<TOutput>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  try {
    return await execute(parsed.data);
  } catch {
    return { ok: false, error: "Something went wrong. Try again." };
  }
}
