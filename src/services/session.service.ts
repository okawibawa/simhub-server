import { sessionRepository } from "../repositories";

import { sessionEntity, authSignOutEntity } from "../entities";
import { isDatabaseError } from "../errors";

const session = () => {
  const storeSession = async ({ sessionId, userId, expiresAt, isRevoked }: sessionEntity) => {
    try {
      await sessionRepository.storeSession({ sessionId, userId, expiresAt, isRevoked });
    } catch (error: unknown) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const getSession = async ({ id }: authSignOutEntity) => {
    try {
      const userSession = await sessionRepository.getSession({ id });

      return userSession;
    } catch (error: unknown) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const revokeSession = async ({ id }: authSignOutEntity) => {
    try {
      await sessionRepository.revokeSession({ id });
    } catch (error) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  return {
    storeSession,
    getSession,
    revokeSession,
  };
};

export const sessionService = session();
