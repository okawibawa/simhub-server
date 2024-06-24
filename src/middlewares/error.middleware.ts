import { Context } from "hono";
import { isBadRequestError, isDatabaseError, isNotFoundError, isValidationError } from "../errors";

export const errorHandler = (_: Error, c: Context) => {
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
};
