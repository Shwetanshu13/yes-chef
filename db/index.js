import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis;

const pool = globalForDb.pgPool || new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForDb.pgPool) globalForDb.pgPool = pool;

export const db = drizzle(pool);
