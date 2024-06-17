import { HTTPException } from "hono/http-exception";
import pg from "pg";

import { authDbRepository } from "../db/repositories";

import { authSignIn, authSignUp } from "../entities";

const auth = () => {
  const createUser = async ({ email, username, password }: authSignUp) => {
    try {
      await authDbRepository.createUser({ email, username, password });
    } catch (error) {
      console.log({ error });

      if (error instanceof pg.DatabaseError) {
        if (error.code === "23505") {
          throw new HTTPException(400, { message: "Email is already taken!" });
        }
      }

      throw error;
    }
  };

  const getUser = async ({ email }: Pick<authSignIn, "email">): Promise<authSignIn> => {
    try {
      const user = await authDbRepository.getUser({ email });

      return user[0];
    } catch (error) {
      throw error;
    }
  };

  return { createUser, getUser };
};

export const authRepository = auth();
