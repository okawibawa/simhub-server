import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { environment } from "./config";

const app = new Hono();
const port = environment.port || 8000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
