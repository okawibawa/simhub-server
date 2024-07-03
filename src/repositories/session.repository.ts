import { sessionDbRepository } from "../db/repositories";

import { sessionEntity, authSignOutEntity } from "../entities";

import { DatabaseError, isPgDatabaseError } from "../errors";

const session = () => {
  const storeSession = async ({
    sessionId,
    token,
    userId,
    expiresAt,
    isRevoked,
  }: sessionEntity) => {
    try {
      await sessionDbRepository.storeSession({ sessionId, token, userId, expiresAt, isRevoked });
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getSession = async ({ id }: authSignOutEntity): Promise<sessionEntity> => {
    try {
      const userSession = await sessionDbRepository.getSession({ id });

      return userSession[0];
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const revokeSession = async ({ id }: authSignOutEntity) => {
    try {
      await sessionDbRepository.updateSession({ id });
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  return { storeSession, revokeSession, getSession };
};

export const sessionRepository = session();
