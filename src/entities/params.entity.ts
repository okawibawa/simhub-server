import { z } from "zod";

export const esimPlansParamsSchema = z.object({
  code: z.string().trim(),
});

export type esimPlansParamsEntity = z.infer<typeof esimPlansParamsSchema>;
