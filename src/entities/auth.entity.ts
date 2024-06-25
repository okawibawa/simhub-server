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

export const authSignInDto = authBaseSchema;
export const authSignUpDto = authBaseSchema.extend({
  username: z.string().trim().min(3, { message: "Minimum of 3 characters." }),
});
export const authSignOutDto = z.object({
  id: z.coerce.number(),
});

export type authSignInEntity = z.infer<typeof authSignInDto> & { id?: number };
export type authSignUpEntity = z.infer<typeof authSignUpDto> & { id?: number };
export type authSignOutEntity = z.infer<typeof authSignOutDto>;
