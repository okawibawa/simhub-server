import { z } from "zod";

export const sessionSchema = z.object({
  sessionId: z.string(),
  userId: z.number(),
  expiresAt: z.string().datetime({ precision: 6, offset: true }),
  isRevoked: z.boolean().default(false),
});

export type session = z.infer<typeof sessionSchema>;
