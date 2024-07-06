import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { authService } from "./services";

import { idSchema } from "./cores/common";
import { authSignInSchema, authSignUpSchema } from "./cores";

import { formatZodErrors } from "./utils";

const app = new Hono();

// TODO: add session middleware
// TODO: add service to check session

app.post(
  "/sign-up",
  zValidator("form", authSignUpSchema, (result, c) => {
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      const { user, sessionId } = await authService.signUp({
        email: validatedBody.email,
        username: validatedBody.username,
        password: validatedBody.password,
      });

      setCookie(c, "usid", sessionId, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "simhub.okawibawa.dev" : "",
      });

      return c.json({ ok: true, message: "User successfully created!", data: user }, 201);
    } catch (error: unknown) {
      throw error;
    }
  }
);

app.post(
  "/sign-in",
  zValidator("form", authSignInSchema, (result, c) => {
    console.log({ result });

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
    }
  }),
  async (c) => {
    const validatedBody = c.req.valid("form");

    try {
      const { user, sessionId } = await authService.signIn({
        email: validatedBody.email,
        password: validatedBody.password,
      });

      setCookie(c, "usid", sessionId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "simhub.okawibawa.dev" : "",
      });

      return c.json({ ok: true, message: "User successfully logged in!", data: user }, 200);
    } catch (error: unknown) {
      throw error;
    }
  }
);

app.post(
  "/sign-out",
  zValidator("form", idSchema, (result, c) => {
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
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
