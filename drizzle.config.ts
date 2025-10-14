import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.PGDATABASE 
  ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database credentials not found");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
