import { eq } from "drizzle-orm";
import { dbInstance } from "..";

import { usersSchema } from "../schema";

const user = () => {
  const updateUser = async (id: number) =>
    await dbInstance
      .getDbInstance()
      .update(usersSchema)
      .set({ username: "oooooo" })
      .where(eq(usersSchema.id, id))
      .returning();

  return { updateUser };
};

export const userDbRepository = user();
