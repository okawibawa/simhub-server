import path from "path";
import fs from "fs";
import { z } from "zod";
import { config } from "dotenv";

config();

const environmentSchema = z.object({
  PORT: z.coerce.number().int(),
  DATABASE_URL: z.string(),
});

const getEnvironmentPath = () => {
  return path.resolve(new URL(import.meta.url).pathname, `../../../.env.${process.env.NODE_ENV}`);
};

const loadEnvironmentVariables = () => {
  const environmentPath = getEnvironmentPath();

  if (!fs.existsSync(environmentPath)) {
    console.warn(`Environment variables file for the current environment is not found.`);
    return;
  }

  config({ path: environmentPath });
};

const validateEnvironment = () => {
  loadEnvironmentVariables();

  const parsedEnvironment = environmentSchema.safeParse(process.env);

  if (!parsedEnvironment.success) {
    console.error("Invalid environment variables:", parsedEnvironment.error.format());
    process.exit(1);
  }

  return {
    port: parsedEnvironment.data.PORT,
    databaseUrl: parsedEnvironment.data.DATABASE_URL,
  };
};

export const environment = validateEnvironment();
