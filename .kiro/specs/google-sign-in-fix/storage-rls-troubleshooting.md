# Storage RLS Policy Troubleshooting Guide

## Error: "new row violates row-level security policy"

This error occurs when Row Level Security (RLS) policies on the storage.objects table don't allow the upload operation.

## Quick Fix Steps

### Step 1: Run the Fix Script

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `.kiro/specs/google-sign-in-fix/fix-storage-rls.sql`
3. Paste and click **"Run"**
4. This will:
   - Drop any existing conflicting policies
   - Recreate the bucket with correct settings
   - Create 4 new permissive policies

### Step 2: Verify User is Authenticated

Before uploading, make sure you're logged in:

1. Open browser console (F12)
2. Check for: `User authenticated, proceeding with upload...`
3. If you see "You must be logged in", sign in first

### Step 3: Test Upload

1. Try uploading an image
2. Check console for success message:
   ```
   ✅ Image uploaded successfully: https://...
   ```

## Manual Verification Steps

### Check 1: Verify Bucket Exists and is Public

```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'properties';
```

**Expected Result**:
- id: `properties`
- name: `properties`
- public: `true`
- file_size_limit: `52428800`

**If bucket doesn't exist or public = false**:
```sql
-- Create or update bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'properties',
  'properties',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;
```

### Check 2: Verify RLS is Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

**Expected Result**:
- rowsecurity: `true`

**This should already be true by default. Don't disable it!**

### Check 3: Verify Policies Exist

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
```

**Expected Result**: 4 policies for the properties bucket:
1. `Allow authenticated deletes` - DELETE - {authenticated}
2. `Allow authenticated updates` - UPDATE - {authenticated}
3. `Allow authenticated uploads` - INSERT - {authenticated}
4. `Allow public read access` - SELECT - {public}

**If policies are missing**, run the fix script from Step 1.

### Check 4: Test Policy Manually

```sql
-- Test if authenticated users can insert
SELECT 
  bucket_id,
  (bucket_id = 'properties') as can_upload
FROM storage.objects
WHERE bucket_id = 'properties'
LIMIT 1;
```

## Common Issues and Solutions

### Issue 1: "Unauthorized" Error

**Cause**: User is not authenticated or session expired

**Solution**:
1. Sign out completely
2. Clear browser cache and cookies
3. Sign in again
4. Try upload again

**Verify authentication**:
```javascript
// In browser console
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Issue 2: Policies Not Working

**Cause**: Policies might have incorrect syntax or conditions

**Solution**: Drop and recreate policies using the fix script

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Then run the fix script to recreate them
```

### Issue 3: Bucket Not Public

**Cause**: Bucket's public flag is set to false

**Solution**:
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'properties';
```

### Issue 4: Wrong Bucket Name

**Cause**: Code is trying to upload to wrong bucket

**Check**: In `lib/imageUpload.ts`, verify:
```typescript
.from('properties') // Must match bucket name exactly
```

### Issue 5: CORS Issues

**Cause**: Supabase CORS not configured for your domain

**Solution**:
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Scroll to **CORS Configuration**
3. Add your domains:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
   - `https://*.vercel.app` (Vercel previews)

## Testing Checklist

After applying fixes, test these scenarios:

### Test 1: Upload While Logged In
- [ ] Log in to the app
- [ ] Try to upload an image
- [ ] Should succeed with success message
- [ ] Image should be visible in the app

### Test 2: Upload While Logged Out
- [ ] Log out of the app
- [ ] Try to upload an image
- [ ] Should fail with "You must be logged in" error
- [ ] This is expected behavior

### Test 3: View Images While Logged Out
- [ ] Log out of the app
- [ ] Navigate to a page with images
- [ ] Images should still be visible
- [ ] Public read access is working

### Test 4: Delete Image While Logged In
- [ ] Log in to the app
- [ ] Try to delete an uploaded image
- [ ] Should succeed
- [ ] Image should be removed from storage

## Advanced Debugging

### Enable Detailed Logging

Add this to your upload function:

```typescript
console.log('Session:', await supabase.auth.getSession());
console.log('Upload path:', storagePath);
console.log('Bucket:', 'properties');
console.log('File type:', file.type);
console.log('File size:', file.size);
```

### Check Storage Logs

1. Go to **Supabase Dashboard** → **Storage** → **Logs**
2. Look for failed upload attempts
3. Check error messages

### Check Auth Logs

1. Go to **Supabase Dashboard** → **Authentication** → **Logs**
2. Verify user is authenticated
3. Check for session expiration

### Network Tab Analysis

1. Open browser DevTools → Network tab
2. Try to upload an image
3. Look for POST request to `/storage/v1/object/properties/...`
4. Check request headers:
   - `Authorization: Bearer <token>` should be present
   - Token should not be expired
5. Check response:
   - 200 = Success
   - 400 = Bad request (bucket not found)
   - 401 = Unauthorized (not authenticated)
   - 403 = Forbidden (RLS policy violation)

## Policy Syntax Reference

### Basic Policy Structure

```sql
CREATE POLICY "policy_name"
ON storage.objects
FOR <operation>  -- SELECT, INSERT, UPDATE, DELETE, ALL
TO <role>        -- public, authenticated, anon
USING (<condition>)      -- For SELECT, UPDATE, DELETE
WITH CHECK (<condition>) -- For INSERT, UPDATE
```

### Example Policies

**Allow anyone to read**:
```sql
CREATE POLICY "Public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');
```

**Allow authenticated users to upload**:
```sql
CREATE POLICY "Auth upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');
```

**Allow users to upload to their own folder**:
```sql
CREATE POLICY "User folder upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Production Checklist

Before deploying to production:

- [ ] Bucket "properties" exists
- [ ] Bucket is marked as public
- [ ] 4 policies are created and enabled
- [ ] File size limit is set (50 MB)
- [ ] MIME types are restricted to images
- [ ] CORS is configured for production domain
- [ ] Upload works when logged in
- [ ] Upload fails when logged out (expected)
- [ ] Images are publicly viewable
- [ ] Delete works when logged in

## Getting Help

If issues persist:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Dashboard → Storage → Logs
3. **Check Documentation**: https://supabase.com/docs/guides/storage
4. **Community Support**: https://github.com/supabase/supabase/discussions

## Summary

The "row-level security policy" error is fixed by:

1. ✅ Creating the "properties" bucket with public access
2. ✅ Creating 4 permissive policies (SELECT, INSERT, UPDATE, DELETE)
3. ✅ Ensuring user is authenticated before upload
4. ✅ Verifying policies are enabled and working

Run the fix script, verify authentication, and test uploads to confirm everything works.
