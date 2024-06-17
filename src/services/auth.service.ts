import bcrypt from "bcrypt";

import { authSignIn, authSignUp } from "../entities";

import { authRepository } from "../repositories/auth.repository";
import { HTTPException } from "hono/http-exception";

const auth = () => {
  const signUp = async ({ email, username, password }: authSignUp) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await authRepository.createUser({ email, username, password: hashedPassword });
    } catch (error) {
      throw error;
    }
  };

  const signIn = async ({ email, password }: authSignIn) => {
    try {
      const user = await authRepository.getUser({ email });

      if (!user) {
        throw new HTTPException(400, { message: "User not found!" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        throw new HTTPException(400, { message: "Wrong password!" });
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    signUp,
    signIn,
  };
};

export const authService = auth();
