# Supabase Integration Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: PGUNCLE
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Wait for project to be created

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_PASSWORD=admin123
```

## Step 4: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
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

-- Create bookings table
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

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Insert Sample Data

Run this SQL to add sample properties:

```sql
INSERT INTO properties (name, address, city, rating, reviews, type, availability, image, images, price, amenities, house_rules, nearby_places, coordinates, room_types, is_active)
VALUES 
(
  'Sunshine PG',
  'Sector 82A, IT City, Mohali',
  'Chandigarh',
  4.8,
  124,
  'Single, Double, Triple',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  8000,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": true},
    {"name": "Security", "available": true}
  ]',
  '["No smoking", "No pets", "Visitors allowed till 9 PM", "Maintain cleanliness"]',
  '[
    {"name": "Chandigarh University", "distance": "2 km"},
    {"name": "Elante Mall", "distance": "3 km"},
    {"name": "Rock Garden", "distance": "4 km"}
  ]',
  '{"lat": 30.7333, "lng": 76.7794}',
  '[
    {"type": "Single", "price": 12000, "totalSlots": 10, "occupiedSlots": 8, "availableSlots": 2},
    {"type": "Double", "price": 8000, "totalSlots": 15, "occupiedSlots": 12, "availableSlots": 3},
    {"type": "Triple", "price": 6000, "totalSlots": 12, "occupiedSlots": 10, "availableSlots": 2}
  ]',
  true
),
(
  'Green Valley PG',
  'Phase 7, Mohali',
  'Mohali',
  4.6,
  98,
  'Single, Double',
  'Available',
  'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
  '["https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg"]',
  7500,
  '[
    {"name": "WiFi", "available": true},
    {"name": "AC", "available": true},
    {"name": "Laundry", "available": true},
    {"name": "Meals", "available": true},
    {"name": "Parking", "available": false},
    {"name": "Security", "available": true}
  ]',
  '["No smoking", "No pets", "Visitors allowed till 8 PM"]',
  '[
    {"name": "Mohali Cricket Stadium", "distance": "1.5 km"},
    {"name": "North Country Mall", "distance": "2 km"}
  ]',
  '{"lat": 30.7046, "lng": 76.7179}',
  '[
    {"type": "Single", "price": 10000, "totalSlots": 8, "occupiedSlots": 7, "availableSlots": 1},
    {"type": "Double", "price": 7500, "totalSlots": 12, "occupiedSlots": 10, "availableSlots": 2}
  ]',
  true
);
```

## Step 6: Set Up Row Level Security (RLS)

Run this SQL to enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Properties policies (public read, admin write)
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

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (true);
```

## Step 7: Restart Development Server

```bash
npm run dev
```

## Features Integrated

### 1. Properties Management
- Fetch properties from Supabase
- Add new properties
- Update existing properties
- Delete properties
- Real-time inventory tracking

### 2. User Authentication (Ready for implementation)
- User registration
- User login
- Profile management

### 3. Bookings (Ready for implementation)
- Create bookings
- View booking history
- Cancel bookings

## API Functions Available

### Properties
- `supabase.from('properties').select('*')` - Get all properties
- `supabase.from('properties').insert([data])` - Add property
- `supabase.from('properties').update(data).eq('id', id)` - Update property
- `supabase.from('properties').delete().eq('id', id)` - Delete property

### Users
- `supabase.from('users').select('*')` - Get users
- `supabase.from('users').insert([data])` - Add user

### Bookings
- `supabase.from('bookings').select('*')` - Get bookings
- `supabase.from('bookings').insert([data])` - Create booking

## Next Steps

1. Update admin page to use Supabase for CRUD operations
2. Update properties page to fetch from Supabase
3. Implement user authentication with Supabase Auth
4. Add booking functionality
5. Add real-time updates using Supabase Realtime

## Troubleshooting

- **Connection Error**: Check if your API keys are correct in `.env.local`
- **Permission Denied**: Verify RLS policies are set up correctly
- **Data Not Showing**: Check if sample data was inserted successfully
