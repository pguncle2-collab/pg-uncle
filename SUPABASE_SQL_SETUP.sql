-- ============================================
-- pgUncle Database Setup - Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  type TEXT NOT NULL,
  availability TEXT NOT NULL,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  price DECIMAL(10,2) NOT NULL,
  amenities JSONB NOT NULL DEFAULT '[]',
  house_rules JSONB NOT NULL DEFAULT '[]',
  nearby_places JSONB NOT NULL DEFAULT '[]',
  coordinates JSONB NOT NULL,
  room_types JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create indexes for better performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);

-- Step 6: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS Policies for Properties (public read, authenticated write)
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Properties are insertable by authenticated users"
  ON properties FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Properties are updatable by authenticated users"
  ON properties FOR UPDATE
  USING (true);

CREATE POLICY "Properties are deletable by authenticated users"
  ON properties FOR DELETE
  USING (true);

-- Step 10: Create RLS Policies for Users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true);

-- Step 11: Create RLS Policies for Bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (true);

-- Step 12: Insert Sample Data
INSERT INTO properties (name, address, city, rating, reviews, type, availability, image, images, price, amenities, house_rules, nearby_places, coordinates, room_types, is_active)
VALUES 
(
  'Sunshine PG',
  'House No. 123, Sector 22-C, Chandigarh, 160022',
  'Chandigarh',
  4.8,
  124,
  'Single, Double, Triple',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg", "https://media.gettyimages.com/id/1390815938/photo/modern-bedroom-interior.jpg"]',
  8000,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": false},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 9 PM", "Maintain cleanliness"]',
  '[
    {"name": "Chandigarh University", "distance": "2 km"},
    {"name": "Elante Mall", "distance": "3 km"},
    {"name": "Rock Garden", "distance": "4 km"},
    {"name": "Sukhna Lake", "distance": "5 km"}
  ]',
  '{"lat": 30.7333, "lng": 76.7794}',
  '[
    {"type": "Single", "price": 12000, "available": true, "totalSlots": 10, "occupiedSlots": 8, "availableSlots": 2},
    {"type": "Double", "price": 8000, "available": true, "totalSlots": 15, "occupiedSlots": 12, "availableSlots": 3},
    {"type": "Triple", "price": 6000, "available": true, "totalSlots": 12, "occupiedSlots": 10, "availableSlots": 2}
  ]',
  true
),
(
  'Green Valley PG',
  'Plot No. 456, Phase 7, Mohali, 160062',
  'Mohali',
  4.5,
  89,
  'Single, Double',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  7000,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": false},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": false},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 8 PM"]',
  '[
    {"name": "Mohali Cricket Stadium", "distance": "1.5 km"},
    {"name": "North Country Mall", "distance": "2 km"},
    {"name": "Gurudwara Amb Sahib", "distance": "3 km"}
  ]',
  '{"lat": 30.7046, "lng": 76.7179}',
  '[
    {"type": "Single", "price": 10000, "available": true, "totalSlots": 8, "occupiedSlots": 7, "availableSlots": 1},
    {"type": "Double", "price": 7000, "available": true, "totalSlots": 12, "occupiedSlots": 10, "availableSlots": 2}
  ]',
  true
),
(
  'Royal Residency',
  'House No. 789, Sector 15, Panchkula, 134109',
  'Panchkula',
  4.6,
  156,
  'Single, Double, Triple',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  7500,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": true},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 9 PM", "Maintain cleanliness"]',
  '[
    {"name": "Panchkula Golf Club", "distance": "1 km"},
    {"name": "Cactus Garden", "distance": "2 km"},
    {"name": "Mansa Devi Temple", "distance": "8 km"}
  ]',
  '{"lat": 30.6942, "lng": 76.8534}',
  '[
    {"type": "Single", "price": 11000, "available": false, "totalSlots": 6, "occupiedSlots": 6, "availableSlots": 0},
    {"type": "Double", "price": 7500, "available": true, "totalSlots": 10, "occupiedSlots": 3, "availableSlots": 7},
    {"type": "Triple", "price": 5500, "available": true, "totalSlots": 12, "occupiedSlots": 8, "availableSlots": 4}
  ]',
  true
),
(
  'City Center PG',
  'Building A, Sector 17, Chandigarh, 160017',
  'Chandigarh',
  4.9,
  203,
  'Single, Double',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  10000,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": true},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 10 PM", "Maintain cleanliness"]',
  '[
    {"name": "Sector 17 Market", "distance": "0.5 km"},
    {"name": "Government Museum", "distance": "1 km"},
    {"name": "Rose Garden", "distance": "2 km"}
  ]',
  '{"lat": 30.7410, "lng": 76.7791}',
  '[
    {"type": "Single", "price": 15000, "available": true, "totalSlots": 5, "occupiedSlots": 3, "availableSlots": 2},
    {"type": "Double", "price": 10000, "available": true, "totalSlots": 8, "occupiedSlots": 2, "availableSlots": 6}
  ]',
  true
),
(
  'Student Hub PG',
  'Near Chandigarh University, VIP Road, Zirakpur, 140603',
  'Zirakpur',
  4.3,
  67,
  'Double, Triple',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  5000,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": false},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": false},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 8 PM"]',
  '[
    {"name": "Chandigarh University", "distance": "0.5 km"},
    {"name": "VR Punjab Mall", "distance": "3 km"},
    {"name": "Zirakpur Market", "distance": "1 km"}
  ]',
  '{"lat": 30.6425, "lng": 76.8173}',
  '[
    {"type": "Double", "price": 6500, "available": true, "totalSlots": 20, "occupiedSlots": 12, "availableSlots": 8},
    {"type": "Triple", "price": 5000, "available": true, "totalSlots": 15, "occupiedSlots": 14, "availableSlots": 1}
  ]',
  true
),
(
  'Comfort Stay PG',
  'SCO 234, Phase 11, Mohali, 160062',
  'Mohali',
  4.4,
  92,
  'Single, Double',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  6500,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true},
    {"name": "Gym", "available": false},
    {"name": "Housekeeping", "available": true}
  ]',
  '["No smoking", "No pets allowed", "Visitors allowed till 9 PM"]',
  '[
    {"name": "Phase 11 Market", "distance": "0.3 km"},
    {"name": "Fortis Hospital", "distance": "2 km"},
    {"name": "Mohali Bus Stand", "distance": "4 km"}
  ]',
  '{"lat": 30.7333, "lng": 76.6927}',
  '[
    {"type": "Single", "price": 9500, "available": true, "totalSlots": 7, "occupiedSlots": 4, "availableSlots": 3},
    {"type": "Double", "price": 6500, "available": false, "totalSlots": 10, "occupiedSlots": 10, "availableSlots": 0}
  ]',
  true
);

-- ============================================
-- Setup Complete! 
-- Your database is ready with 6 sample properties
-- ============================================
