import { sessionRepository } from "../repositories/session.repository";

import { sessionEntity, authSignOutEntity } from "../entities";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionEntity) => {
    try {
      await sessionRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error) {
      throw error;
    }
  };

  const getSession = async ({ id }: authSignOutEntity) => {
    try {
      const userSession = await sessionRepository.getSession({ id });

      return userSession;
    } catch (error) {
      throw error;
    }
  };

  const revokeSession = async ({ id }: authSignOutEntity) => {
    try {
      await sessionRepository.revokeSession({ id });
    } catch (error) {
      throw error;
    }
  };

  return {
    storeSession,
    getSession,
    revokeSession,
  };
};

export const sessionService = session();
