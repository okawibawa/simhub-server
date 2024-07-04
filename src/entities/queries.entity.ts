import { z } from "zod";

export const queriesSchema = z.object({
  limit: z.coerce.number().positive(),
});

export const countriesSearchSchema = z.object({
  name: z.string().trim(),
});

export type queriesEntity = z.infer<typeof queriesSchema>;
export type countriesSearchEntity = z.infer<typeof countriesSearchSchema>;
