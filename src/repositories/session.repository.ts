import { sessionDbRepository } from "../db/repositories";

import { DatabaseError, isPgDatabaseError } from "../errors";

import { sessionData } from "../cores";
import { idData } from "../cores/common";

const session = () => {
  const storeSession = async ({ sessionId, token, userId, expiresAt, isRevoked }: sessionData) => {
    try {
      await sessionDbRepository.storeSession({ sessionId, token, userId, expiresAt, isRevoked });
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getSession = async ({ id }: idData): Promise<sessionData> => {
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

  const revokeSession = async ({ id }: idData) => {
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
