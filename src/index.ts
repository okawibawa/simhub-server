import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { environment } from "./config";

import { authMiddleware, errorHandler } from "./middlewares";

import auth from "./auth";
import countries from "./countries";
import esims from "./esims";
import users from "./users";

const app = new Hono();
const port = environment.port || 8001;

app.use(
  cors({
    origin: ["https://simhub.okawibawa.dev", "localhost"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

["/users/*"].map((path) => {
  app.use(path, authMiddleware);
});

app.onError(errorHandler);

app.get("/", (c) => {
  return c.text("Hono is running fiercely 🔥");
});

app.route("/auth", auth);
app.route("/countries", countries);
app.route("/esims", esims);
app.route("/users", users);

serve({
  fetch: app.fetch,
  port,
});
