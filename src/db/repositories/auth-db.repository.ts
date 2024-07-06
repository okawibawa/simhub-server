import { eq } from "drizzle-orm";

import { authSignUpData, authSignInData } from "@/src/cores";
import { dbInstance } from "..";

import { usersSchema } from "../schema";

const authDb = () => {
  const createUser = async ({ email, username, password }: authSignUpData) =>
    await dbInstance
      .getDbInstance()
      .insert(usersSchema)
      .values({ email, username, password })
      .returning();

  const getUser = async ({ email }: Pick<authSignInData, "email">) =>
    await dbInstance.getDbInstance().select().from(usersSchema).where(eq(usersSchema.email, email));

  const getUserById = async ({ id }: Pick<authSignUpData, "id">) =>
    await dbInstance.getDbInstance().select().from(usersSchema).where(eq(usersSchema.id, id!));

  return {
    createUser,
    getUser,
    getUserById,
  };
};

export const authDbRepository = authDb();
