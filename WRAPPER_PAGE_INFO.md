# Wrapper Homepage Information

## Overview

A temporary "Coming Soon" wrapper page has been created for the pgUncle website. This allows you to show a professional landing page to visitors while the main site is still in development.

## Page Structure

### Routes

- **`/`** (Root) - Wrapper/Coming Soon page
- **`/main`** - Full website with all features
- **`/admin`** - Admin dashboard (password protected)
- **`/auth`** - Authentication page
- **`/properties/[id]`** - Property details pages

## Wrapper Page Features

### Design Elements
- ✅ Clean, modern gradient background (blue to cyan)
- ✅ Centered card layout with shadow
- ✅ pgUncle branding with house emoji icon
- ✅ "Coming Soon" message
- ✅ 4 key features highlighted:
  - Homely Environment
  - Clean & Hygienic
  - No Broker, No Drama
  - Uncle-Level Care
- ✅ "Preview Website" button linking to `/main`
- ✅ Contact information (email, phone, location)
- ✅ Fully responsive design

### User Flow

1. **Visitor lands on `/`** → Sees wrapper page
2. **Clicks "Preview Website"** → Goes to `/main`
3. **On main site** → Can browse all features, properties, etc.
4. **Navbar links** → All point to `/main` routes

## How to Switch Back to Full Site

If you want to remove the wrapper and show the full site at root:

### Option 1: Delete Wrapper (Show Full Site)
```bash
# Delete wrapper page
rm app/page.tsx

# Move main page back to root
mv app/main/page.tsx app/page.tsx
rmdir app/main

# Update Navbar links back to "/"
# Change all "/main" to "/" in components/Navbar.tsx
```

### Option 2: Keep Both (Recommended)
Keep the current setup where:
- `/` = Wrapper page for public
- `/main` = Full site for preview/testing
- Later, when ready to launch, use Option 1

## Customization

### Update Content
Edit `app/page.tsx` to change:
- Heading text
- Description
- Features
- Contact information
- Button text

### Update Styling
The wrapper uses Tailwind CSS classes. Key sections:
- Background: `bg-gradient-to-br from-blue-50 via-white to-cyan-50`
- Card: `bg-white rounded-3xl shadow-2xl`
- Header: `bg-gradient-to-r from-blue-600 to-cyan-600`
- Button: `bg-gradient-to-r from-blue-600 to-cyan-600`

### Add Launch Date
Add a countdown timer or launch date:

```tsx
<div className="text-center mb-6">
  <p className="text-lg text-gray-600">
    Launching in <span className="font-bold text-blue-600">March 2024</span>
  </p>
</div>
```

### Add Email Signup
Add a newsletter signup form:

```tsx
<div className="max-w-md mx-auto">
  <input 
    type="email" 
    placeholder="Enter your email" 
    className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-3"
  />
  <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
    Notify Me at Launch
  </button>
</div>
```

## Files Modified

- ✅ Created `app/page.tsx` - New wrapper page
- ✅ Moved original homepage to `app/main/page.tsx`
- ✅ Updated `components/Navbar.tsx` - Links now point to `/main`

## Testing

### Test Wrapper Page
```bash
npm run dev
# Visit http://localhost:3000
# Should see "Coming Soon" page
```

### Test Main Site
```bash
# Click "Preview Website" button
# OR visit http://localhost:3000/main
# Should see full website
```

### Test Navigation
- All navbar links should work
- Properties should load
- Admin page should be accessible at `/admin`
- Property details should work

## SEO Considerations

### Current Setup
The wrapper page is good for:
- ✅ Showing professional "Coming Soon" message
- ✅ Collecting interest
- ✅ Providing contact information
- ✅ Allowing preview access

### Before Launch
Consider adding to `app/layout.tsx`:
```tsx
export const metadata = {
  title: 'Coming Soon - pgUncle',
  description: 'pgUncle is launching soon. Your trusted uncle for comfortable PG stays in Chandigarh.',
  robots: 'noindex, nofollow' // Prevent search engines from indexing
}
```

### After Launch
Remove `noindex` and update metadata to promote the site.

## Next Steps

1. **Customize wrapper content** - Update text, colors, features
2. **Add email collection** - Capture interested users
3. **Set launch date** - Add countdown timer
4. **Test thoroughly** - Ensure all links work
5. **When ready to launch** - Follow "Option 1" above to show full site

## Support

- Wrapper page code: `app/page.tsx`
- Main site code: `app/main/page.tsx`
- Navigation: `components/Navbar.tsx`
