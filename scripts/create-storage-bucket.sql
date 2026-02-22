-- ============================================
-- Supabase Storage Setup for Property Images
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Step 1: Create the bucket (if using SQL Editor, you may need to create bucket via UI first)
-- Note: Bucket creation via SQL is limited. Create via Dashboard: Storage → New Bucket
-- Name: property-images
-- Public: Yes

-- Step 2: Add storage policies
-- Run these after creating the bucket

-- Policy 1: Allow public read access to all images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'property-images' );

-- Policy 3: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'property-images' );

-- Optional: Allow anyone to upload (less secure, not recommended for production)
-- Uncomment if you want to allow anonymous uploads
-- CREATE POLICY "Anyone can upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'property-images' );

-- ============================================
-- Verification Queries
-- ============================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'property-images';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%property-images%';

-- ============================================
-- Notes
-- ============================================
-- 1. Make sure the bucket is set to "Public" in the UI
-- 2. File size limit: 5MB (configure in bucket settings)
-- 3. Allowed types: JPEG, PNG, WebP
-- 4. After running, test upload in admin panel
