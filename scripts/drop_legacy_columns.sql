-- Drop legacy columns business and name if they exist
ALTER TABLE leads DROP COLUMN IF EXISTS business;
ALTER TABLE leads DROP COLUMN IF EXISTS name;
