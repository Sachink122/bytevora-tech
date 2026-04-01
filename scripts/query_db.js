import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env.local' })
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL
if (!connectionString) {
  console.error('No DATABASE_URL found in environment')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log('\n-- team_members --')
    const tm = await client.query('SELECT id, name, role, email, phone, skills, status, created FROM team_members ORDER BY id')
    console.log(JSON.stringify(tm.rows, null, 2))

    console.log('\n-- blog_posts --')
    const bp = await client.query('SELECT id, title, slug, meta_title, meta_description, summary, published, created_at FROM blog_posts ORDER BY id')
    console.log(JSON.stringify(bp.rows, null, 2))
  } catch (err) {
    console.error('Query failed', err?.message || err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
