# 🔍 Troubleshooting Vercel Deployment

## Common Errors and Solutions

---

### Error 1: "supabaseUrl is required"

**Cause:** Environment variables not set in Vercel

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure to select all environments (Production, Preview, Development)
4. Redeploy

**How to verify it's fixed:**
- Visit: `https://your-domain.vercel.app/api/verify-env`
- Should show: `"status": "success"`

---

### Error 2: "Module not found" or "Cannot find module"

**Cause:** Missing dependencies or incorrect imports

**Solution:**
1. Check if `package.json` is committed
2. Make sure all imports use correct paths
3. Redeploy with "Clear Build Cache" option

**Commands to run locally:**
```bash
npm install
npm run build
```

If build succeeds locally, push changes and redeploy.

---

### Error 3: Build fails with TypeScript errors

**Cause:** Type errors in code

**Solution:**
1. Run locally: `npm run build`
2. Fix any TypeScript errors shown
3. Commit and push fixes
4. Redeploy

---

### Error 4: "Failed to load resource" or 404 errors

**Cause:** Missing files or incorrect paths

**Solution:**
1. Check that all referenced files exist in the repository
2. Verify image paths are correct (case-sensitive)
3. Make sure files are committed to git
4. Redeploy

---

### Error 5: Environment variables not loading

**Symptoms:**
- Variables show in Vercel dashboard
- But still getting errors about missing variables

**Solution:**
1. **Check variable names are EXACT** (case-sensitive):
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ❌ `SUPABASE_URL`
   - ❌ `next_public_supabase_url`

2. **Check for extra spaces:**
   - No spaces before or after the value
   - Copy-paste directly from the guide

3. **Verify environment selection:**
   - All three must be checked: Production, Preview, Development

4. **Force redeploy:**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"
   - UNCHECK "Use existing Build Cache"
   - Click "Redeploy"

---

### Error 6: "This page could not be found"

**Cause:** Routing issue or missing page

**Solution:**
1. Check that the page file exists in the correct location
2. Verify file naming (must be `page.tsx` or `page.js`)
3. Check folder structure matches Next.js conventions
4. Redeploy

---

### Error 7: Deployment succeeds but website shows old version

**Cause:** Browser cache or CDN cache

**Solution:**
1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache:**
   - Chrome: `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

3. **Try incognito/private mode:**
   - This bypasses cache completely

4. **Wait 2-3 minutes:**
   - Vercel CDN needs time to update globally

---

### Error 8: API routes returning 500 errors

**Cause:** Server-side error in API route

**Solution:**
1. Go to Vercel Dashboard → Deployments → Click deployment
2. Click "Functions" tab
3. Click on the failing API route
4. Check the error logs
5. Fix the error in code
6. Commit, push, and redeploy

**Common API errors:**
- Missing environment variables
- Database connection issues
- Incorrect Supabase queries
- Missing error handling

---

### Error 9: Images not loading

**Cause:** Incorrect image paths or missing images

**Solution:**
1. Check images are in `public/` folder
2. Verify paths don't include `/public/` in the code
3. Example:
   - ✅ `<Image src="/logo.png" />`
   - ❌ `<Image src="/public/logo.png" />`
4. Make sure images are committed to git
5. Redeploy

---

### Error 10: "Too many redirects" error

**Cause:** Redirect loop in middleware or configuration

**Solution:**
1. Check `middleware.ts` for redirect loops
2. Verify authentication redirects
3. Check `next.config.js` for redirect rules
4. Temporarily disable middleware to test

---

## 🔧 Diagnostic Steps

### Step 1: Check Vercel Build Logs
1. Go to Deployments tab
2. Click on the failed/latest deployment
3. Scroll through the build logs
4. Look for red error messages
5. Note the exact error message

### Step 2: Check Function Logs
1. In the deployment view, click "Functions" tab
2. Click on any API route that's failing
3. Check the runtime logs
4. Look for error stack traces

### Step 3: Test Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

If it works locally but not on Vercel, it's likely an environment variable issue.

### Step 4: Verify Environment Variables
Visit: `https://your-domain.vercel.app/api/verify-env`

Expected response:
```json
{
  "status": "success",
  "message": "All required environment variables are set",
  "required": {
    "supabaseUrl": true,
    "supabaseKey": true
  }
}
```

If you see `false` values, those variables are missing.

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:
- [ ] All code is committed to git
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] All environment variables are documented
- [ ] `.env.local` is in `.gitignore`
- [ ] All images are in `public/` folder
- [ ] API routes are tested locally

---

## 🆘 Still Stuck?

### Get Help:
1. **Check Vercel Status:** https://www.vercel-status.com/
2. **Vercel Docs:** https://vercel.com/docs
3. **Share error details:**
   - Exact error message
   - Screenshot of error
   - Build logs
   - Function logs

### Information to Provide:
- What error are you seeing?
- Which step are you stuck on?
- What have you tried so far?
- Screenshot of the error
- Screenshot of your environment variables in Vercel

---

## 🎯 Quick Fixes Summary

| Error | Quick Fix |
|-------|-----------|
| supabaseUrl required | Add environment variables |
| Build fails | Check build logs, fix errors |
| 404 errors | Check file paths and names |
| Old version showing | Hard refresh browser |
| API 500 errors | Check function logs |
| Images not loading | Verify paths and public folder |
| Variables not loading | Check names, redeploy without cache |

---

## ✅ Verification Commands

After deployment, test these URLs:

1. **Homepage:**
   ```
   https://your-domain.vercel.app
   ```

2. **Environment check:**
   ```
   https://your-domain.vercel.app/api/verify-env
   ```

3. **API health:**
   ```
   https://your-domain.vercel.app/api/bookings
   ```
   (Should return 405 Method Not Allowed - that's correct!)

---

**Remember: Most deployment issues are due to missing environment variables or build errors. Start with those first!**
