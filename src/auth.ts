import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authSignInDto, authSignOutDto, authSignUpDto } from "./entities";

import { authService } from "./services";
import { deleteCookie, setCookie } from "hono/cookie";
import { isBadRequestError, isDatabaseError, isNotFoundError, isValidationError } from "./errors";

const app = new Hono();

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

      setCookie(c, "session_token", userJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: "simhub.okawibawa.dev",
      });

      return c.json({ ok: true, message: "User successfully created!" }, 201);
    } catch (error: unknown) {
      if (isDatabaseError(error)) {
        return c.json({ ok: false, message: error.message }, error.code);
      }

      if (isNotFoundError(error)) {
        return c.json({ ok: false, message: error.message }, error.code);
      }

      if (isValidationError(error)) {
        return c.json({ ok: false, message: error.message }, error.code);
      }

      if (isBadRequestError(error)) {
        return c.json({ ok: false, message: error.message }, error.code);
      }

      return c.json({ ok: false, message: "An unexpected error occurred." }, 500);
    }
  }
);

app.post(
  "/sign-in",
  zValidator("form", authSignInDto, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        path: "/",
        domain: "simhub.okawibawa.dev",
      });

      return c.json({ ok: true, message: "User successfully logged in!" }, 200);
    } catch (error: unknown) {
      if (isDatabaseError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isNotFoundError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isValidationError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isBadRequestError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      return c.json({ ok: false, error: "An unexpected error occurred." }, 500);
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

      deleteCookie(c, "session_token");

      return c.json({ ok: true, message: "User successfully logged out!" }, 200);
    } catch (error) {
      if (isDatabaseError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isNotFoundError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isValidationError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      if (isBadRequestError(error)) {
        return c.json({ ok: false, error: error.message }, error.code);
      }

      return c.json({ ok: false, error: "An unexpected error occurred." }, 500);
    }
  }
);

export default app;
