# Admin Dashboard Documentation

## Overview
The admin dashboard is a protected page for managing PG properties. It's not visible to regular users and requires authentication.

## Access
- **URL**: `/admin`
- **Default Password**: `admin123` (change this in production!)

## Features

### 1. Dashboard Statistics
- Total Properties count
- Active properties count
- Inactive properties count
- Average rating across all properties

### 2. Property Management

#### View Properties
- Table view with all property details
- Columns: Property name, Location, Room types, Rating, Status, Actions
- Sortable and filterable (can be enhanced)

#### Add New Property
Click "Add New Property" button to open the form with:
- **Basic Information**:
  - Property name
  - City (Chandigarh, Mohali, Panchkula, Zirakpur)
  - Location/Sector
  - Full address
  - Contact phone
  - Description
  - GPS coordinates (Latitude/Longitude)

- **Room Types**:
  - Add multiple room types (Single, Double, Triple)
  - Set price for each type
  - Mark availability
  - Add description for each room type
  - Can add/remove room types dynamically

- **Amenities**:
  - Toggle amenities on/off
  - Pre-configured: Wi-Fi, AC, Meals, Laundry, Parking, Gym, Security, Housekeeping
  - Visual indicators for available amenities

- **House Rules**:
  - Add multiple rules
  - Dynamic add/remove functionality

- **Property Images**:
  - Add multiple image URLs
  - Support for external image hosting

#### Edit Property
- Click the edit icon (pencil) on any property
- Opens the same form pre-filled with existing data
- Update any field and save

#### Delete Property
- Click the delete icon (trash) on any property
- Confirmation dialog before deletion
- Permanently removes the property

#### Toggle Status
- Click the status badge (Active/Inactive)
- Instantly toggles between active and inactive
- Inactive properties won't show to users (when integrated with backend)

### 3. Security Features
- Password-protected access
- Login screen before accessing dashboard
- Logout functionality
- Session management (to be enhanced)

## Usage Instructions

### Logging In
1. Navigate to `/admin`
2. Enter password: `admin123`
3. Click "Login to Dashboard"

### Adding a Property
1. Click "Add New Property" button
2. Fill in all required fields (marked with *)
3. Add room types with pricing
4. Select available amenities
5. Add house rules
6. Add property image URLs
7. Click "Save Property"

### Editing a Property
1. Find the property in the table
2. Click the edit icon (pencil)
3. Modify the fields you want to change
4. Click "Save Property"

### Deleting a Property
1. Find the property in the table
2. Click the delete icon (trash)
3. Confirm deletion in the popup
4. Property will be removed

### Changing Property Status
1. Find the property in the table
2. Click on the status badge (Active/Inactive)
3. Status will toggle immediately

## Technical Details

### Files
- **Page**: `app/admin/page.tsx`
- **Form Component**: `components/PropertyForm.tsx`

### Data Structure
```typescript
interface Property {
  id: string;
  name: string;
  city: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  roomTypes: {
    type: string;
    price: number;
    available: boolean;
    description: string;
    features: string[];
  }[];
  amenities: {
    name: string;
    icon: string;
    available: boolean;
  }[];
  rules: string[];
  images: string[];
  contactPhone: string;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
}
```

## Future Enhancements

### Recommended Improvements
1. **Backend Integration**:
   - Connect to a database (MongoDB, PostgreSQL, etc.)
   - API endpoints for CRUD operations
   - Real-time data synchronization

2. **Authentication**:
   - JWT-based authentication
   - Role-based access control (Super Admin, Admin, Editor)
   - Password reset functionality
   - Multi-factor authentication

3. **Advanced Features**:
   - Search and filter properties
   - Bulk operations (delete, status change)
   - Export data to CSV/Excel
   - Property analytics and insights
   - Booking management
   - User management
   - Revenue tracking

4. **Image Management**:
   - Direct image upload (not just URLs)
   - Image optimization and compression
   - Multiple image galleries per property
   - Drag-and-drop image reordering

5. **Validation**:
   - Form validation with error messages
   - Duplicate property detection
   - Price range validation
   - Phone number format validation

6. **UI Enhancements**:
   - Pagination for large property lists
   - Advanced filters (city, price range, availability)
   - Sorting options
   - Property preview before saving
   - Undo/Redo functionality

## Security Notes

⚠️ **Important**: 
- Change the default password before deploying to production
- Implement proper authentication with JWT or session management
- Add rate limiting to prevent brute force attacks
- Use environment variables for sensitive data
- Implement HTTPS in production
- Add CSRF protection
- Sanitize all user inputs

## Support
For issues or questions about the admin dashboard, contact the development team.
