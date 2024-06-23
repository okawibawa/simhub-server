import { createMiddleware } from "hono/factory";
import { isBadRequestError, isDatabaseError, isNotFoundError, isValidationError } from "../errors";

export const errorMiddleware = createMiddleware(async (c) => {
  if (isDatabaseError(c.error)) {
    return c.json({ ok: false, message: c.error.message }, c.error.code);
  }

  if (isNotFoundError(c.error)) {
    return c.json({ ok: false, message: c.error.message }, c.error.code);
  }

  if (isValidationError(c.error)) {
    return c.json({ ok: false, message: c.error.message }, c.error.code);
  }

  if (isBadRequestError(c.error)) {
    return c.json({ ok: false, message: c.error.message }, c.error.code);
  }

  return c.json({ ok: false, message: "An unexpected error occurred." }, 500);
});
