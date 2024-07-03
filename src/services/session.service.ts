import { sessionRepository } from "../repositories";

import { sessionEntity, authSignOutEntity } from "../entities";
import { isDatabaseError } from "../errors";

const session = () => {
  const storeSession = async ({
    sessionId,
    token,
    userId,
    expiresAt,
    isRevoked,
  }: sessionEntity) => {
    try {
      await sessionRepository.storeSession({ sessionId, token, userId, expiresAt, isRevoked });
    } catch (error: unknown) {
      throw error;
    }
  };

  const getSession = async ({ id }: authSignOutEntity) => {
    try {
      const userSession = await sessionRepository.getSession({ id });

      return userSession;
    } catch (error: unknown) {
      throw error;
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
