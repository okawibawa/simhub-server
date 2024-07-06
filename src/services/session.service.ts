import { sessionRepository } from "../repositories";

import { sessionData } from "../cores";
import { isDatabaseError } from "../errors";
import { idData } from "../cores/common";

const session = () => {
  const storeSession = async ({ sessionId, token, userId, expiresAt, isRevoked }: sessionData) => {
    try {
      await sessionRepository.storeSession({ sessionId, token, userId, expiresAt, isRevoked });
    } catch (error: unknown) {
      throw error;
    }
  };

  const getSession = async ({ id }: idData) => {
    try {
      const userSession = await sessionRepository.getSession({ id });

      return userSession;
    } catch (error: unknown) {
      throw error;
    }
  };

  const revokeSession = async ({ id }: idData) => {
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
