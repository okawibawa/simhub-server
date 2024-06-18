import { eq } from "drizzle-orm";

import { dbInstance } from "..";

import { sessionSchema } from "../schema";

import { session, authSignOut } from "@/src/entities";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: session) =>
    await dbInstance
      .getDbInstance()
      .insert(sessionSchema)
      .values({ sessionId, userId, expiresAt, isRevoked });

  const updateSession = async ({ id }: authSignOut) =>
    await dbInstance
      .getDbInstance()
      .update(sessionSchema)
      .set({ isRevoked: true, expiresAt: new Date().toISOString() })
      .where(eq(sessionSchema.userId, id));

  return {
    storeSession,
    updateSession,
  };
};

export const sessionDbRepository = session();
