import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number(),
});

export const createUpdateSchema = z.object({
  createdAt: z.string().trim().datetime({ precision: 6, offset: true }),
  updatedAt: z.string().trim().datetime({ precision: 6, offset: true }),
});

export type idData = z.infer<typeof idSchema>;
export type createUpdateData = z.infer<typeof createUpdateSchema>;
