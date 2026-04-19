-- Migration: Remove gender column from properties table
-- Gender is now stored at room type level instead of property level

-- Remove the gender column from properties table
ALTER TABLE public.properties DROP COLUMN IF EXISTS gender;

-- Add comment to document the change
COMMENT ON TABLE public.properties IS 'Properties table - gender is now stored in room_types JSONB field at room level';
