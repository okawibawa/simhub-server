import * as pg from "pg";

import { authDbRepository } from "../db/repositories";

import { authSignInEntity, authSignUpEntity } from "../entities";

import { DatabaseError as CustomDatabaseError, isPgDatabaseError } from "../errors";

const auth = () => {
  const createUser = async ({
    email,
    username,
    password,
  }: authSignUpEntity): Promise<authSignUpEntity> => {
    try {
      const user = await authDbRepository.createUser({ email, username, password });

      return user[0];
    } catch (error: unknown) {
      if (isPgDatabaseError(error)) {
        if (error.constraint === "users_email_unique") {
          throw CustomDatabaseError(`Email is already taken.`, 400);
        }

        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const getUser = async ({ email }: Pick<authSignInEntity, "email">): Promise<authSignInEntity> => {
    try {
      const user = await authDbRepository.getUser({ email });

      return user[0];
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  const getUserById = async ({ id }: Pick<authSignUpEntity, "id">): Promise<authSignUpEntity> => {
    try {
      const user = await authDbRepository.getUserById({ id });

      return user[0];
    } catch (error: unknown) {
      if (isPgDatabaseError(error)) {
        throw CustomDatabaseError(`Database error: ${error.message}`, 500);
      }

      throw Error("An unexpected error occurred.");
    }
  };

  return { createUser, getUser, getUserById };
};

export const authRepository = auth();
