import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { environment } from "./config";

// import { customErrorMiddleware } from "./middlewares/custom-error.middleware";

import auth from "./auth";

const app = new Hono();
const port = environment.port || 8000;

app.get("/", (c) => {
  return c.text("Hono is running fiercely 🔥");
});

app.route("/auth", auth);

// app.use(customErrorMiddleware());

serve({
  fetch: app.fetch,
  port,
});
