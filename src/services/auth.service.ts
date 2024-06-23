import { hash, compare } from "bcrypt";

import { authSignInEntity, authSignUpEntity, authSignOutEntity } from "../entities";

import { authRepository } from "../repositories";

import { generateJwt } from "../utils";

import { sessionService } from "./";

import { BadRequestError, NotFoundError, isDatabaseError, isPgDatabaseError } from "../errors";

const auth = () => {
  const signUp = async ({ email, username, password }: authSignUpEntity) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const user = await authRepository.createUser({ email, username, password: hashedPassword });

      const jwtToken = generateJwt({ userId: user.id, userEmail: user.email });

      await sessionService.storeSession({
        sessionId: jwtToken,
        userId: user.id!,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRevoked: false,
      });

      return jwtToken;
    } catch (error: unknown) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const signIn = async ({ email, password }: authSignInEntity) => {
    try {
      const user = await authRepository.getUser({ email });

      if (!user) {
        throw NotFoundError("User not found!", 400);
      }

      const comparePassword = await compare(password, user.password);

      if (!comparePassword) {
        throw BadRequestError("Wrong password!", 400);
      }

      const userSession = await sessionService.getSession({ id: user.id! });

      if (userSession) {
        await sessionService.revokeSession({ id: user.id! });
      }

      const jwtToken = generateJwt({ userId: user.id, userEmail: user.email });

      await sessionService.storeSession({
        sessionId: jwtToken,
        userId: user.id!,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRevoked: false,
      });

      return jwtToken;
    } catch (error) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const signOut = async ({ id }: authSignOutEntity) => {
    try {
      const user = await authRepository.getUserById({ id });

      if (!user) {
        throw NotFoundError("User not found!", 400);
      }

      await sessionService.revokeSession({ id });
    } catch (error) {
      if (isDatabaseError(error)) {
        console.error(error);
        throw error;
      }

      throw Error("An unexpected error occurred.");
    }
  };

  return {
    signUp,
    signIn,
    signOut,
  };
};

export const authService = auth();
