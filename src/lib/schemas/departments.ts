import { z } from "zod";
import type { Database } from "@/lib/db/types";

const kinds = [
  "team",
  "campus_chapter",
] as const satisfies readonly Database["public"]["Enums"]["department_kind"][];

export const createDepartmentSchema = z.strictObject({
  name: z.string().trim().min(1, "Enter the department name."),
  kind: z.enum(kinds, { error: "Choose a department kind." }),
});
