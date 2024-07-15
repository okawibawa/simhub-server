import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

import { isBadRequestError, isDatabaseError, isNotFoundError, isValidationError } from "../errors";

interface CustomError extends Error {
  name: string;
  code: StatusCode;
}

const isCustomError = (error: unknown): error is CustomError => {
  return (
    isDatabaseError(error) ||
    isNotFoundError(error) ||
    isValidationError(error) ||
    isBadRequestError(error)
  );
};

export const errorHandler = (_: Error, c: Context) => {
  if (isCustomError(c.error)) {
    return c.json({ ok: false, message: c.error.message }, c.error.code);
  }

  return c.json({ ok: false, message: "An unexpected error occurred." }, 500);
};
