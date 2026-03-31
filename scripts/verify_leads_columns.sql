-- Verify leads table columns
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
