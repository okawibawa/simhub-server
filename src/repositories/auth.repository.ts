import { HTTPException } from "hono/http-exception";
import pg from "pg";

import { authDbRepository } from "../db/repositories";

import { authSignInEntity, authSignUpEntity } from "../entities";

const auth = () => {
  const createUser = async ({
    email,
    username,
    password,
  }: authSignUpEntity): Promise<authSignUpEntity> => {
    try {
      const user = await authDbRepository.createUser({ email, username, password });

      return user[0];
    } catch (error) {
      if (error instanceof pg.DatabaseError) {
        if (error.code === "23505") {
          throw new HTTPException(400, { message: "Email is already taken!" });
        }
      }

      throw error;
    }
  };

  const getUser = async ({ email }: Pick<authSignInEntity, "email">): Promise<authSignInEntity> => {
    try {
      const user = await authDbRepository.getUser({ email });

      return user[0];
    } catch (error) {
      throw error;
    }
  };

  const getUserById = async ({ id }: Pick<authSignUpEntity, "id">): Promise<authSignUpEntity> => {
    try {
      const user = await authDbRepository.getUserById({ id });

      return user[0];
    } catch (error) {
      throw error;
    }
  };

  return { createUser, getUser, getUserById };
};

export const authRepository = auth();
