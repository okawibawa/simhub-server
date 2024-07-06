import { z } from "zod";

export const userUsernameSchema = z.object({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }),
});

export type userUsernameData = z.infer<typeof userUsernameSchema>;
