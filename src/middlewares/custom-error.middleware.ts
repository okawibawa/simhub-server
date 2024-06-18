import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

const customError = () => {
  return createMiddleware(async (c, next) => {
    await next();

    throw new HTTPException(400, { message: `${c.error?.message}` });
  });
};

export const customErrorMiddleware = customError;
