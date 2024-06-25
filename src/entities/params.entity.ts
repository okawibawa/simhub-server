import { z } from "zod";

export const paramsSchema = z.object({
  limit: z.coerce.number().positive(),
});

export type paramsEntity = z.infer<typeof paramsSchema>;
