import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authSignInDto, authSignOutDto, authSignUpDto } from "./entities";

import { authService } from "./services";
import { deleteCookie, setCookie } from "hono/cookie";

const app = new Hono();

app.post(
  "/sign-up",
  zValidator("form", authSignUpDto, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors });
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      const userJwt = await authService.signUp({
        email: validatedBody.email,
        username: validatedBody.username,
        password: validatedBody.password,
      });

      setCookie(c, "session_token", userJwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });

      return c.json({ ok: true, message: "User successfully created!", token: userJwt });
    } catch (error) {
      throw error;
    }
  }
);

app.post(
  "/sign-in",
  zValidator("form", authSignInDto, (result, c) => {
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
  zValidator("form", authSignOutDto, (result, c) => {
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
