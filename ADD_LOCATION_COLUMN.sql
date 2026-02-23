-- Add location column to properties table to separate location/sector from full address
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add a comment to the column
COMMENT ON COLUMN properties.location IS 'Location/Sector of the property (e.g., Sector 22, IT City)';

-- Optional: Update existing rows with location extracted from address if needed
-- You can manually update these or leave them empty for admin to fill
UPDATE properties 
SET location = city
WHERE location IS NULL OR location = '';
