-- ============================================
-- Update Bookings Table - Add Missing Columns
-- Run this in Supabase SQL Editor
-- ============================================

-- Add duration column (in months)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 1;

-- Add special_requests column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Add payment_id column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Add comment to describe the columns
COMMENT ON COLUMN bookings.duration IS 'Duration of stay in months';
COMMENT ON COLUMN bookings.special_requests IS 'Special requests from the user';
COMMENT ON COLUMN bookings.payment_id IS 'Payment transaction ID';

-- ============================================
-- Update Complete! 
-- Bookings table now has all required columns
-- ============================================
