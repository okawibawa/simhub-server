import { authDbRepository } from "../db/repositories";

import { authSignUpData, authSignInData } from "../cores";

import { DatabaseError, isPgDatabaseError } from "../errors";

const auth = () => {
  const createUser = async ({
    email,
    username,
    password,
  }: authSignUpData): Promise<authSignUpData> => {
    try {
      const user = await authDbRepository.createUser({ email, username, password });

      return user[0];
    } catch (error: unknown) {
      if (isPgDatabaseError(error)) {
        if (error.constraint === "users_email_unique") {
          throw DatabaseError(`Email is already taken.`, 400);
        }

        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getUser = async ({ email }: Pick<authSignInData, "email">): Promise<authSignInData> => {
    try {
      const user = await authDbRepository.getUser({ email });

      return user[0];
    } catch (error) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  const getUserById = async ({ id }: Pick<authSignUpData, "id">): Promise<authSignUpData> => {
    try {
      const user = await authDbRepository.getUserById({ id });

      return user[0];
    } catch (error: unknown) {
      if (isPgDatabaseError(error)) {
        throw DatabaseError(`Database error: ${error.message}`, 500);
      }

      throw error;
    }
  };

  return { createUser, getUser, getUserById };
};

export const authRepository = auth();
