import { eq } from "drizzle-orm";
import { dbInstance } from "..";

import { usersSchema } from "../schema";

const user = () => {
  const getUser = async (id: number) =>
    await dbInstance.getDbInstance().select().from(usersSchema).where(eq(usersSchema.id, id));

  return { getUser };
};

export const userDbRepository = user();
