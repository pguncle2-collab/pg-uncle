-- ============================================
-- Supabase Storage Bucket Setup Script
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor
-- This will create the "properties" bucket and set up all necessary policies

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
-- Allows anyone to view images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Read Access'
  ) THEN
    CREATE POLICY "Public Read Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'properties');
  END IF;
END $$;

-- Policy 2: Authenticated Users Can Upload
-- Allows logged-in users to upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated Users Can Upload'
  ) THEN
    CREATE POLICY "Authenticated Users Can Upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'properties');
  END IF;
END $$;

-- Policy 3: Authenticated Users Can Update
-- Allows logged-in users to update/replace images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated Users Can Update'
  ) THEN
    CREATE POLICY "Authenticated Users Can Update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'properties')
    WITH CHECK (bucket_id = 'properties');
  END IF;
END $$;

-- Policy 4: Authenticated Users Can Delete
-- Allows logged-in users to delete images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated Users Can Delete'
  ) THEN
    CREATE POLICY "Authenticated Users Can Delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'properties');
  END IF;
END $$;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the setup

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'properties';

-- Check if policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%properties%';

-- ============================================
-- Expected Results
-- ============================================
-- Bucket query should return:
-- id: properties
-- name: properties
-- public: true
-- file_size_limit: 52428800
-- allowed_mime_types: {image/jpeg, image/png, image/webp, image/gif, image/jpg}

-- Policies query should return 4 rows:
-- 1. Public Read Access (SELECT, public)
-- 2. Authenticated Users Can Upload (INSERT, authenticated)
-- 3. Authenticated Users Can Update (UPDATE, authenticated)
-- 4. Authenticated Users Can Delete (DELETE, authenticated)
