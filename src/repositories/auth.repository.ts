import { HTTPException } from "hono/http-exception";
import pg from "pg";

import { authDbRepository } from "../db/repositories";

import { authSignIn, authSignUp } from "../entities";

const auth = () => {
  const createUser = async ({ email, username, password }: authSignUp) => {
    try {
      await authDbRepository.createUser({ email, username, password });
    } catch (error) {
      if (error instanceof pg.DatabaseError) {
        if (error.code === "23505") {
          throw new HTTPException(400, { message: "Email is already taken!" });
        }
      }

      throw error;
    }
  };

  const getUser = ({ email }: authSignIn) => authDbRepository.getUser({ email });

  return { createUser, getUser };
};

export const authRepository = auth();
