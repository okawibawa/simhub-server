import { z } from "zod";

export const authSignInSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(6, { message: "Minimum of 6 characters." })
    .regex(/^(?=.*[A-Z])(?=.*[\W_]).+$/, {
      message: "Must contain an uppercase and a special character.",
    }),
});

export type authSignIn = z.infer<typeof authSignInSchema>;

export const authSignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  username: z.string().min(3, { message: "Minimum of 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Minimum of 6 characters." })
    .regex(/[A-Z]/, {
      message: "Must contain an uppercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Must contain one special character." }),
});

export type authSignUp = z.infer<typeof authSignUpSchema>;
