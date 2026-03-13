# Supabase Storage Bucket Setup Guide

## Issue: "Bucket not found" Error

**Error Message**:
```
POST https://ijwbczqupzocgvuylanr.supabase.co/storage/v1/object/properties/... 400 (Bad Request)
Error uploading image: StorageApiError: Bucket not found
```

**Root Cause**: The Supabase Storage bucket named "properties" doesn't exist in your Supabase project.

## Solution: Create the Storage Bucket

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** in the left sidebar

### Step 2: Create the "properties" Bucket

1. Click **"New bucket"** button
2. Fill in the bucket details:
   - **Name**: `properties`
   - **Public bucket**: ✅ **Enable** (check this box)
   - **File size limit**: 50 MB (recommended)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/png, image/webp, image/gif`

3. Click **"Create bucket"**

### Step 3: Configure Bucket Policies (Important!)

After creating the bucket, you need to set up policies to allow uploads:

1. Click on the **"properties"** bucket
2. Go to **"Policies"** tab
3. Click **"New policy"**

#### Policy 1: Allow Public Read Access

```sql
-- Policy Name: Public Read Access
-- Allowed operation: SELECT

CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');
```

**Or use the UI**:
- Policy name: `Public Read Access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'properties'`

#### Policy 2: Allow Authenticated Users to Upload

```sql
-- Policy Name: Authenticated Users Can Upload
-- Allowed operation: INSERT

CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');
```

**Or use the UI**:
- Policy name: `Authenticated Users Can Upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'properties'`

#### Policy 3: Allow Authenticated Users to Update

```sql
-- Policy Name: Authenticated Users Can Update
-- Allowed operation: UPDATE

CREATE POLICY "Authenticated Users Can Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'properties')
WITH CHECK (bucket_id = 'properties');
```

**Or use the UI**:
- Policy name: `Authenticated Users Can Update`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'properties'`
- WITH CHECK expression: `bucket_id = 'properties'`

#### Policy 4: Allow Authenticated Users to Delete

```sql
-- Policy Name: Authenticated Users Can Delete
-- Allowed operation: DELETE

CREATE POLICY "Authenticated Users Can Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'properties');
```

**Or use the UI**:
- Policy name: `Authenticated Users Can Delete`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'properties'`

### Step 4: Verify Bucket Configuration

1. Go back to **Storage** → **properties** bucket
2. You should see:
   - ✅ Public bucket enabled
   - ✅ 4 policies created (SELECT, INSERT, UPDATE, DELETE)

### Step 5: Test Upload

1. Try uploading an image through your app
2. Check browser console for success message:
   ```
   ✅ Image uploaded successfully: https://...supabase.co/storage/v1/object/public/properties/...
   ```

## Alternative: Use SQL Editor

If you prefer to set up everything via SQL:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL script:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'properties',
  'properties',
  true,
  52428800, -- 50 MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Public Read Access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');

-- Policy 2: Authenticated Users Can Upload
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- Policy 3: Authenticated Users Can Update
CREATE POLICY "Authenticated Users Can Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'properties')
WITH CHECK (bucket_id = 'properties');

-- Policy 4: Authenticated Users Can Delete
CREATE POLICY "Authenticated Users Can Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'properties');
```

3. Click **"Run"**

## Folder Structure

The app will create this folder structure in the bucket:

```
properties/
├── properties/          # Property main images
│   └── 1234567890_image.jpg
├── rooms/              # Room images
│   └── 1234567891_room.jpg
└── amenities/          # Amenity images
    └── 1234567892_amenity.jpg
```

## Security Considerations

### Current Setup (Recommended for MVP)
- ✅ Public read access (anyone can view images)
- ✅ Authenticated users can upload/update/delete
- ✅ File size limit: 50 MB
- ✅ MIME type restrictions: images only

### Production Hardening (Optional)

For production, consider these additional security measures:

#### 1. User-Specific Upload Restrictions

Only allow users to upload to their own folders:

```sql
-- Replace the INSERT policy with this:
CREATE POLICY "Users Can Upload to Own Folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 2. Admin-Only Delete

Only allow admins to delete images:

```sql
-- Replace the DELETE policy with this:
CREATE POLICY "Admins Can Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'properties' AND
  auth.jwt() ->> 'role' = 'admin'
);
```

#### 3. File Size Validation

Add client-side validation in `lib/imageUpload.ts`:

```typescript
export async function uploadImage(file: File, folder: string = 'properties'): Promise<string> {
  // Validate file size (50 MB max)
  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds 50 MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  }

  // Validate file type
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }

  // ... rest of upload code
}
```

## Troubleshooting

### Issue: "Bucket not found" still appears

**Check**:
1. Bucket name is exactly `properties` (case-sensitive)
2. Bucket is marked as public
3. Policies are created and enabled
4. You're using the correct Supabase project

**Fix**:
- Verify bucket exists: Storage → Check for "properties" bucket
- Recreate bucket if needed
- Check Supabase project URL matches your `.env.local`

### Issue: "Permission denied" error

**Check**:
1. User is authenticated (logged in)
2. INSERT policy exists for authenticated users
3. Policy is enabled (not disabled)

**Fix**:
- Check auth state: `console.log(supabase.auth.getUser())`
- Verify policies in Storage → properties → Policies tab
- Try logging out and back in

### Issue: Images upload but return 404

**Check**:
1. Bucket is marked as public
2. SELECT policy exists for public access
3. URL format is correct

**Fix**:
- Enable public access on bucket
- Add SELECT policy for public role
- Check URL format: `https://...supabase.co/storage/v1/object/public/properties/...`

### Issue: Upload works locally but fails in production

**Check**:
1. Production environment variables are set correctly
2. Supabase project is the same in production
3. CORS is configured in Supabase

**Fix**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` in production env vars
- Check Supabase Dashboard → Settings → API → CORS
- Add your production domain to allowed origins

## Testing Checklist

After setup, test these scenarios:

- [ ] Upload a single image (logged in)
- [ ] Upload multiple images (logged in)
- [ ] View uploaded images (logged out)
- [ ] Delete an image (logged in)
- [ ] Upload fails when not logged in (expected)
- [ ] Upload fails for files > 50 MB (expected)
- [ ] Upload fails for non-image files (expected)

## Monitoring

### Check Storage Usage

1. Go to Supabase Dashboard → Storage
2. View storage usage and limits
3. Monitor for unusual activity

### Free Tier Limits

- Storage: 1 GB
- Bandwidth: 2 GB/month
- File uploads: Unlimited

### Upgrade Considerations

If you exceed free tier limits:
- Pro Plan: $25/month (100 GB storage, 200 GB bandwidth)
- Pay-as-you-go for additional usage

## Summary

✅ **Create "properties" bucket** in Supabase Storage  
✅ **Enable public access** for viewing images  
✅ **Add 4 policies** for read/write/update/delete  
✅ **Set file size limit** to 50 MB  
✅ **Restrict MIME types** to images only  
✅ **Test upload flow** to verify everything works  

Once the bucket is created with proper policies, the "Bucket not found" error will be resolved and image uploads will work correctly.
