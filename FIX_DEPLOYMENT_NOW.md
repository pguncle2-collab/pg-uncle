# 🔧 Fix Vercel Deployment Issue - Step by Step

## Problem
Your website shows: **"Error: supabaseUrl is required"**

## Solution (Follow these exact steps)

---

## STEP 1: Open Vercel Dashboard

1. Go to: **https://vercel.com**
2. Click **"Login"** (top right)
3. Sign in with your account

---

## STEP 2: Find Your Project

1. You'll see your dashboard with all projects
2. Look for your project name (probably "pguncle" or "pg-uncle")
3. **Click on the project name**

---

## STEP 3: Go to Settings

1. At the top of the page, you'll see tabs: Overview, Deployments, Analytics, Settings, etc.
2. **Click on "Settings"** tab

---

## STEP 4: Open Environment Variables

1. On the left sidebar, you'll see many options
2. **Click on "Environment Variables"**
3. You'll see a page with a button "Add New"

---

## STEP 5: Add First Variable (Supabase URL)

1. **Click "Add New"** button
2. Fill in the form:

   **Name (Key):**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```

   **Value:**
   ```
   https://ijwbczqupzocgvuylanr.supabase.co
   ```

   **Environments:** (Check ALL three boxes)
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

3. **Click "Save"**

---

## STEP 6: Add Second Variable (Supabase Key)

1. **Click "Add New"** button again
2. Fill in the form:

   **Name (Key):**
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

   **Value:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2JjenF1cHpvY2d2dXlsYW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjY5NDIsImV4cCI6MjA4NTU0Mjk0Mn0.33oPoABV9w9dSagvv4TZcN6RMgOBVq6ax5rMXSpSLEY
   ```

   **Environments:** (Check ALL three boxes)
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. **Click "Save"**

---

## STEP 7: Verify Variables Are Added

You should now see both variables listed:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

Each should show: "Production, Preview, Development"

---

## STEP 8: Redeploy Your Application

1. **Click on "Deployments"** tab (at the top)
2. You'll see a list of your deployments
3. Find the **most recent deployment** (at the top)
4. On the right side, click the **three dots (...)** button
5. Click **"Redeploy"**
6. A popup will appear
7. **Click "Redeploy"** again to confirm

---

## STEP 9: Wait for Build to Complete

1. You'll see "Building..." status
2. Wait 2-3 minutes
3. Status will change to "Ready" with a green checkmark ✅

---

## STEP 10: Test Your Website

1. Click on the deployment to open it
2. Or click "Visit" button
3. Your website should now load without errors!

---

## ✅ Success Checklist

After following all steps, verify:
- [ ] Both environment variables are added in Vercel
- [ ] All three environments are selected (Production, Preview, Development)
- [ ] Deployment shows "Ready" status
- [ ] Website loads without "supabaseUrl is required" error
- [ ] You can see properties on the homepage
- [ ] Discount popup appears after 3 seconds
- [ ] Login/Signup buttons work

---

## 🆘 Still Having Issues?

### Issue 1: Variables not showing up
**Solution:** Make sure you clicked "Save" after adding each variable

### Issue 2: Deployment still failing
**Solution:** 
1. Go to the failed deployment
2. Click "View Function Logs"
3. Look for the specific error message
4. Share the error with me

### Issue 3: Old error still showing
**Solution:**
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Or open in Incognito/Private mode
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 4: Can't find Environment Variables section
**Solution:**
1. Make sure you're in the correct project
2. Make sure you have admin/owner access to the project
3. Try refreshing the Vercel dashboard

---

## 📱 Need Visual Help?

If you're stuck on any step, take a screenshot of what you see and I can guide you through it.

---

## 🎯 Quick Copy-Paste Reference

**Variable 1 Name:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Variable 1 Value:**
```
https://ijwbczqupzocgvuylanr.supabase.co
```

**Variable 2 Name:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Variable 2 Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2JjenF1cHpvY2d2dXlsYW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjY5NDIsImV4cCI6MjA4NTU0Mjk0Mn0.33oPoABV9w9dSagvv4TZcN6RMgOBVq6ax5rMXSpSLEY
```

---

## ⏱️ Time Required
Total time: **5-7 minutes**
- Adding variables: 2-3 minutes
- Redeployment: 2-3 minutes
- Testing: 1 minute

---

## 🎉 After Success

Once your website is working:
1. Test all features (login, booking, etc.)
2. Check on mobile devices
3. Share the link with others to test

Your website will be live at: `https://your-project-name.vercel.app`

---

**Need help with any specific step? Let me know which step number you're stuck on!**
