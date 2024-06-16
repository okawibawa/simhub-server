import bcrypt from "bcrypt";

import { authSignIn, authSignUp } from "../entities";

import { authRepository } from "../repositories";

const auth = () => {
  async function signUp({ email, username, password }: authSignUp) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      return await authRepository.createUser({ email, username, password: hashedPassword });
    } catch (error) {
      throw new Error();
    }
  }

  async function signIn({ email, password }: authSignIn) {
    return { email, password };
  }

  return { signUp, signIn };
};

export const authService = auth();
