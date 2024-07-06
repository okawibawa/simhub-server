import { eq } from "drizzle-orm";
import { dbInstance } from "..";

import { usersSchema } from "../schema";

const user = () => {
  const updateUser = async (id: number, username: string) =>
    await dbInstance
      .getDbInstance()
      .update(usersSchema)
      .set({ username })
      .where(eq(usersSchema.id, id))
      .returning();

  return { updateUser };
};

export const userDbRepository = user();
