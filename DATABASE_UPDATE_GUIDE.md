# Database Schema Update Guide

## Overview
This guide explains how to update your Supabase database to support all the frontend features including gender selection, multiple images, and enhanced property data.

## What's Being Added

### New Fields in Properties Table:
1. **gender** - VARCHAR(10) - Specifies if PG is for Boys or Girls
2. **images** - TEXT[] - Array of image URLs (multiple images support)
3. **location** - VARCHAR(255) - Sector/Location (separate from full address)
4. **description** - TEXT - Detailed property description
5. **contact_phone** - VARCHAR(20) - Contact phone number
6. **coordinates** - JSONB - Latitude and longitude for maps
7. **room_types** - JSONB - Array of room types with pricing and availability
8. **amenities** - JSONB - Array of amenities with availability status
9. **house_rules** - TEXT[] - Array of house rules
10. **nearby_places** - JSONB - Array of nearby places with distances
11. **is_active** - BOOLEAN - Whether property is active/visible
12. **rating** - DECIMAL(2,1) - Property rating (0.0 to 5.0)
13. **reviews** - INTEGER - Number of reviews
14. **created_at** - TIMESTAMP - When property was created
15. **updated_at** - TIMESTAMP - When property was last updated

## How to Apply the Update

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run the Migration Script
1. Open the file `UPDATE_PROPERTIES_SCHEMA.sql`
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click "Run" button

### Step 3: Verify the Update
The script will output a table showing all columns. Verify these columns exist:
- gender
- images
- location
- description
- contact_phone
- coordinates
- room_types
- amenities
- house_rules
- nearby_places
- is_active
- rating
- reviews
- created_at
- updated_at

## What the Script Does

### Safe Migration
- Uses `DO $$ BEGIN ... END $$` blocks to check if columns exist before adding
- Won't fail if columns already exist
- Won't lose any existing data

### Indexes Created
- `idx_properties_gender` - Fast filtering by gender
- `idx_properties_city` - Fast filtering by city
- `idx_properties_is_active` - Fast filtering by active status

### Constraints Added
- Gender must be either 'Boys' or 'Girls'
- Existing NULL gender values are set to 'Boys'

### Triggers Added
- Automatically updates `updated_at` timestamp when property is modified

## Frontend Features Now Supported

### ✅ Gender Selection
- Admin can specify if PG is for Boys or Girls
- Users can filter properties by gender
- "Girls PG Coming Soon" message shows when Girls is selected

### ✅ Multiple Images
- Properties can have multiple images
- Stored as array in database
- First image used as thumbnail

### ✅ Enhanced Property Data
- Detailed descriptions
- Multiple room types with individual pricing
- Comprehensive amenities list
- House rules
- Nearby places with distances
- Contact information

### ✅ Room Inventory Management
- Track total rooms per type
- Track occupied rooms
- Auto-calculate available rooms
- Low inventory alerts

## Example Data Structure

### Room Types (JSONB):
```json
[
  {
    "type": "Single",
    "price": 12000,
    "totalSlots": 10,
    "occupiedSlots": 7,
    "availableSlots": 3,
    "available": true
  },
  {
    "type": "Double",
    "price": 8000,
    "totalSlots": 15,
    "occupiedSlots": 12,
    "availableSlots": 3,
    "available": true
  }
]
```

### Amenities (JSONB):
```json
[
  { "name": "Wi-Fi", "available": true },
  { "name": "AC", "available": true },
  { "name": "Meals", "available": true },
  { "name": "Parking", "available": false }
]
```

### Coordinates (JSONB):
```json
{
  "lat": 30.7333,
  "lng": 76.7794
}
```

### Images (TEXT[]):
```sql
ARRAY[
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]
```

## Testing After Update

### 1. Test Property Creation
- Go to Admin Dashboard
- Click "Add New Property"
- Fill in all fields including gender
- Add multiple images
- Save and verify

### 2. Test Gender Filtering
- Go to main page
- Click on "Boys" filter - should show Boys PGs
- Click on "Girls" filter - should show "Coming Soon" message
- Click on "All" - should show all properties

### 3. Test Property Display
- Click on a property
- Verify all fields display correctly
- Check multiple images work
- Verify room types show correctly

## Rollback (If Needed)

If you need to remove the new columns:
```sql
-- Remove new columns (CAUTION: This will delete data)
ALTER TABLE properties DROP COLUMN IF EXISTS gender;
ALTER TABLE properties DROP COLUMN IF EXISTS images;
ALTER TABLE properties DROP COLUMN IF EXISTS location;
-- ... etc for other columns
```

## Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Test Environment**: Test in a development environment first if possible
3. **Existing Data**: Existing properties will get default values:
   - gender: 'Boys'
   - images: empty array
   - is_active: true
   - rating: 4.5
   - reviews: 0

4. **No Data Loss**: The migration is designed to be safe and won't delete existing data

## Support

If you encounter any issues:
1. Check the Supabase logs for error messages
2. Verify your Supabase project has the necessary permissions
3. Ensure you're running the script in the correct project
4. Check that the properties table exists

## Next Steps

After updating the database:
1. ✅ Gender filtering will work
2. ✅ Multiple images will be supported
3. ✅ Admin can add properties with all new fields
4. ✅ Property details page will show all information
5. ✅ Room inventory tracking will work

---

**Your database is now fully synchronized with the frontend!** 🎉
