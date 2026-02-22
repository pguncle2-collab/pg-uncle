# WhatsApp Button Setup Guide

## What's Been Added

A floating WhatsApp button has been added to all pages of the website. This button:
- Appears in the bottom-right corner of every page
- Has a pulsing animation to attract attention
- Shows a tooltip on hover: "Chat with us on WhatsApp"
- Opens WhatsApp with a pre-filled message when clicked
- Works on both desktop and mobile devices

## How to Update Your WhatsApp Number

### Step 1: Get Your WhatsApp Business Number
Make sure you have a WhatsApp Business account set up with your business number.

### Step 2: Update the Number in Code
Open the file: `components/WhatsAppButton.tsx`

Find this line:
```typescript
const whatsappNumber = '919876543210';
```

Replace `919876543210` with your actual WhatsApp Business number in this format:
- Include country code (91 for India)
- No spaces, no dashes, no plus sign
- Example for India: `919876543210`
- Example for US: `12025551234`

### Step 3: Customize the Default Message (Optional)
You can also change the pre-filled message that appears when users click the button.

Find this line:
```typescript
const message = encodeURIComponent('Hi PGUNCLE, I would like to know more about your PG accommodations.');
```

Change the text inside the quotes to whatever you want.

### Step 4: Also Update Contact Page
The contact page also has a WhatsApp button. Update it in: `app/contact/page.tsx`

Find this line:
```typescript
const whatsappNumber = '919876543210';
```

Update it with the same number as above.

## Features

### Desktop Experience
- Button appears in bottom-right corner
- Hover shows tooltip
- Click opens WhatsApp Web in new tab
- Smooth animations and transitions

### Mobile Experience
- Button appears in bottom-right corner
- Tap opens WhatsApp app directly
- Pre-filled message ready to send
- Seamless user experience

### Design Features
- Green color matching WhatsApp branding
- Pulsing animation to draw attention
- Hover effects for better UX
- High z-index to stay above other content
- Responsive on all screen sizes

## Testing

After updating the number, test the button:

1. **On Desktop:**
   - Click the button
   - Should open WhatsApp Web
   - Should show your business number
   - Should have pre-filled message

2. **On Mobile:**
   - Tap the button
   - Should open WhatsApp app
   - Should show your business number
   - Should have pre-filled message ready

## Customization Options

### Change Button Position
In `components/WhatsAppButton.tsx`, modify these classes:
```typescript
className="fixed bottom-6 right-6 ..."
```
- `bottom-6` = distance from bottom (change to `bottom-8`, `bottom-4`, etc.)
- `right-6` = distance from right (change to `right-8`, `right-4`, etc.)
- Can also use `left-6` to move to left side

### Change Button Size
Modify these classes:
```typescript
className="... w-16 h-16 ..."
```
- `w-16 h-16` = 64px × 64px
- Try `w-14 h-14` for smaller (56px)
- Try `w-20 h-20` for larger (80px)

### Change Button Color
Modify these classes:
```typescript
className="... bg-green-500 hover:bg-green-600 ..."
```
- Change `green` to `blue`, `purple`, `red`, etc.

### Remove Pulse Animation
Remove this line if you don't want the pulsing effect:
```typescript
<span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
```

## Current Setup

**Files Modified:**
- `components/WhatsAppButton.tsx` - The button component
- `app/layout.tsx` - Added button to all pages
- `app/contact/page.tsx` - Contact page WhatsApp section

**Current Number:** 919876543210 (NEEDS TO BE UPDATED)

**Current Message:** "Hi PGUNCLE, I would like to know more about your PG accommodations."

## Important Notes

1. The button appears on ALL pages automatically
2. Make sure your WhatsApp Business is active
3. Test on both mobile and desktop
4. The number format is critical - no spaces or special characters
5. Update the number in BOTH files (WhatsAppButton.tsx and contact/page.tsx)
