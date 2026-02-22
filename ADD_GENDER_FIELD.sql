-- ============================================
-- Add Gender Field to Properties Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add gender column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Boys' CHECK (gender IN ('Boys', 'Girls'));

-- Update existing properties with gender (you can customize this based on your data)
-- For now, setting alternating properties to Boys/Girls
UPDATE properties SET gender = 'Boys' WHERE name IN ('Sunshine PG', 'Royal Residency', 'Student Hub PG');
UPDATE properties SET gender = 'Girls' WHERE name IN ('Green Valley PG', 'City Center PG', 'Comfort Stay PG');

-- ============================================
-- Migration Complete!
-- Properties now have gender field
-- ============================================
