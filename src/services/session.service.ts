import { sessionRepository } from "../repositories/session.repository";

import { session, authSignOut } from "../entities";
import { HTTPException } from "hono/http-exception";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: session) => {
    try {
      await sessionRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error) {
      throw error;
    }
  };

  const revokeSession = async ({ id }: authSignOut) => {
    try {
      await sessionRepository.revokeSession({ id });
    } catch (error) {
      throw error;
    }
  };

  return {
    storeSession,
    revokeSession,
  };
};

export const sessionService = session();
