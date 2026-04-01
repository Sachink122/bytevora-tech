import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use only DATABASE_URL for connections in production to avoid conflicts
const connectionString = process.env.DATABASE_URL || '';

// Default to SSL enabled for Supabase unless explicitly set to 'false'
const useSsl = String(process.env.PG_SSL ?? 'true').toLowerCase() === 'true';

if (!connectionString) {
  throw new Error('Missing required environment variable DATABASE_URL')
}

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
