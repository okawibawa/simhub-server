import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authSignInSchema, authSignOutSchema, authSignUpSchema } from "./entities";

import { authService, sessionService } from "./services";
import { deleteCookie, setCookie } from "hono/cookie";

const app = new Hono();

app.post(
  "/sign-up",
  zValidator("form", authSignUpSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors });
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
      return c.json({ ok: false, message: result.error.errors });
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      const userJwt = await authService.signIn({
        email: validatedBody.email,
        password: validatedBody.password,
      });

      setCookie(c, "session_token", userJwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });

      return c.json({ ok: true, message: "User successfully logged in!", token: userJwt });
    } catch (error) {
      throw error;
    }
  }
);

app.post(
  "/sign-out",
  zValidator("form", authSignOutSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors });
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      await authService.signOut({ id: validatedBody.id });

      deleteCookie(c, "session_token");

      return c.json({ ok: true, message: "User successfully logged out!" });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
