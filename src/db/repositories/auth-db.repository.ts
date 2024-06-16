import { authSignIn, authSignUp } from "@/src/entities";
import { dbInstance } from "..";

import { users } from "../schema";
import { eq } from "drizzle-orm";

const authDb = () => {
  const createUser = async ({ email, username, password }: authSignUp) =>
    await dbInstance.getDbInstance().insert(users).values({ email, username, password });

  const getUser = async ({ email }: Pick<authSignIn, "email">) =>
    await dbInstance.getDbInstance().select().from(users).where(eq(users.email, email));

  return {
    createUser,
    getUser,
  };
};

export const authDbRepository = authDb();
