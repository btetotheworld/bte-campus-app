import { z } from "zod";

export const archiveDepartmentSchema = z.strictObject({
  id: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "Choose a valid department and try again."
    ),
});
