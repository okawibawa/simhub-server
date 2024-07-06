import { eq } from "drizzle-orm";
import { dbInstance } from "..";

import { usersSchema } from "../schema";
import { userSchemaData } from "@/src/cores/validation";

const user = () => {
  const updateUser = async (id: number, body: userSchemaData) =>
    await dbInstance
      .getDbInstance()
      .update(usersSchema)
      .set({ ...body })
      .where(eq(usersSchema.id, id))
      .returning();

  return { updateUser };
};

export const userDbRepository = user();
