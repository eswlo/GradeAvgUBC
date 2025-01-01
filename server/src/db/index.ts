import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.cwd());

const connectionString =
  process.env.NODE_ENV === "development"
    ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`
    : process.env.PGRENDERURL;

console.log(connectionString);

export const pool = new Pool({
  connectionString: connectionString,
  max: 5,
  idleTimeoutMillis: 300000,
  // connectionTimeoutMillis: 2000,  // Timeout for acquiring a new connection
});
