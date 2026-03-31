-- Create a backup of the leads table
CREATE TABLE IF NOT EXISTS leads_backup AS
SELECT * FROM leads;
