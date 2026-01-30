import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DATABASE_URL is not set");
}

const client = postgres(connectionString, {
  prepare: false,
  ssl: "require",
  connection: {
    application_name: "play_platform",
  },
});
export const db = drizzle(client, { schema });
