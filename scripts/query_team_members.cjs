require('dotenv').config();
const { Pool } = require('pg');
(async () => {
  try {
    const conn = process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.DATABASE_URL;
    if (!conn) {
      console.error('No connection string found in env');
      process.exit(1);
    }
    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });

    // Check existing rows
    const res = await pool.query('SELECT id, name, role, email, phone, skills, status, created FROM team_members ORDER BY id DESC LIMIT 5');
    if (!res.rows.length) {
      console.log('No team members found — inserting a test record');
      const insert = await pool.query("INSERT INTO team_members (name, role, email, phone, skills, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name",["Test Member","Developer","test@example.com","+10000000000","js,react","Active"]);
      console.log('Inserted test id:', insert.rows[0]);
      const res2 = await pool.query('SELECT id, name, role, email, phone, skills, status, created FROM team_members ORDER BY id DESC LIMIT 5');
      console.log(JSON.stringify(res2.rows,null,2));
    } else {
      console.log(JSON.stringify(res.rows, null, 2));
    }

    await pool.end();
  } catch (e) {
    console.error('ERROR', e.message);
    process.exit(1);
  }
})();
