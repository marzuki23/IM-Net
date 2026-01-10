import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = global as unknown as {
  db: PostgresJsDatabase<typeof schema> | undefined;
};

const client = postgres(process.env.DATABASE_URL!);

export const db: PostgresJsDatabase<typeof schema> =
  globalForDb.db ??
  drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export * from "./schema";
