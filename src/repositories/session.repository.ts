import * as pg from "pg";

import { sessionDbRepository } from "../db/repositories";

import { sessionEntity, authSignOutEntity } from "../entities";

import { DatabaseError as CustomDatabaseError, isPgDatabaseError } from "../errors";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionEntity) => {
    try {
      await sessionDbRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const getSession = async ({ id }: authSignOutEntity): Promise<sessionEntity> => {
    try {
      const userSession = await sessionDbRepository.getSession({ id });

      return userSession[0];
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const revokeSession = async ({ id }: authSignOutEntity) => {
    try {
      await sessionDbRepository.updateSession({ id });
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  return { storeSession, revokeSession, getSession };
};

export const sessionRepository = session();
