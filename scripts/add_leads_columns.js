import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;
const useSsl = String(process.env.PG_SSL || 'false').toLowerCase() === 'true';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: useSsl ? { rejectUnauthorized: false } : undefined });

(async () => {
  try {
    const sql = `
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_name TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_name TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS service TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_details TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `;
    const res = await pool.query(sql);
    console.log('ALTER statements executed');
  } catch (e) {
    console.error('ALTER failed', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
