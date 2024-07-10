import { z } from "zod";

export const userUsernameSchema = z.object({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }),
});

export const userSchema = z.object({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }).optional(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Minimum of 6 characters." })
    .regex(/[A-Z]/, {
      message: "Must contain an uppercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain one special character." })
    .optional(),
});

export type userUsernameData = z.infer<typeof userUsernameSchema>;
export type userSchemaData = z.infer<typeof userSchema>;
