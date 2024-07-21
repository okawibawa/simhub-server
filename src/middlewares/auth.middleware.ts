import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import { sessionService } from "../services";

export const authMiddleware = createMiddleware(async (c, next) => {
  const { usid } = getCookie(c);

  const session = await sessionService.getSessionBySessionId({ sessionId: usid });

  const sessionExpiresAt = new Date(session.expiresAt);
  const currentDate = new Date();

  if (!session || session.isRevoked || sessionExpiresAt < currentDate) {
    return c.json({ ok: false, message: "Session invalid." }, 401);
  }

  await next();
});
