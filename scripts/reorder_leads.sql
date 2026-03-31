-- Create a new leads table with desired column order
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
);

-- Copy data from existing leads into leads_new
INSERT INTO leads_new (id, first_name, last_name, email, phone, service, budget, project_details, status, created_at)
SELECT id, first_name, last_name, email, phone, service, budget, project_details, status, created_at
FROM leads;

-- After verifying counts, use the following to swap tables (run in script to rename):
-- ALTER TABLE leads RENAME TO leads_old;
-- ALTER TABLE leads_new RENAME TO leads;

-- Verify final structure
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'leads_new'
ORDER BY ordinal_position;
