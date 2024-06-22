import { eq } from "drizzle-orm";

import { dbInstance } from "..";

import { sessionSchema, updateTimestamp } from "../schema";

import { sessionEntity, authSignOutEntity } from "@/src/entities";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionEntity) =>
    await dbInstance
      .getDbInstance()
      .insert(sessionSchema)
      .values({ sessionId, userId, expiresAt, isRevoked });

  const updateSession = async ({ id }: authSignOutEntity) =>
    await dbInstance
      .getDbInstance()
      .update(sessionSchema)
      .set({ isRevoked: true, expiresAt: updateTimestamp })
      .where(eq(sessionSchema.userId, id));

  return {
    storeSession,
    updateSession,
  };
};

export const sessionDbRepository = session();
