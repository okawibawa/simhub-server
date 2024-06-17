import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authSignInSchema, authSignUpSchema } from "./entities";

import { authService } from "./services";

const app = new Hono();

app.post(
  "/sign-up",
  zValidator("form", authSignUpSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: result.error.errors });
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      await authService.signUp({
        email: validatedBody.email,
        username: validatedBody.username,
        password: validatedBody.password,
      });

      return c.json({ ok: true, message: "User successfully created!" });
    } catch (error) {
      throw error;
    }
  }
);

app.post(
  "/sign-in",
  zValidator("form", authSignInSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: result.error.errors });
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      await authService.signIn({ email: validatedBody.email, password: validatedBody.password });

      return c.json({ ok: true, message: "User successfully logged in!" });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
