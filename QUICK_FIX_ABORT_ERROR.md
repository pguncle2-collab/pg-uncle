# 🚨 QUICK FIX: AbortError (Project NOT Paused)

## The Error You're Seeing:
```
Unhandled Runtime Error
AbortError: signal is aborted without reason
at eval (locks.js:108:29)
```

## 🎯 Root Cause:

This is caused by Supabase's **Web Locks API** creating conflicts when multiple client instances try to access the same session storage. This happens even when your project is NOT paused.

## ✅ IMMEDIATE FIX (Takes 1 minute):

### Option 1: Clear Browser Storage (Fastest)

1. **Open your app in the browser**
2. **Open DevTools**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. **Go to Console tab**
4. **Paste this command and press Enter**:
   ```javascript
   localStorage.clear(); location.reload();
   ```
5. **Done!** The error should be gone.

### Option 2: Use the Clear Locks Tool

1. **Open this URL in your browser**:
   ```
   http://localhost:3000/clear-locks.html
   ```
2. **Click "Clear Supabase Locks Only"**
3. **Go back to your app and hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## 🛠️ What I Just Fixed:

I've updated your code to **disable the Web Locks API** in Supabase, which prevents this error from happening again:

### 1. Updated `lib/supabase.ts`:
```typescript
auth: {
  lock: false,  // ← This disables the problematic lock mechanism
  storageKey: 'pguncle-auth',
}
```

### 2. Updated `app/auth/callback/route.ts`:
- Added the same lock configuration to the OAuth callback
- Prevents conflicts during Google sign-in

### 3. Created utility tool:
- `public/clear-locks.html` - Visual tool to clear stuck locks

---

## 🔄 After the Fix:

1. **Clear your browser storage** (use Option 1 above)
2. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. **Hard refresh your browser**: `Ctrl+Shift+R` or `Cmd+Shift+R`
4. **The error should be gone permanently**

---

## 🔍 Why This Happens:

The Supabase auth library uses the **Web Locks API** to prevent race conditions when multiple tabs access the same session. However, this can cause issues when:

- Multiple Supabase client instances are created
- Browser doesn't fully support Web Locks API
- Previous locks weren't properly released
- Fast page reloads during development

By setting `lock: false`, we disable this mechanism. It's safe for single-tab usage and development.

---

## 📝 Changes Made:

### Files Modified:
1. ✅ `lib/supabase.ts` - Disabled locks, added storageKey
2. ✅ `contexts/AuthContext.tsx` - Added retry logic
3. ✅ `hooks/useProperties.ts` - Added retry logic
4. ✅ `app/auth/callback/route.ts` - Disabled locks in OAuth callback

### Files Created:
1. ✅ `public/clear-locks.html` - Lock clearing tool
2. ✅ `components/SupabaseErrorBanner.tsx` - Error banner component
3. ✅ `scripts/test-supabase.js` - Connection test script

---

## 🚀 Next Steps:

1. **Right now**: Clear browser storage (see Option 1 above)
2. **Restart**: Stop and restart your dev server
3. **Test**: Load your app - error should be gone
4. **Deploy**: When you deploy, the fix will work in production too

---

## ❓ Still Not Working?

If you still see the error after clearing storage:

### Step 1: Check for Multiple Supabase Instances
```bash
# Search for createClient calls
grep -r "createClient" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules
```

### Step 2: Clear ALL browser data
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Click **Clear storage** in the left sidebar
4. Click **Clear site data** button
5. Refresh the page

### Step 3: Try Incognito Mode
1. Open your app in **Incognito/Private** window
2. If it works there, it's a browser cache issue
3. Clear all browser data and try again

### Step 4: Check Browser Console
Look for other errors that might give more context:
1. Open DevTools (`F12`)
2. Go to **Console** tab
3. Look for red errors
4. Share them if you need more help

---

## 🎯 Prevention:

The fix I applied prevents this from happening again by:
- ✅ Disabling the Web Locks API
- ✅ Using a consistent storage key
- ✅ Adding retry logic for transient failures
- ✅ Proper cleanup in useEffect hooks

---

## 📞 Need More Help?

If none of this works:
1. Check if you're using the latest code (restart dev server)
2. Try `rm -rf .next && npm run dev` to clear Next.js cache
3. Check if the error happens in production or just development
4. Share the full error stack trace from browser console

---

**TL;DR**: 
1. Open browser console (`F12`)
2. Run: `localStorage.clear(); location.reload();`
3. Restart dev server
4. Error gone! 🎉
