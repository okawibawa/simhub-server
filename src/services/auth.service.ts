import bcrypt from "bcrypt";

import { authSignIn, authSignUp } from "../entities";

import { authRepository } from "../repositories/auth.repository";

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
    return { email, password };
  };

  return {
    signUp,
    signIn,
  };
};

export const authService = auth();
