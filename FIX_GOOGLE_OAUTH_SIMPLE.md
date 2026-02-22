# 🔧 Fix Google OAuth - Super Simple Guide

## What's Happening?
When you click "Continue with Google", it signs you in but then redirects to `localhost` instead of your actual website.

## Why?
Supabase doesn't know where to send users after Google login. We need to tell it.

---

## 🎯 THE FIX (Follow These Exact Steps)

### STEP 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Click on your project (the one with ID: `ijwbczqupzocgvuylanr`)

---

### STEP 2: Set the Site URL

1. On the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"General"**
3. Scroll down to find **"Site URL"**
4. You'll see a text box that probably says `http://localhost:3000`
5. **IMPORTANT**: 
   - If testing locally, keep it as: `http://localhost:3000`
   - If your site is live, change it to: `https://your-actual-domain.com`
6. Click **"Save"** button

**What this does**: Tells Supabase where to send users after Google login.

---

### STEP 3: Add Redirect URLs

1. Still in Settings, click **"Authentication"** in the left sidebar
2. Scroll down to find **"Redirect URLs"** section
3. You'll see a text area (might be empty or have some URLs)
4. Add these URLs (one per line):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```
5. If you have a live domain, also add:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.com
   ```
6. Click **"Save"**

**What this does**: Tells Supabase which URLs are allowed to receive users after login.

---

### STEP 4: Check Google OAuth is Enabled

1. In Supabase, click **"Authentication"** in left sidebar
2. Click **"Providers"**
3. Find **"Google"** in the list
4. Make sure the toggle is **ON** (green)
5. You should see:
   - Client ID (filled in)
   - Client Secret (filled in)
6. If these are empty, you need to set up Google OAuth first (see below)

---

### STEP 5: Test It

1. **Close your browser completely** (to clear cache)
2. **Restart your dev server**:
   ```bash
   # In terminal, press Ctrl+C to stop
   npm run dev
   ```
3. Open browser and go to: http://localhost:3000
4. Click **Login** → **Continue with Google**
5. Sign in with Google
6. You should now be redirected back to your homepage (not localhost error)

---

## 🚨 If Google OAuth is NOT Set Up Yet

If you saw empty Client ID/Secret in Step 4, follow these steps:

### A. Create Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to: **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. If prompted, configure consent screen:
   - User Type: **External**
   - App name: **PGUNCLE**
   - Your email for support
   - Click **Save and Continue** through all steps
6. Back to Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **PGUNCLE**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback
     ```
   - Click **Create**
7. **Copy** the Client ID and Client Secret shown

### B. Add to Supabase

1. Go back to Supabase → Authentication → Providers → Google
2. Paste:
   - **Client ID**: (from Google)
   - **Client Secret**: (from Google)
3. Click **Save**

---

## 🎯 Quick Checklist

Before testing, make sure:

- [ ] Supabase Site URL is set to `http://localhost:3000`
- [ ] Redirect URLs include `http://localhost:3000/auth/callback`
- [ ] Google provider is enabled in Supabase
- [ ] Google OAuth has Client ID and Secret
- [ ] Browser cache cleared
- [ ] Dev server restarted

---

## 🐛 Still Not Working?

### Check 1: Look at Browser Console
1. Open browser
2. Press F12 (or right-click → Inspect)
3. Click "Console" tab
4. Try Google login again
5. Look for red error messages
6. Share the error with me

### Check 2: Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Authentication" → "Logs"
3. Try Google login again
4. Look for failed attempts
5. Share what you see

### Check 3: Verify Environment Variables
1. Check your `.env.local` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ijwbczqupzocgvuylanr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```
2. Make sure these match your Supabase project

---

## 📸 Visual Guide

### Where to find Site URL:
```
Supabase Dashboard
└── Settings (gear icon)
    └── General
        └── Configuration section
            └── Site URL field ← CHANGE THIS
```

### Where to find Redirect URLs:
```
Supabase Dashboard
└── Settings (gear icon)
    └── Authentication
        └── Redirect URLs section ← ADD URLS HERE
```

### Where to find Google Provider:
```
Supabase Dashboard
└── Authentication
    └── Providers
        └── Google ← TOGGLE ON & ADD CREDENTIALS
```

---

## ✅ What Success Looks Like

After the fix:
1. Click "Continue with Google"
2. Google login popup appears
3. You sign in
4. Popup closes
5. You're back on your homepage
6. You're logged in (can see your name/profile)

---

## 💡 Simple Explanation

Think of it like giving someone your home address:

- **Site URL** = Your home address (where to send people)
- **Redirect URLs** = List of doors they can use to enter
- **Google OAuth** = The delivery service bringing users to you

If you don't tell Supabase your address, it sends people to "localhost" (nowhere).

---

**Need Help?** Share:
1. Screenshot of Supabase Site URL setting
2. Screenshot of Redirect URLs setting
3. Any error messages from browser console

I'll help you fix it!
