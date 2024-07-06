import { z } from "zod";

const authBaseSchema = z.object({
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

export const authSignInSchema = authBaseSchema;
export const authSignUpSchema = authBaseSchema.extend({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }),
});

export type authSignInData = z.infer<typeof authSignInSchema> & { id?: number };
export type authSignUpData = z.infer<typeof authSignUpSchema> & { id?: number };
