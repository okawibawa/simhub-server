import { z } from "zod";
import { config } from "dotenv";

config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().int(),
  DATABASE_URL: z.string(),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error("Invalid environment variables:", parsedEnvironment.error.format());
  process.exit(1);
}

export const environment = {
  port: parsedEnvironment.data.PORT,
  databaseUrl: parsedEnvironment.data.DATABASE_URL,
};
