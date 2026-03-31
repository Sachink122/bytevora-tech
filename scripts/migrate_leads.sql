-- Best-effort migration: split `name` into first_name and last_name
-- Run only if you reviewed and backed up the table.
UPDATE leads
SET first_name = COALESCE(NULLIF(first_name, ''), split_part(name, ' ', 1)),
    last_name = COALESCE(NULLIF(last_name, ''), NULLIF(trim(regexp_replace(name, '^[^ ]+\s*', '')), ''))
WHERE (first_name IS NULL OR first_name = '') AND (name IS NOT NULL AND name <> '');
