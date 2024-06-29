import { z } from "zod";

export const esimPlansParamsSchema = z.object({
  code: z.string().trim(),
});

export const esimPlanDetailsParamsSchema = z.object({
  id: z.coerce.number(),
});

export type esimPlansParamsEntity = z.infer<typeof esimPlansParamsSchema>;
export type esimPlanDetailsParamsEntity = z.infer<typeof esimPlanDetailsParamsSchema>;
