# 🔧 Fix Booking 500 Error - Quick Guide

## ❌ The Error

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error creating booking: Error: Failed to create booking
```

## 🎯 The Problem

The `bookings` table in your Supabase database is missing required columns:
- `duration` (for stay duration in months)
- `special_requests` (for user requests)
- `payment_id` (for payment tracking)

## ✅ The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Click your project (ID: `ijwbczqupzocgvuylanr`)
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

---

### Step 2: Run This SQL Script

Copy and paste this entire script into the SQL Editor:

```sql
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
```

---

### Step 3: Execute the Script

1. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
2. You should see: **"Success. No rows returned"**
3. Close the SQL Editor

---

### Step 4: Test Booking

1. Go back to your website: http://localhost:3000
2. Click on any property
3. Select a room type
4. Click **"Book Now & Pay"**
5. Fill in the booking form
6. Click **"Confirm Booking"**
7. **It should work now!** ✅

---

## 🔍 Verify the Fix

### Check if columns were added:

Run this query in SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

You should see:
- `duration` (integer)
- `special_requests` (text)
- `payment_id` (text)

---

## 📋 What Each Column Does

### `duration` (INTEGER)
- Stores how many months the user wants to stay
- Used for calculating discounts (3, 6, or 12 months)
- Default: 1 month

### `special_requests` (TEXT)
- Stores any special requests from the user
- Optional field
- Examples: "Need ground floor", "Vegetarian meals only"

### `payment_id` (TEXT)
- Stores the payment transaction ID
- Links booking to payment
- Generated automatically

---

## 🐛 Still Getting Errors?

### Error: "relation 'bookings' does not exist"
**Solution**: Run the main setup script first:
1. Open `SUPABASE_SQL_SETUP.sql`
2. Copy the entire content
3. Run it in Supabase SQL Editor
4. Then run the UPDATE_BOOKINGS_TABLE.sql script

### Error: "permission denied"
**Solution**: 
- Make sure you're logged into the correct Supabase project
- Check you have admin access to the project

### Error: "column already exists"
**Solution**: 
- This is fine! It means the column was already added
- The script uses `IF NOT EXISTS` so it's safe to run multiple times

---

## ✅ Success Indicators

After running the script, you should be able to:
- [ ] Fill out the booking form
- [ ] Submit without errors
- [ ] See "Booking Confirmed!" message
- [ ] Booking appears in Supabase `bookings` table

---

## 📊 Check Your Bookings

To view all bookings in Supabase:

1. Go to: **Table Editor** → **bookings**
2. You'll see all booking records with:
   - User ID
   - Property ID
   - Room type
   - Check-in date
   - Duration (months)
   - Total amount
   - Special requests
   - Payment ID
   - Status

---

## 🎉 After Fix

Your booking system will be fully functional:
- ✅ Users can book rooms
- ✅ Duration-based discounts work
- ✅ Special requests saved
- ✅ Payment tracking enabled
- ✅ Booking history maintained

---

**Time to Fix**: 2 minutes  
**Difficulty**: Easy  
**Status**: 🟢 **READY TO FIX**

**Next Step**: Go to Supabase SQL Editor and run the script above!
