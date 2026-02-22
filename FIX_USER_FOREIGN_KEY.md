# 🔧 Fix User Foreign Key Error - SOLVED

## ❌ The Error

```
insert or update on table "bookings" violates foreign key constraint "bookings_user_id_fkey"
```

## 🎯 The Problem

When you sign in with Google OAuth, a user is created in Supabase Auth, but NOT in the `users` table. The booking system tries to reference a user_id that doesn't exist in the users table, causing a foreign key violation.

## ✅ The Solution - ALREADY FIXED!

I've updated the code to automatically create user records for OAuth users. The fix includes:

1. **OAuth Callback Route** - Creates user record after Google sign-in
2. **Auth Context** - Ensures user record exists on every session check
3. **Automatic Creation** - Works for both new and existing OAuth users

---

## 🚀 How to Apply the Fix

### Option 1: Pull Latest Code (Recommended)

```bash
git pull origin main
npm run dev
```

### Option 2: Manual Fix (If needed)

If you haven't pulled the latest code, you need to:

1. **Sign out** from your current session
2. **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)
3. **Sign in again** with Google
4. User record will be created automatically
5. **Try booking again** - it will work!

---

## 🔍 What the Fix Does

### 1. OAuth Callback Enhancement
When you sign in with Google:
- ✅ Supabase Auth creates auth user
- ✅ Callback checks if user exists in `users` table
- ✅ If not, creates user record with Google data
- ✅ Uses name from Google profile
- ✅ Sets role to 'user'

### 2. Auth Context Enhancement
On every page load:
- ✅ Checks if user is authenticated
- ✅ Verifies user record exists in `users` table
- ✅ Creates record if missing
- ✅ Works for both OAuth and email/password users

---

## 🧪 Test the Fix

1. **Sign out** if currently logged in
2. **Sign in with Google**
3. Check browser console - should see: "User record created successfully"
4. **Try booking a room**
5. **Success!** ✅

---

## 🔍 Verify User Record

Check if your user exists in the database:

1. Go to Supabase Dashboard
2. Click **Table Editor** → **users**
3. Look for your email
4. Should see your user record with:
   - id (matches auth.users id)
   - email
   - full_name (from Google)
   - role: 'user'

---

## 📊 What Gets Created

When you sign in with Google, this record is created:

```sql
INSERT INTO users (id, email, full_name, phone, role)
VALUES (
  'auth-user-id',           -- From Supabase Auth
  'your-email@gmail.com',   -- From Google
  'Your Name',              -- From Google profile
  NULL,                     -- Phone (optional)
  'user'                    -- Default role
);
```

---

## 🐛 Troubleshooting

### Issue: Still getting foreign key error
**Solution**: 
1. Sign out completely
2. Clear browser cache
3. Sign in again with Google
4. Check console for "User record created successfully"

### Issue: "User record created successfully" but still fails
**Solution**:
1. Check Supabase Table Editor → users
2. Verify your user ID matches auth.users ID
3. Run this SQL to check:
```sql
SELECT auth.users.id, users.id 
FROM auth.users 
LEFT JOIN users ON auth.users.id = users.id 
WHERE auth.users.email = 'your-email@gmail.com';
```

### Issue: Multiple user records
**Solution**:
This shouldn't happen, but if it does:
```sql
-- Delete duplicate users (keep the one matching auth)
DELETE FROM users 
WHERE id NOT IN (SELECT id FROM auth.users);
```

---

## ✅ Success Indicators

After the fix:
- [ ] Sign in with Google works
- [ ] Console shows "User record created successfully"
- [ ] User appears in users table
- [ ] Booking form submits without errors
- [ ] Booking appears in bookings table

---

## 🎉 Benefits

This fix ensures:
- ✅ OAuth users can book rooms
- ✅ No manual database setup needed
- ✅ Works for all future OAuth users
- ✅ Backward compatible with email/password users
- ✅ Automatic user record creation

---

**Status**: 🟢 **FIXED IN CODE**  
**Action Required**: Pull latest code and sign in again  
**Time to Fix**: 1 minute

The booking system will now work perfectly for all users!
