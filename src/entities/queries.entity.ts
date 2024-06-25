import { z } from "zod";

export const queriesSchema = z.object({
  limit: z.coerce.number().positive(),
});

export type queriesEntity = z.infer<typeof queriesSchema>;
