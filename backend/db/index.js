import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL || '';

// Enable SSL if PG_SSL is explicitly set, or if the connection string
// indicates SSL is required (e.g. '?sslmode=require') or if using Neon.
const useSsl =
  String(process.env.PG_SSL || 'false').toLowerCase() === 'true' ||
  /sslmode=requi(re|re)/i.test(connectionString) ||
  /neon\.tech/i.test(connectionString);

// Reuse a global pool in serverless environments to avoid exhausting
// database connections on cold starts / repeated imports.
if (!globalThis.__PG_POOL) {
  globalThis.__PG_POOL = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })
}

const pool = globalThis.__PG_POOL

export const db = drizzle(pool, { schema });
