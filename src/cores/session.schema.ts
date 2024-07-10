import { z } from "zod";

// import { createUpdateSchema } from "./common";

export const sessionSchema = z.object({
  sessionId: z.string().trim(),
  token: z.string().trim().nullable(),
  userId: z.number(),
  expiresAt: z.string().trim().datetime({ precision: 6, offset: true }),
  isRevoked: z.boolean().default(false),
});

export type sessionData = z.infer<typeof sessionSchema>;
