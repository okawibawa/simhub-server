import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { environment } from "./config";

import { errorHandler } from "./middlewares";

import auth from "./auth";
import countries from "./countries";

const app = new Hono();
const port = environment.port || 8000;

app.use(
  cors({
    origin: ["https://simhub.okawibawa.dev"],
    credentials: true,
  })
);

app.onError(errorHandler);

app.get("/", (c) => {
  return c.text("Hono is running fiercely 🔥");
});

app.route("/auth", auth);
app.route("/countries", countries);

serve({
  fetch: app.fetch,
  port,
});
