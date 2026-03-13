-- ============================================
-- Supabase Storage Bucket Setup Script (Simple Version)
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor
-- Use this for FIRST TIME setup (no existing policies)

-- Step 1: Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'properties',
  'properties',
  true,
  52428800, -- 50 MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create policies for the bucket

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

-- ============================================
-- Verification Queries
-- ============================================

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'properties';

-- Check if policies were created
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
