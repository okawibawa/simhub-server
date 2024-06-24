import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { environment } from "./config";

import { errorHandler } from "./middlewares";

import auth from "./auth";
import { initializeDatabaseInstance } from "./db";

type CustomContext = {
  db: NodePgDatabase;
};

const app = new Hono<{ Variables: CustomContext }>();
const port = environment.port || 8000;

const startServer = async () => {
  try {
    const dbManager = initializeDatabaseInstance();
    const db = await dbManager.getDbInstance();

    app.use(async (c, next) => {
      c.set("db", db);
      await next();
    });

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

    serve({
      fetch: app.fetch,
      port,
    });

    console.log(`Hono is running fiercely 🔥 on port ${port}`);
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
