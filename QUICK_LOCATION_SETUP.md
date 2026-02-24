# Quick Setup: Location & Address Fields

## Step 1: Update Database (Required)
Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS location TEXT;

COMMENT ON COLUMN properties.location IS 'Location/Sector of the property (e.g., Sector 22, IT City)';

-- Optional: Set default values for existing properties
UPDATE properties 
SET location = city
WHERE location IS NULL OR location = '';
```

## Step 2: That's It!
The code changes are already done. After running the SQL:

1. Restart your development server
2. Go to Admin Panel
3. Add/Edit properties - you'll see two separate fields:
   - **Location/Sector**: e.g., "Sector 22"
   - **Full Address**: e.g., "House No. 123, Sector 22-C, Chandigarh, 160022"

## What Changed?

### UI (Already Working)
- ✅ PropertyForm has both fields
- ✅ Admin panel shows both fields
- ✅ Search works across both fields
- ✅ Property listings display location

### Database (Needs SQL Update)
- ⚠️ Need to add `location` column (run SQL above)

### Code (Already Updated)
- ✅ TypeScript interfaces updated
- ✅ Database operations updated
- ✅ API routes updated
- ✅ All components updated

## Example Data

| Property Name | Location | Address |
|--------------|----------|---------|
| PG Uncle Residency | Sector 22 | House No. 123, Sector 22-C, Chandigarh, 160022 |
| IT City PG | IT City | Plot 456, IT City Road, Mohali, Punjab 160055 |
| Phase 7 Boys PG | Phase 7 | SCO 789, Phase 7, Mohali, Punjab 160062 |
