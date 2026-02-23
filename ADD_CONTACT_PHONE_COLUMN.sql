-- Add contact_phone column to properties table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add a comment to the column
COMMENT ON COLUMN properties.contact_phone IS 'Contact phone number for the property';

-- Optional: Set a default value for existing rows
UPDATE properties 
SET contact_phone = '+91 98765 43210' 
WHERE contact_phone IS NULL;
