import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { authSignInDto, authSignOutDto, authSignUpDto } from "./entities";

import { authService } from "./services";

import { formatZodErrors } from "./utils";

const app = new Hono();

// TODO: add session middleware
// TODO: add service to check session

app.post(
  "/sign-up",
  zValidator("form", authSignUpDto, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
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

      setCookie(c, "usid", userJwt, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "simhub.okawibawa.dev" : "",
      });

      return c.json({ ok: true, message: "User successfully created!" }, 201);
    } catch (error: unknown) {
      throw error;
    }
  }
);

app.post(
  "/sign-in",
  zValidator("form", authSignInDto, (result, c) => {
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      const userJwt = await authService.signIn({
        email: validatedBody.email,
        password: validatedBody.password,
      });

      setCookie(c, "usid", userJwt, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "simhub.okawibawa.dev" : "",
      });

      // TODO: return user data
      return c.json({ ok: true, message: "User successfully logged in!" }, 200);
    } catch (error: unknown) {
      throw error;
    }
  }
);

app.post(
  "/sign-out",
  zValidator("form", authSignOutDto, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      await authService.signOut({ id: validatedBody.id });

      deleteCookie(c, "usid");

      return c.json({ ok: true, message: "User successfully logged out!" }, 200);
    } catch (error) {
      throw error;
    }
  }
);

export default app;
