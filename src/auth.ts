import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authSignUpSchema } from "./entities";

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
      const user = await authService.signUp({
        email: validatedBody.email,
        username: validatedBody.username,
        password: validatedBody.password,
      });

      console.log({ user });

      return c.json(user);
    } catch (error) {
      throw new Error();
    }
  }
);

export default app;
