import { Pool } from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env" }); // Load .env file in non-production environments
}

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`;

export const pool = new Pool({
  connectionString: connectionString,
  max: 5,
  idleTimeoutMillis: 300000,
  // connectionTimeoutMillis: 2000,  // Timeout for acquiring a new connection
});
