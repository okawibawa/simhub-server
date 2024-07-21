import { hash, compare } from "bcrypt";

import { authRepository } from "../repositories";

import { generateJwt, generateSesionId } from "../utils";

import { sessionService } from "./";

import { BadRequestError, NotFoundError } from "../errors";

import { idData } from "../cores/common";

import { authSignInData, authSignUpData } from "../cores";

const auth = () => {
  const signUp = async ({ email, username, password }: authSignUpData) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const user = await authRepository.createUser({ email, username, password: hashedPassword });

      const jwtToken = generateJwt({ userId: user.id, userEmail: user.email });
      const sessionId = generateSesionId();

      await sessionService.storeSession({
        sessionId: sessionId,
        token: jwtToken,
        userId: user.id!,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRevoked: false,
      });

      return { user, sessionId };
    } catch (error: unknown) {
      throw error;
    }
  };

  const signIn = async ({ email, password }: authSignInData) => {
    try {
      const user = await authRepository.getUser({ email });

      if (!user) {
        throw NotFoundError("User not found. Please make sure your email is correct.", 400);
      }

      const comparePassword = await compare(password, user.password);

      if (!comparePassword) {
        throw BadRequestError("Password incorrect. Please double check your password.", 400);
      }

      const userSession = await sessionService.getSessionByUserId({ id: user.id! });

      if (userSession) {
        await sessionService.revokeSession({ id: user.id! });
      }

      const jwtToken = generateJwt({ userId: user.id, userEmail: user.email });
      const sessionId = generateSesionId();

      await sessionService.storeSession({
        sessionId: sessionId,
        token: jwtToken,
        userId: user.id!,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRevoked: false,
      });

      return { user, sessionId };
    } catch (error) {
      throw error;
    }
  };

  const signOut = async ({ id }: idData) => {
    try {
      const user = await authRepository.getUserById({ id });

      if (!user) {
        throw NotFoundError("User not found. Please make sure your email is correct.", 400);
      }

      await sessionService.revokeSession({ id });
    } catch (error) {
      throw error;
    }
  };

  return {
    signUp,
    signIn,
    signOut,
  };
};

export const authService = auth();
