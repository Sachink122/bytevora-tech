#!/usr/bin/env node
/**
 * Safe cleanup script for `leads` table.
 * Usage (DRY-RUN protection):
 *   CONFIRM_CLEANUP=true node scripts/cleanup_leads.js
 * To also run legacy migration (best-effort split of `name`):
 *   CONFIRM_CLEANUP=true MIGRATE=true node scripts/cleanup_leads.js
 * Ensure `DATABASE_URL` and optional `PG_SSL=true` are set in your environment.
 */
const { Client } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Aborting.')
  process.exit(1)
}

if (process.env.CONFIRM_CLEANUP !== 'true') {
  console.error('Safety check failed. Set CONFIRM_CLEANUP=true to run this script.')
  console.error('This script WILL modify your database when confirmed.')
  process.exit(1)
}

const MIGRATE = process.env.MIGRATE === 'true'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false })
  try {
    console.log('Connecting to database...')
    await client.connect()

    // STEP 1: Backup (create leads_backup table if not exists)
    console.log('Creating backup table `leads_backup` (if not exists)')
    const checkBackup = await client.query("SELECT to_regclass('public.leads_backup') as exists")
    if (!checkBackup.rows[0].exists) {
      await client.query('CREATE TABLE leads_backup AS SELECT * FROM leads')
      console.log('Backup created: leads_backup')
    } else {
      console.log('Backup table leads_backup already exists — skipping creation')
    }

    if (MIGRATE) {
      console.log('Running best-effort migration from `name` -> `first_name`,`last_name`')
      // Only update rows where first_name/last_name are null or empty
      await client.query(`
        UPDATE leads
        SET first_name = COALESCE(NULLIF(first_name, ''), split_part(name, ' ', 1)),
            last_name = COALESCE(NULLIF(last_name, ''), NULLIF(trim(regexp_replace(name, '^[^ ]+\\s*', '')), ''))
        WHERE (first_name IS NULL OR first_name = '') AND (name IS NOT NULL AND name <> '');
      `)
      console.log('Migration attempt finished (best-effort).')
    } else {
      console.log('Skipping migration step (MIGRATE not set).')
    }

    // STEP 3: Drop legacy columns
    console.log('Dropping legacy columns if they exist: business, name')
    await client.query('ALTER TABLE leads DROP COLUMN IF EXISTS business')
    await client.query('ALTER TABLE leads DROP COLUMN IF EXISTS name')
    console.log('Dropped legacy columns (if present).')

    // STEP 4: Verify final structure
    console.log('Verifying final leads table columns:')
    const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='leads' ORDER BY ordinal_position")
    console.log(cols.rows.map(r => r.column_name).join(', '))

    console.log('Done. Review leads_backup table before removing backups.')
  } catch (err) {
    console.error('Error during cleanup:', err)
    process.exitCode = 2
  } finally {
    await client.end()
  }
}

run()
