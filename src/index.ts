import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { environment } from "./config";

import { errorMiddleware } from "./middlewares";

import auth from "./auth";

const app = new Hono();
const port = environment.port || 8000;

app.use(
  cors({
    origin: ["https://simhub.okawibawa.dev"],
    credentials: true,
  })
);

app.use(async (_, next) => {
  await next();
  errorMiddleware;
});

app.get("/", (c) => {
  return c.text("Hono is running fiercely 🔥");
});

app.route("/auth", auth);

serve({
  fetch: app.fetch,
  port,
});
