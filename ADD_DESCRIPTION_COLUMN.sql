-- Add description column to properties table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add a comment to the column
COMMENT ON COLUMN properties.description IS 'Detailed description of the property';

-- Optional: Set a default value for existing rows
UPDATE properties 
SET description = 'Comfortable PG accommodation with modern amenities' 
WHERE description IS NULL;
