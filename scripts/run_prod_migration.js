import fs from 'fs'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' })

const sql = fs.readFileSync('drizzle/ensure_schema_v2.sql', 'utf8')
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL

if (!connectionString) {
  console.error('No DATABASE_URL found in environment')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log('Connected, running migration...')
    await client.query(sql)
    console.log('Migration completed')
  } catch (err) {
    console.error('Migration failed', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
