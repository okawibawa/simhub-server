import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number(),
});

export const sessionIdSchema = z.object({
  sessionId: z.string().trim().min(1, { message: "Minimum of 1 characters." }),
});

export const createUpdateSchema = z.object({
  createdAt: z.string().trim().datetime({ precision: 6, offset: true }),
  updatedAt: z.string().trim().datetime({ precision: 6, offset: true }),
});

export type idData = z.infer<typeof idSchema>;
export type sessionIdData = z.infer<typeof sessionIdSchema>;
export type createUpdateData = z.infer<typeof createUpdateSchema>;
