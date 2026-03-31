import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './backend/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pg',
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL || '',
});
