import bcrypt from "bcrypt";
import { HTTPException } from "hono/http-exception";

import { authSignInEntity, authSignUpEntity, authSignOutEntity } from "../entities";

import { authRepository } from "../repositories/auth.repository";

import { generateJwt } from "../utils";

import { sessionService } from "./";

const auth = () => {
  const signUp = async ({ email, username, password }: authSignUpEntity) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await authRepository.createUser({ email, username, password: hashedPassword });

      const jwtToken = generateJwt({ userId: user.id, userEmail: user.email });

      await sessionService.storeSession({
        sessionId: jwtToken,
        userId: user.id!,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRevoked: false,
      });

      return jwtToken;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async ({ email, password }: authSignInEntity) => {
    try {
      const user = await authRepository.getUser({ email });

      if (!user) {
        throw new HTTPException(400, { message: "User not found!" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        throw new HTTPException(400, { message: "Wrong password!" });
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
      throw error;
    }
  };

  const signOut = async ({ id }: authSignOutEntity) => {
    try {
      const user = await authRepository.getUserById({ id });

      if (!user) {
        throw new HTTPException(400, { message: "User not found!" });
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
