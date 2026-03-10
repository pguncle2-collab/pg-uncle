-- Create Users Table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We map Firebase uid to `firebase_uid` if keeping them separate, or we can use it as the Supabase `auth.users.id`.
-- For simplicity in data migration, we'll store Firebase UID in a column and let Supabase Auth handle new users.

-- Create Properties Table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_id TEXT UNIQUE,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  city TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  type TEXT,
  availability TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  price NUMERIC,
  gender TEXT,
  description TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  house_rules TEXT[] DEFAULT '{}',
  nearby_places JSONB DEFAULT '[]'::jsonb,
  coordinates JSONB,
  room_types JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Bookings Table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_id TEXT UNIQUE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  room_type TEXT,
  check_in_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  total_amount NUMERIC,
  special_requests TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_id TEXT,
  payment_type TEXT CHECK (payment_type IN ('full', 'monthly')),
  monthly_rent NUMERIC,
  deposit_amount NUMERIC,
  paid_months INTEGER,
  next_payment_due TIMESTAMP WITH TIME ZONE,
  monthly_payments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Payments Table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_id TEXT UNIQUE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  order_id TEXT,
  payment_id TEXT,
  signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT CHECK (status IN ('pending', 'success', 'failed')),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for Users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR current_setting('role') = 'service_role');

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id OR current_setting('role') = 'service_role');

-- Policies for Properties
CREATE POLICY "Properties are viewable by everyone" ON public.properties
  FOR SELECT USING (true);

-- (Admin policies would be handled in the app logic or via custom claims, using service_role for now)

-- Policies for Bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE firebase_uid = auth.uid()::text 
      -- This needs mapping logic if auth.uid() is used
    )
    OR current_setting('role') = 'service_role'
  );

-- Policies for Payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE firebase_uid = auth.uid()::text
    )
    OR current_setting('role') = 'service_role'
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
