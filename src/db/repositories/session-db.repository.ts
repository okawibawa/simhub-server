import { and, eq } from "drizzle-orm";

import { dbInstance } from "..";

import { sessionSchema, updateTimestamp } from "../schema";
import { idData } from "@/src/cores/common";
import { sessionData } from "@/src/cores";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionData) =>
    await dbInstance
      .getDbInstance()
      .insert(sessionSchema)
      .values({ sessionId, userId, expiresAt, isRevoked });

  const getSession = async ({ id }: idData) =>
    await dbInstance
      .getDbInstance()
      .select()
      .from(sessionSchema)
      .where(eq(sessionSchema.userId, id));

  const updateSession = async ({ id }: idData) =>
    await dbInstance
      .getDbInstance()
      .update(sessionSchema)
      .set({ isRevoked: true, expiresAt: updateTimestamp })
      .where(and(eq(sessionSchema.userId, id), eq(sessionSchema.isRevoked, false)));

  return {
    storeSession,
    getSession,
    updateSession,
  };
};

export const sessionDbRepository = session();
