import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

const databaseUrl = process.env.PGDATABASE 
  ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database credentials not found");
}

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });
