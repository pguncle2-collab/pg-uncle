# 🔐 Google Authentication Setup Guide

## ✅ What's Been Done

- ✅ Removed Facebook login button
- ✅ Kept only Google sign-in
- ✅ Added Google OAuth handler
- ✅ Created auth callback route
- ✅ Full-width Google button

---

## 🚀 Setup Google OAuth (5 minutes)

### Step 1: Enable Google Auth in Supabase

1. Go to your Supabase dashboard:
   ```
   https://supabase.com/dashboard/project/ijwbczqupzocgvuylanr
   ```

2. Navigate to: **Authentication** → **Providers**

3. Find **Google** in the list

4. Toggle it **ON**

5. You'll see two fields:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)

Keep this tab open, we'll come back to it.

---

### Step 2: Create Google OAuth Credentials

1. Go to Google Cloud Console:
   ```
   https://console.cloud.google.com/
   ```

2. Create a new project (or select existing):
   - Click project dropdown at top
   - Click "New Project"
   - Name: "PGUNCLE" (or any name)
   - Click "Create"

3. Enable Google+ API:
   - Go to: **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click it and click "Enable"

4. Create OAuth Credentials:
   - Go to: **APIs & Services** → **Credentials**
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: **External**
     - App name: **PGUNCLE**
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Skip scopes (click "Save and Continue")
     - Add test users if needed
     - Click "Save and Continue"

5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **PGUNCLE Web**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-domain.com (when you deploy)
     ```
   - Authorized redirect URIs:
     ```
     https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback
     ```
   - Click "Create"

6. Copy credentials:
   - You'll see **Client ID** and **Client Secret**
   - Keep this window open

---

### Step 3: Add Credentials to Supabase

1. Go back to Supabase dashboard (Authentication → Providers → Google)

2. Paste the credentials:
   - **Client ID**: Paste from Google Console
   - **Client Secret**: Paste from Google Console

3. Copy the **Redirect URL** shown in Supabase:
   ```
   https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback
   ```

4. Make sure this URL is in your Google OAuth redirect URIs (Step 2.5)

5. Click **Save** in Supabase

---

### Step 4: Test It!

1. Restart your dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. Hard refresh browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

3. Go to any property page

4. Click "🔐 Login to Book"

5. Click "Continue with Google"

6. Sign in with your Google account

7. You'll be redirected back to the homepage

8. You're now logged in! ✅

---

## 🎯 How It Works

### Flow:
```
1. User clicks "Continue with Google"
   ↓
2. Redirects to Google sign-in page
   ↓
3. User signs in with Google
   ↓
4. Google redirects back to Supabase
   ↓
5. Supabase creates/updates user
   ↓
6. Redirects to /auth/callback
   ↓
7. Callback exchanges code for session
   ↓
8. Redirects to homepage
   ↓
9. User is logged in! ✅
```

---

## 🔧 Technical Details

### Files Created/Updated:

1. **`components/AuthModal.tsx`**
   - Removed Facebook button
   - Added Google OAuth handler
   - Full-width Google button

2. **`app/auth/callback/route.ts`**
   - Handles OAuth redirect
   - Exchanges code for session
   - Redirects to homepage

### Google Button:
```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

---

## 🧪 Testing

### Test Google Sign In:
1. Click "Continue with Google"
2. Select Google account
3. Grant permissions
4. Should redirect back to homepage
5. Check if logged in (button shows "💳 Book Now & Pay")

### Test Google Sign Up:
- Same as sign in!
- Google OAuth automatically creates account if it doesn't exist
- User data is saved to database

---

## 🔒 Security

### What's Protected:
- ✅ OAuth flow handled by Supabase
- ✅ Secure token exchange
- ✅ HTTPS required in production
- ✅ User data encrypted

### User Data:
When user signs in with Google, we get:
- Email
- Full name
- Profile picture (optional)
- Google ID

This is automatically saved to Supabase Auth.

---

## 🎨 UI Updates

### Before:
```
[Google] [Facebook]  (two buttons side by side)
```

### After:
```
[Continue with Google]  (one full-width button)
```

---

## 📝 Production Checklist

Before going live:

1. **Update Google OAuth**:
   - [ ] Add production domain to authorized origins
   - [ ] Add production redirect URI
   - [ ] Verify OAuth consent screen

2. **Supabase**:
   - [ ] Google provider enabled
   - [ ] Credentials added
   - [ ] Test in production

3. **Testing**:
   - [ ] Test Google sign in
   - [ ] Test on mobile
   - [ ] Test on different browsers

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution**: 
- Check Google Console redirect URIs
- Must include: `https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback`

### Issue: "Access blocked: This app's request is invalid"
**Solution**:
- Configure OAuth consent screen in Google Console
- Add your email as test user

### Issue: Google button doesn't work
**Solution**:
- Check browser console for errors
- Verify Google provider is enabled in Supabase
- Check credentials are correct

### Issue: Redirects but not logged in
**Solution**:
- Check `/auth/callback/route.ts` exists
- Hard refresh browser
- Check Supabase Auth logs

---

## ✅ Current Status

**Google OAuth**: ✅ Code Ready

**What's Working:**
- ✅ Google button in auth modal
- ✅ OAuth handler implemented
- ✅ Callback route created
- ✅ Facebook removed

**What's Needed:**
1. Enable Google provider in Supabase
2. Create Google OAuth credentials
3. Add credentials to Supabase
4. Test!

---

## 🎉 Benefits

### For Users:
- ✅ One-click sign in
- ✅ No password to remember
- ✅ Faster registration
- ✅ Trusted by Google

### For You:
- ✅ Less password management
- ✅ Verified email addresses
- ✅ Better user experience
- ✅ Higher conversion rates

---

**Setup Time**: ~5 minutes  
**Dev Server**: http://localhost:3000  
**Status**: 🟢 **READY TO CONFIGURE**

**Next Step**: Follow Step 1 above to enable Google OAuth in Supabase!
