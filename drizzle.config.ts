import { defineConfig } from "drizzle-kit";

import { environment } from "./src/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: environment.databaseUrl,
  },
});
