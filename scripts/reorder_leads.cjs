#!/usr/bin/env node
/**
 * Safe reorder script for `leads` table.
 * Usage:
 *   CONFIRM_REORDER=true node scripts/reorder_leads.js
 * This will:
 *  - create `leads_new` if missing
 *  - copy data from `leads` to `leads_new`
 *  - verify row counts match
 *  - rename `leads` -> `leads_old` and `leads_new` -> `leads`
 * Safety: requires CONFIRM_REORDER=true. Uses DATABASE_URL env var.
 */
const { Client } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || process.env.STORAGE_URL
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL or STORAGE_URL must be set. Aborting.')
  process.exit(1)
}

if (process.env.CONFIRM_REORDER !== 'true') {
  console.error('Safety check failed. Set CONFIRM_REORDER=true to run this script.')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false })
  try {
    console.log('Connecting to database...')
    await client.connect()

    // Ensure leads table exists
    const checkLeads = await client.query("SELECT to_regclass('public.leads') as exists")
    if (!checkLeads.rows[0].exists) {
      console.error('Table `leads` does not exist. Aborting.')
      process.exit(1)
    }

    // Create leads_new with desired schema
    console.log('Creating leads_new (if not exists)')
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads_new (
        id SERIAL PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        service TEXT,
        budget TEXT,
        project_details TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Copy data
    console.log('Copying data from leads -> leads_new')
    await client.query('TRUNCATE TABLE leads_new')
    const copyResult = await client.query(`
      INSERT INTO leads_new (id, first_name, last_name, email, phone, service, budget, project_details, status, created_at)
      SELECT id, first_name, last_name, email, phone, service, budget, project_details, status, created_at FROM leads
      RETURNING id
    `)
    console.log(`Rows copied: ${copyResult.rowCount}`)

    // Compare counts
    const cntOrig = await client.query('SELECT count(*)::int AS c FROM leads')
    const cntNew = await client.query('SELECT count(*)::int AS c FROM leads_new')
    console.log(`leads count=${cntOrig.rows[0].c}, leads_new count=${cntNew.rows[0].c}`)
    if (cntOrig.rows[0].c !== cntNew.rows[0].c) {
      console.error('Row count mismatch — aborting swap. Inspect leads_new and leads_backup manually.')
      process.exit(2)
    }

    // Check if leads_old exists; if so, append timestamp to avoid overwrite
    const checkOld = await client.query("SELECT to_regclass('public.leads_old') as exists")
    if (checkOld.rows[0].exists) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-')
      const newOld = `leads_old_${ts}`
      console.log(`Found existing leads_old. Renaming existing leads_old -> ${newOld}`)
      await client.query(`ALTER TABLE leads_old RENAME TO ${newOld}`)
    }

    // Rename leads -> leads_old, leads_new -> leads
    console.log('Renaming tables: leads -> leads_old, leads_new -> leads')
    await client.query('ALTER TABLE leads RENAME TO leads_old')
    await client.query('ALTER TABLE leads_new RENAME TO leads')

    console.log('Swap complete. New `leads` table is active and old table is `leads_old` (or timestamped).')

    // Final verification: list columns
    const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='leads' ORDER BY ordinal_position")
    console.log('Final leads columns:', cols.rows.map(r => r.column_name).join(', '))
  } catch (err) {
    console.error('Error during reorder:', err)
    process.exitCode = 3
  } finally {
    await client.end()
  }
}

run()
