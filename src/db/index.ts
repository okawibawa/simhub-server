import { drizzle } from "drizzle-orm/node-postgres";

import pg from "pg";

import { environment } from "../config";

const initializeDatabaseInstance = () => {
  let db: ReturnType<typeof drizzle>;

  const createPool = (): pg.Pool => {
    const poolConfig: pg.PoolConfig = {
      connectionString: environment.databaseUrl,
      max: 5,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    };

    const pool = new pg.Pool(poolConfig);

    pool.connect(
      (err: Error | undefined, client: pg.PoolClient | undefined, release: () => void) => {
        if (err) {
          console.warn("Failed to initiate database connection: ", err.stack);
          process.exit(1);
        }
      }
    );

    return pool;
  };

  const createDbInstance = (): ReturnType<typeof drizzle> => {
    const pool = createPool();

    return drizzle(pool);
  };

  const getDbInstance = () => {
    if (!db) {
      db = createDbInstance();
      Object.freeze(db);
    }

    return db;
  };

  return {
    getDbInstance,
  };
};

export const dbInstance = initializeDatabaseInstance();
