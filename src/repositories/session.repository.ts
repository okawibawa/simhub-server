import { sessionDbRepository } from "../db/repositories";

import { sessionEntity, authSignOutEntity } from "../entities";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionEntity) => {
    try {
      await sessionDbRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error) {
      throw error;
    }
  };

  const getSession = async ({ id }: authSignOutEntity): Promise<sessionEntity> => {
    try {
      const userSession = await sessionDbRepository.getSession({ id });

      return userSession[0];
    } catch (error) {
      throw error;
    }
  };

  const revokeSession = async ({ id }: authSignOutEntity) => {
    try {
      await sessionDbRepository.updateSession({ id });
    } catch (error) {
      throw error;
    }
  };

  return { storeSession, revokeSession, getSession };
};

export const sessionRepository = session();
