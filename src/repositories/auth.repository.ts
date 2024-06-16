import pg from "pg";
import { HTTPException } from "hono/http-exception";
import { authSignUp } from "../entities";

import { authQuery } from "../db/queries";

const auth = () => {
  const createUser = async ({
    email,
    username,
    password,
  }: authSignUp): Promise<authSignUp[] | undefined> => {
    try {
      return await authQuery.createUser({ email, username, password });
    } catch (error) {
      throw new Error();
    }
  };

  return { createUser };
};

export const authRepository = auth();
