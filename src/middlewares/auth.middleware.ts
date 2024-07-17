import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authToken = c.req.header("Authorization");

  const usid = getCookie(c);

  console.log(usid);

  if (!authToken) {
    return c.json({ ok: false, message: "Unauthorized." }, 401);
  }

  await next();
});
