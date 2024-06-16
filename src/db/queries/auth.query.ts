import pg from "pg";

import { authSignUp } from "@/src/entities";
import { dbInstance } from "..";

import { users } from "../schema";

const auth = () => {
  const createUser = async ({
    email,
    username,
    password,
  }: authSignUp): Promise<authSignUp[] | undefined> => {
    try {
      const db = dbInstance.getDbInstance();

      const createdUser = await db.insert(users).values({ email, username, password }).returning();

      return createdUser;
    } catch (error) {
      if (error instanceof pg.DatabaseError) {
        console.log({ message: error });
        throw new Error(error.message);
      }

      throw new Error();
    }
  };

  return {
    createUser,
  };
};

export const authQuery = auth();
