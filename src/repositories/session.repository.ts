import { sessionDbRepository } from "../db/repositories";

import { session, authSignOut } from "../entities";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: session) => {
    try {
      await sessionDbRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error) {
      throw error;
    }
  };

  const revokeSession = async ({ id }: authSignOut) => {
    try {
      await sessionDbRepository.updateSession({ id });
    } catch (error) {
      throw error;
    }
  };

  return { storeSession, revokeSession };
};

export const sessionRepository = session();
