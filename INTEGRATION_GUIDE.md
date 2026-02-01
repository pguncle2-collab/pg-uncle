# Supabase Integration Guide

## Overview

Your pgUncle application is now ready for Supabase integration. This guide will help you complete the setup.

## What's Been Set Up

### 1. Dependencies Installed
- `@supabase/supabase-js` - Supabase JavaScript client

### 2. Files Created

#### Configuration Files
- `lib/supabase.ts` - Supabase client and TypeScript types
- `lib/supabaseOperations.ts` - CRUD operations for properties, users, and bookings
- `hooks/useProperties.ts` - React hook for managing properties state
- `.env.local.example` - Environment variables template

#### Documentation
- `SUPABASE_SETUP.md` - Complete setup instructions with SQL schemas
- `INTEGRATION_GUIDE.md` - This file

## Quick Start (5 Steps)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to initialize

### Step 2: Get Your API Keys
1. Go to Project Settings > API
2. Copy:
   - Project URL
   - anon/public key

### Step 3: Set Environment Variables
Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=admin123
```

### Step 4: Create Database Tables
1. Go to SQL Editor in Supabase
2. Copy and run the SQL from `SUPABASE_SETUP.md` (Step 4)
3. This creates: properties, users, and bookings tables

### Step 5: Insert Sample Data
Run the sample data SQL from `SUPABASE_SETUP.md` (Step 5)

## How to Use in Your Components

### Example 1: Fetch Properties (Properties Page)

```typescript
'use client';

import { useProperties } from '@/hooks/useProperties';

export default function PropertiesPage() {
  const { properties, loading, error } = useProperties();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>
          <h3>{property.name}</h3>
          <p>{property.city}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Add Property (Admin Page)

```typescript
'use client';

import { useProperties } from '@/hooks/useProperties';

export default function AdminPage() {
  const { addProperty } = useProperties();

  const handleAddProperty = async () => {
    try {
      await addProperty({
        name: 'New PG',
        address: 'Sector 17',
        city: 'Chandigarh',
        rating: 4.5,
        reviews: 0,
        type: 'Single, Double',
        availability: 'Available',
        image: 'https://example.com/image.jpg',
        images: [],
        price: 8000,
        amenities: [
          { name: 'WiFi', available: true },
          { name: 'AC', available: true }
        ],
        houseRules: ['No smoking', 'No pets'],
        nearbyPlaces: [
          { name: 'Mall', distance: '2 km' }
        ],
        coordinates: { lat: 30.7333, lng: 76.7794 },
        roomTypes: [
          {
            type: 'Single',
            price: 12000,
            totalSlots: 10,
            occupiedSlots: 5,
            availableSlots: 5
          }
        ],
        isActive: true
      });
      alert('Property added successfully!');
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  return (
    <button onClick={handleAddProperty}>
      Add Property
    </button>
  );
}
```

### Example 3: Update Property

```typescript
const { updateProperty } = useProperties();

await updateProperty('property-id', {
  name: 'Updated Name',
  price: 9000
});
```

### Example 4: Delete Property

```typescript
const { deleteProperty } = useProperties();

await deleteProperty('property-id');
```

## Available Operations

### Property Operations
```typescript
import { propertyOperations } from '@/lib/supabaseOperations';

// Get all properties
const properties = await propertyOperations.getAll();

// Get by city
const chandigarhPGs = await propertyOperations.getByCity('Chandigarh');

// Get by ID
const property = await propertyOperations.getById('property-id');

// Create
const newProperty = await propertyOperations.create(propertyData);

// Update
const updated = await propertyOperations.update('id', { name: 'New Name' });

// Delete
await propertyOperations.delete('property-id');

// Toggle active status
await propertyOperations.toggleActive('id', false);

// Search
const results = await propertyOperations.search('sunshine');
```

### User Operations
```typescript
import { userOperations } from '@/lib/supabaseOperations';

// Get all users
const users = await userOperations.getAll();

// Get by email
const user = await userOperations.getByEmail('user@example.com');

// Create user
const newUser = await userOperations.create({
  email: 'user@example.com',
  fullName: 'John Doe',
  phone: '+91 98765 43210',
  role: 'user'
});

// Update user
await userOperations.update('user-id', { fullName: 'Jane Doe' });
```

### Booking Operations
```typescript
import { bookingOperations } from '@/lib/supabaseOperations';

// Create booking
const booking = await bookingOperations.create({
  userId: 'user-id',
  propertyId: 'property-id',
  roomType: 'Single',
  checkInDate: '2024-03-01',
  totalAmount: 12000
});

// Get user bookings
const userBookings = await bookingOperations.getByUserId('user-id');

// Get all bookings (admin)
const allBookings = await bookingOperations.getAll();

// Update status
await bookingOperations.updateStatus('booking-id', 'confirmed');
```

## Database Schema

### Properties Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `address` (Text)
- `city` (Text)
- `rating` (Decimal)
- `reviews` (Integer)
- `type` (Text)
- `availability` (Text)
- `image` (Text)
- `images` (JSONB)
- `price` (Decimal)
- `amenities` (JSONB)
- `house_rules` (JSONB)
- `nearby_places` (JSONB)
- `coordinates` (JSONB)
- `room_types` (JSONB)
- `is_active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Users Table
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `full_name` (Text)
- `phone` (Text)
- `role` (Text: 'user' or 'admin')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Bookings Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `property_id` (UUID, Foreign Key)
- `room_type` (Text)
- `check_in_date` (Date)
- `status` (Text: 'pending', 'confirmed', 'cancelled')
- `total_amount` (Decimal)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Next Steps

1. **Update Admin Page**: Replace mock data with Supabase operations
2. **Update Properties Page**: Fetch real data from Supabase
3. **Update Property Details**: Fetch individual property data
4. **Add Authentication**: Implement Supabase Auth for user login/signup
5. **Add Bookings**: Implement booking functionality
6. **Add Real-time Updates**: Use Supabase Realtime for live updates

## Testing

After setup, test the integration:

```bash
# Start development server
npm run dev

# Open browser and check:
# 1. Properties page loads data from Supabase
# 2. Admin page can add/edit/delete properties
# 3. Property details page shows correct data
```

## Troubleshooting

### "Failed to fetch properties"
- Check if `.env.local` has correct API keys
- Verify Supabase project is running
- Check browser console for detailed errors

### "Permission denied"
- Verify RLS policies are set up correctly
- Check if tables were created successfully

### "Data not showing"
- Verify sample data was inserted
- Check if `is_active` is set to `true`
- Open Supabase Table Editor to verify data

## Support

For detailed SQL schemas and setup instructions, see `SUPABASE_SETUP.md`

For Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
