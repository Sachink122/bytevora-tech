const dotenv = require('dotenv')
const { Client } = require('pg')

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.vercel_env' })
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL
if (!connectionString) {
  console.error('No DATABASE_URL found in environment')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    console.log('Using DATABASE_URL:', connectionString.replace(/:[^:]+@/, ':*****@'))
    await client.connect()

    const countTeam = await client.query('SELECT COUNT(*) as cnt FROM team_members')
    console.log('team_members count:', countTeam.rows[0].cnt)
    const rowsTeam = await client.query('SELECT id, name, role, email, status, created FROM team_members ORDER BY id LIMIT 5')
    console.log('team_members sample:', JSON.stringify(rowsTeam.rows, null, 2))

    const countBlog = await client.query('SELECT COUNT(*) as cnt FROM blog_posts')
    console.log('blog_posts count:', countBlog.rows[0].cnt)
    const rowsBlog = await client.query('SELECT id, title, slug, published, created_at FROM blog_posts ORDER BY id LIMIT 5')
    console.log('blog_posts sample:', JSON.stringify(rowsBlog.rows, null, 2))

  } catch (err) {
    console.error('Query failed:', err && err.stack ? err.stack : err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
