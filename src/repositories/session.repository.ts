import { sessionDbRepository } from "../db/repositories";

import { DatabaseError, isPgDatabaseError } from "../errors";

import { sessionData } from "../cores";
import { idData, sessionIdData } from "../cores/common";

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

  const getSessionBySessionId = async ({ sessionId }: sessionIdData): Promise<sessionData> => {
    try {
      const userSession = await sessionDbRepository.getSessionBySessionId({ sessionId });

      return userSession[0];
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getSessionByUserId = async ({ id }: idData): Promise<sessionData> => {
    try {
      const userSession = await sessionDbRepository.getSessionByUserId({ id });

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

  return { storeSession, revokeSession, getSessionBySessionId, getSessionByUserId };
};

export const sessionRepository = session();
