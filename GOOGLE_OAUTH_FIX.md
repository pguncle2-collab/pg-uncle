# 🔧 Fix Google OAuth Redirect Issue

## Problem
After signing in with Google, it redirects to `localhost` instead of your actual domain.

## Root Cause
The Supabase Site URL is not configured correctly, causing OAuth redirects to default to localhost.

---

## ✅ Solution (5 minutes)

### Step 1: Configure Supabase Site URL

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/ijwbczqupzocgvuylanr
   ```

2. Navigate to: **Settings** → **General** → **Configuration**

3. Find **Site URL** field

4. Set it to your production domain:
   ```
   https://your-domain.com
   ```
   
   **For local development**, set it to:
   ```
   http://localhost:3000
   ```

5. Click **Save**

---

### Step 2: Configure Redirect URLs

1. Still in Supabase Dashboard, go to: **Authentication** → **URL Configuration**

2. Add these **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

3. Click **Save**

---

### Step 3: Update Google OAuth Redirect URIs

1. Go to Google Cloud Console:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. Click on your OAuth 2.0 Client ID

3. Under **Authorized redirect URIs**, make sure you have:
   ```
   https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback
   ```

4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   https://your-domain.com
   ```

5. Click **Save**

---

### Step 4: Test the Fix

1. Clear browser cache and cookies

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Go to: http://localhost:3000

4. Click Login → Continue with Google

5. Sign in with Google

6. You should now be redirected back to your site (not localhost error)

---

## 🎯 How OAuth Flow Works

```
User clicks "Continue with Google"
    ↓
Redirects to Google sign-in
    ↓
User authenticates with Google
    ↓
Google redirects to: https://[your-project].supabase.co/auth/v1/callback
    ↓
Supabase processes authentication
    ↓
Supabase redirects to: [Site URL]/auth/callback
    ↓
Your app exchanges code for session
    ↓
Redirects to homepage
    ↓
User is logged in! ✅
```

The **Site URL** in Supabase determines where users are redirected after OAuth.

---

## 🔧 For Production Deployment

When you deploy to production (Vercel, Netlify, etc.):

1. **Update Supabase Site URL**:
   - Change from `http://localhost:3000`
   - To your production domain: `https://your-domain.com`

2. **Add Production Redirect URL**:
   - In Supabase: `https://your-domain.com/auth/callback`

3. **Update Google OAuth**:
   - Add production domain to authorized origins
   - Keep localhost for local development

---

## 🐛 Common Issues

### Issue: Still redirecting to localhost
**Solution**: 
- Clear browser cache completely
- Check Supabase Site URL is correct
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Issue: "Invalid redirect URI"
**Solution**:
- Verify redirect URLs match exactly in:
  - Google Console
  - Supabase Auth settings
- No trailing slashes
- Check http vs https

### Issue: "Access blocked"
**Solution**:
- Configure OAuth consent screen in Google Console
- Add your email as test user
- Publish app (or keep in testing mode with test users)

---

## 📋 Quick Checklist

- [ ] Supabase Site URL set correctly
- [ ] Redirect URLs added in Supabase
- [ ] Google OAuth redirect URI includes Supabase callback
- [ ] Google authorized origins include your domain
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Tested Google sign-in

---

## 🎉 After Fix

Users will be able to:
- ✅ Sign in with Google smoothly
- ✅ Get redirected back to your site
- ✅ Stay logged in across sessions
- ✅ No localhost errors

---

**Time to Fix**: 5 minutes  
**Status**: 🟢 **READY TO CONFIGURE**

**Next Step**: Go to Supabase Dashboard and set the Site URL!
