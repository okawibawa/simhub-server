import { z } from "zod";

import { idSchema } from "./common";

export const userSchema = idSchema.extend({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }),
  email: z.string().trim().email({ message: "Invalid email format." }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Minimum of 6 characters." })
    .regex(/[A-Z]/, {
      message: "Must contain an uppercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain one special character." }),
});

export type userData = z.infer<typeof userSchema>;
