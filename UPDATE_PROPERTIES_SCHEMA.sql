-- Update Properties Table Schema
-- This migration adds support for gender field and ensures all necessary columns exist

-- Add gender column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'gender'
    ) THEN
        ALTER TABLE properties ADD COLUMN gender VARCHAR(10) DEFAULT 'Boys';
    END IF;
END $$;

-- Add images array column if it doesn't exist (for multiple images)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'images'
    ) THEN
        ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Add location column if it doesn't exist (separate from address)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'location'
    ) THEN
        ALTER TABLE properties ADD COLUMN location VARCHAR(255);
    END IF;
END $$;

-- Add description column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'description'
    ) THEN
        ALTER TABLE properties ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add contact_phone column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'contact_phone'
    ) THEN
        ALTER TABLE properties ADD COLUMN contact_phone VARCHAR(20);
    END IF;
END $$;

-- Add coordinates column if it doesn't exist (JSONB for lat/lng)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'coordinates'
    ) THEN
        ALTER TABLE properties ADD COLUMN coordinates JSONB DEFAULT '{"lat": 30.7333, "lng": 76.7794}'::JSONB;
    END IF;
END $$;

-- Add room_types column if it doesn't exist (JSONB array)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'room_types'
    ) THEN
        ALTER TABLE properties ADD COLUMN room_types JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- Add amenities column if it doesn't exist (JSONB array)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'amenities'
    ) THEN
        ALTER TABLE properties ADD COLUMN amenities JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- Add house_rules column if it doesn't exist (TEXT array)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'house_rules'
    ) THEN
        ALTER TABLE properties ADD COLUMN house_rules TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Add nearby_places column if it doesn't exist (JSONB array)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'nearby_places'
    ) THEN
        ALTER TABLE properties ADD COLUMN nearby_places JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- Add is_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE properties ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Add rating column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'rating'
    ) THEN
        ALTER TABLE properties ADD COLUMN rating DECIMAL(2,1) DEFAULT 4.5;
    END IF;
END $$;

-- Add reviews column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'reviews'
    ) THEN
        ALTER TABLE properties ADD COLUMN reviews INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE properties ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE properties ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create index on gender for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_gender ON properties(gender);

-- Create index on city for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

-- Create index on is_active for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);

-- Add constraint to ensure gender is either 'Boys' or 'Girls'
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'properties_gender_check'
    ) THEN
        ALTER TABLE properties ADD CONSTRAINT properties_gender_check 
        CHECK (gender IN ('Boys', 'Girls'));
    END IF;
END $$;

-- Update existing properties to have default gender if NULL
UPDATE properties SET gender = 'Boys' WHERE gender IS NULL;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
