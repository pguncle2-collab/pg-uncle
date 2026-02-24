# API Testing Guide

## Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 2. Get All Properties
```bash
curl http://localhost:3000/api/properties
```
Expected: Array of properties or empty array `[]`

### 3. Create Property (Admin)
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test PG",
    "address": "123 Test Street",
    "city": "Chandigarh",
    "type": "Boys",
    "availability": "Available",
    "price": 8000,
    "rating": 4.5,
    "reviews": 10,
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    "images": ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"],
    "description": "Test property",
    "amenities": ["WiFi", "AC"],
    "houseRules": ["No smoking"],
    "nearbyPlaces": ["Market - 500m"],
    "coordinates": {"lat": 30.7333, "lng": 76.7794},
    "roomTypes": [
      {
        "type": "Single",
        "price": 8000,
        "available": true,
        "amenities": ["Bed", "Desk"],
        "images": []
      }
    ]
  }'
```

### 4. Get Property by ID
```bash
# Replace {id} with actual property ID from step 3
curl http://localhost:3000/api/properties/{id}
```

### 5. Update Property
```bash
# Replace {id} with actual property ID
curl -X PATCH http://localhost:3000/api/properties/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test PG",
    "price": 9000
  }'
```

### 6. Toggle Property Active Status
```bash
# Replace {id} with actual property ID
curl -X POST http://localhost:3000/api/properties/{id}/toggle \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

### 7. Delete Property
```bash
# Replace {id} with actual property ID
curl -X DELETE http://localhost:3000/api/properties/{id}
```

## Testing in Browser

1. Start the development server:
```bash
npm run dev
```

2. Open browser and test:
   - Homepage: http://localhost:3000
   - Properties: http://localhost:3000/main
   - Admin: http://localhost:3000/admin (password: admin123)
   - Auth: http://localhost:3000/auth

3. Test flows:
   - Browse properties
   - View property details
   - Try to book (should prompt login)
   - Login/Register
   - Book a property
   - View bookings in profile
   - Admin: Add/Edit/Delete properties

## Common Issues

### MongoDB Connection Error
- Check MONGODB_URI in .env.local
- Verify MongoDB Atlas cluster is active
- Check network access in Atlas (allow your IP)

### NextAuth Error
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- For Google OAuth, verify credentials in Google Cloud Console

### Property Creation 405 Error
- ✅ FIXED: POST method now implemented in /api/properties/route.ts

### Images Not Loading
- Currently using placeholder images
- Need to implement Cloudinary or AWS S3 for image storage
