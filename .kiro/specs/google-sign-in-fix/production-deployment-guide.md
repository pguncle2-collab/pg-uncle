# Production Deployment Guide

## Critical Issues Fixed

### Issue 1: Sign Out Button Not Working
**Symptom**: Clicking sign out button does nothing or shows error

**Root Cause**: 
- Error thrown in `signOut()` was not caught in Navbar
- User state wasn't cleared immediately, causing UI to appear broken
- Error propagation prevented sign out from completing

**Fix Applied**:
1. **AuthContext.tsx**: Clear user state immediately before API call
2. **AuthContext.tsx**: Don't throw errors on sign out failure (log only)
3. **Navbar.tsx**: Added try-catch to handle sign out errors gracefully

**Result**: Sign out now works reliably even if API call fails

### Issue 2: "Invalid API key - AuthApiError" in Production
**Symptom**: Authentication fails in production with "Invalid API key" error

**Root Cause**:
- Singleton pattern returned cached client before validating environment variables
- Environment variables not properly set in production deployment
- Error message referenced `.env.local` which doesn't exist in production

**Fix Applied**:
1. **lib/supabase-client.ts**: Validate environment variables before returning cached instance
2. **lib/supabase-client.ts**: Updated error messages to reference "environment variables" instead of ".env.local"
3. **lib/supabase-client.ts**: Improved validation order

**Result**: Clear error messages when env vars are missing, proper client creation in production

## Production Environment Variables Checklist

### Required Variables
These MUST be set in your production environment (Vercel, Netlify, etc.):

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-admin-password

# Razorpay Configuration (if using payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# SMTP Configuration (if using contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Vercel Deployment Steps

1. **Set Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables listed above
   - Set them for Production, Preview, and Development environments

2. **Verify Supabase Configuration**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the Project URL → Set as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the anon/public key → Set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the service_role key → Set as `SUPABASE_SERVICE_ROLE_KEY`

3. **Configure OAuth Redirect URLs**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production URL: `https://yourdomain.com/auth/callback`
   - Add your preview URLs: `https://*-yourproject.vercel.app/auth/callback`

4. **Deploy**:
   ```bash
   git push origin main
   ```
   - Vercel will automatically deploy
   - Check deployment logs for any errors

### Netlify Deployment Steps

1. **Set Environment Variables**:
   - Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
   - Add all required variables listed above

2. **Configure Build Settings**:
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy**:
   ```bash
   git push origin main
   ```

## Verification Steps After Deployment

### 1. Check Environment Variables
```bash
# In browser console on your production site
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

Expected output:
```
Supabase URL: https://your-project.supabase.co
Has Anon Key: true
```

### 2. Test Google Sign-In Flow
1. Open production site
2. Click "Continue with Google"
3. Complete Google authentication
4. Verify you're redirected back and logged in
5. Reload the page
6. Verify you're still logged in (should show within 1 second)

### 3. Test Sign Out
1. While logged in, click user menu
2. Click "Sign Out"
3. Verify you're immediately logged out
4. Verify UI updates to show login/signup button
5. Reload the page
6. Verify you're still logged out

### 4. Test Email/Password Authentication
1. Click "Sign Up"
2. Fill in email, password, name
3. Submit form
4. Verify account is created
5. Sign out
6. Sign in with same credentials
7. Verify login works

### 5. Check Browser Console
- Open browser console (F12)
- Look for any errors
- Should see no "Invalid API key" errors
- Should see no "Lock broken" errors

## Common Production Issues

### Issue: "Invalid API key" Error
**Solution**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
3. Check that keys don't have extra spaces or quotes
4. Redeploy after setting environment variables

### Issue: OAuth Redirect Fails
**Solution**:
1. Check Supabase Dashboard → Authentication → URL Configuration
2. Ensure production URL is added: `https://yourdomain.com/auth/callback`
3. Ensure wildcard for preview URLs: `https://*-yourproject.vercel.app/auth/callback`
4. Wait 5 minutes for Supabase to propagate changes

### Issue: Sign Out Doesn't Work
**Solution**:
1. Check browser console for errors
2. Verify Supabase client is created properly
3. Clear browser cache and cookies
4. Try in incognito mode

### Issue: Slow Auth State Loading
**Solution**:
1. Verify middleware is not calling `getUser()` (should be removed)
2. Check network tab for slow API calls
3. Verify database queries are not blocking UI updates
4. Check that `handleUserAuth` sets user state immediately

## Monitoring and Logging

### Key Metrics to Monitor
1. **Authentication Success Rate**: Should be > 95%
2. **Sign Out Success Rate**: Should be 100%
3. **Auth State Load Time**: Should be < 1 second
4. **Lock Error Rate**: Should be 0%

### Logging
Add these logs to monitor production:

```typescript
// In AuthContext.tsx
console.log('[Auth] Session loaded:', !!session)
console.log('[Auth] User authenticated:', !!user)

// In Navbar.tsx
console.log('[Auth] Sign out initiated')
console.log('[Auth] Sign out completed')

// In middleware.ts
console.log('[Middleware] Request:', request.url)
```

## Rollback Plan

If issues occur in production:

1. **Immediate Rollback**:
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   # Use Netlify Dashboard → Deploys → Previous Deploy → Publish
   ```

2. **Verify Previous Version**:
   - Test authentication flow
   - Verify sign out works
   - Check for errors in console

3. **Debug New Version**:
   - Check deployment logs
   - Verify environment variables
   - Test in preview environment first

## Support Checklist

If users report authentication issues:

- [ ] Verify environment variables are set
- [ ] Check Supabase dashboard for service status
- [ ] Review deployment logs for errors
- [ ] Test authentication flow in production
- [ ] Check browser console for client-side errors
- [ ] Verify OAuth redirect URLs are configured
- [ ] Test in different browsers
- [ ] Clear cache and test again

## Success Criteria

Deployment is successful when:

- ✅ Google sign-in works consistently
- ✅ Email/password authentication works
- ✅ Sign out works immediately
- ✅ Auth state loads within 1 second after page reload
- ✅ No "Invalid API key" errors
- ✅ No "Lock broken" errors
- ✅ All tests pass in production
- ✅ No console errors related to authentication
