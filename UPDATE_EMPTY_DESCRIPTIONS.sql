-- Update empty descriptions with a default value
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

UPDATE properties 
SET description = 'Comfortable PG accommodation with modern amenities and facilities. Perfect for students and working professionals.'
WHERE description IS NULL OR description = '';

-- Verify the update
SELECT id, name, description FROM properties;
