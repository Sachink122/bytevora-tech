require('dotenv').config();
const { Pool } = require('pg');
(async () => {
  try {
    const conn = process.env.DATABASE_URL || process.env.STORAGE_URL;
    if (!conn) {
      console.error('No connection string found in env');
      process.exit(1);
    }
    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });
    const res = await pool.query("select column_name,data_type from information_schema.columns where table_name='team_members' order by ordinal_position");
    console.log(JSON.stringify(res.rows, null, 2));
    await pool.end();
  } catch (e) {
    console.error('ERROR', e.message, e.stack);
    process.exit(1);
  }
})();
