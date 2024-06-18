import { eq } from "drizzle-orm";

import { authSignIn, authSignUp } from "@/src/entities";
import { dbInstance } from "..";

import { usersSchema } from "../schema";

const authDb = () => {
  const createUser = async ({ email, username, password }: authSignUp) =>
    await dbInstance
      .getDbInstance()
      .insert(usersSchema)
      .values({ email, username, password })
      .returning();

  const getUser = async ({ email }: Pick<authSignIn, "email">) =>
    await dbInstance.getDbInstance().select().from(usersSchema).where(eq(usersSchema.email, email));

  const getUserById = async ({ id }: Pick<authSignIn, "id">) =>
    await dbInstance.getDbInstance().select().from(usersSchema).where(eq(usersSchema.id, id!));

  return {
    createUser,
    getUser,
    getUserById,
  };
};

export const authDbRepository = authDb();
