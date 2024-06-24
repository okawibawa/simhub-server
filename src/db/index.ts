import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import pg from "pg";

import { environment } from "../config";

const MAX_RETIRES = 5;
const RETRY_DELAY = 5000;

export const initializeDatabaseInstance = () => {
  let db: NodePgDatabase;
  let pool: pg.Pool;

  const createPool = (): pg.Pool => {
    const poolConfig: pg.PoolConfig = {
      connectionString: environment.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

    return new pg.Pool(poolConfig);
  };

  const validateConnection = async (pool: pg.Pool): Promise<boolean> => {
    try {
      const client = await pool.connect();

      await client.query("SELECT 1");

      client.release();

      return true;
    } catch (error) {
      console.error("Connection validation failed: ", error);
      return false;
    }
  };

  const connectWithRetries = async (retries = 0): Promise<void> => {
    try {
      await pool.connect();
      console.log("Successfully connected to the database!");
    } catch (error) {
      console.warn(`Failed to connect to the database. Attempt: ${retries + 1}/${MAX_RETIRES}`);

      if (retries < MAX_RETIRES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return connectWithRetries(retries + 1);
      }

      console.error("Max retries reached. Exiting.");
      throw error;
    }
  };

  const createDbInstance = async (): Promise<NodePgDatabase> => {
    pool = createPool();

    pool.on("error", async (err) => {
      console.error("Unexpected error on the client.", err);

      try {
        await connectWithRetries();
      } catch (error) {
        console.error("Failed to reconnect after pool error.");
        process.exit(1);
      }
    });

    try {
      await connectWithRetries();
      return drizzle(pool);
    } catch (error) {
      console.log("Failed to create database instance.");
      throw error;
    }
  };

  const getDbInstance = async () => {
    if (!db) {
      db = await createDbInstance();
      Object.freeze(db);
    }

    if (!(await validateConnection(pool))) {
      console.warn("Connection failed, attempting to reconnect.");
      await connectWithRetries();
    }

    return db;
  };

  return {
    getDbInstance,
  };
};
