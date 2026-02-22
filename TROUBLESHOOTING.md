# 🔧 Troubleshooting Guide

## Issue: "Database Connection Error - TypeError: Failed to fetch"

This error typically occurs when the browser can't connect to Supabase. Here are the solutions:

### Solution 1: Hard Refresh Browser (Most Common Fix) ✅

The browser might be caching old code. Do a hard refresh:

**Mac:**
- Chrome/Edge: `Cmd + Shift + R`
- Safari: `Cmd + Option + R`

**Windows/Linux:**
- Chrome/Edge/Firefox: `Ctrl + Shift + R`

### Solution 2: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Solution 3: Check Environment Variables

1. Open `.env.local`
2. Verify these lines exist:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ijwbczqupzocgvuylanr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2JjenF1cHpvY2d2dXlsYW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjY5NDIsImV4cCI6MjA4NTU0Mjk0Mn0.33oPoABV9w9dSagvv4TZcN6RMgOBVq6ax5rMXSpSLEY
```

### Solution 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Solution 5: Test Connection

Visit the test page to diagnose the issue:
```
http://localhost:3000/test-connection
```

This will show:
- ✅ If environment variables are set
- ✅ If Supabase connection works
- ❌ Detailed error messages if it fails

### Solution 6: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check for:
   - "Missing Supabase environment variables"
   - Network errors
   - CORS errors

### Solution 7: Verify Supabase Project

1. Go to: https://supabase.com/dashboard/project/ijwbczqupzocgvuylanr
2. Check if project is active
3. Verify API keys in Settings → API

### Solution 8: Check Network

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests to Supabase
5. Check the error details

### Solution 9: Clear Next.js Cache

```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

### Solution 10: Reinstall Dependencies

```bash
# Stop server (Ctrl+C)
rm -rf node_modules
npm install
npm run dev
```

---

## Common Error Messages

### "Failed to fetch"
**Cause:** Browser can't reach Supabase
**Fix:** Hard refresh browser (Cmd+Shift+R)

### "Missing Supabase environment variables"
**Cause:** .env.local not loaded
**Fix:** Restart dev server

### "Invalid API key"
**Cause:** Wrong API key in .env.local
**Fix:** Copy correct key from Supabase dashboard

### "CORS error"
**Cause:** Supabase CORS settings
**Fix:** Usually auto-configured, check Supabase dashboard

---

## Quick Diagnostic Steps

1. **Check server is running:**
   ```
   Should see: ✓ Ready in XXXms
   ```

2. **Check browser console:**
   ```
   F12 → Console tab
   Look for red errors
   ```

3. **Test connection page:**
   ```
   http://localhost:3000/test-connection
   ```

4. **Hard refresh:**
   ```
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

---

## Still Having Issues?

### Check These:

1. **Dev server running?**
   - Should see "Ready in XXXms" in terminal

2. **Correct URL?**
   - http://localhost:3000 (not 3001 or 3002)

3. **Browser updated?**
   - Use latest Chrome, Firefox, or Safari

4. **Internet connection?**
   - Supabase requires internet access

5. **Firewall/VPN?**
   - May block Supabase connection

---

## Debug Mode

Add this to see detailed logs:

1. Open browser console (F12)
2. Refresh page
3. Look for these logs:
   - "Fetching properties from Supabase..."
   - "Properties fetched successfully: X"
   - Or error details

---

## Contact Support

If none of these work:

1. Take screenshot of:
   - Browser console errors
   - Test connection page results
   - Terminal output

2. Check:
   - Browser version
   - Operating system
   - Node.js version (`node -v`)

---

## Most Likely Fix

**90% of the time, the issue is browser cache.**

**Solution:**
1. Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Wait for page to reload
3. Should work! ✅

---

**Last Updated:** Current Session  
**Dev Server:** http://localhost:3000  
**Test Page:** http://localhost:3000/test-connection
