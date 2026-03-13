-- ============================================
-- Fix Storage RLS Policy Issues
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop existing policies (if any) to start fresh
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Delete" ON storage.objects;

-- Step 2: Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'properties',
  'properties',
  true,
  52428800, -- 50 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- Step 3: Create permissive policies for the properties bucket

-- Allow anyone to read/view images (public access)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');

-- Allow authenticated users to insert/upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'properties')
WITH CHECK (bucket_id = 'properties');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'properties');

-- Step 4: Verify RLS is enabled (it should be by default)
-- This just checks, doesn't change anything
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Step 5: Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%Allow%'
ORDER BY policyname;

-- ============================================
-- Expected Results
-- ============================================
-- Step 4 should show: rowsecurity = true
-- Step 5 should show 4 policies:
-- 1. Allow authenticated deletes (DELETE, {authenticated})
-- 2. Allow authenticated updates (UPDATE, {authenticated})
-- 3. Allow authenticated uploads (INSERT, {authenticated})
-- 4. Allow public read access (SELECT, {public})
