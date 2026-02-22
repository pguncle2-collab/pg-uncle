-- Supabase Storage Setup for Property Images
-- Run this in Supabase SQL Editor

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for property images bucket

-- Policy 1: Allow public read access (anyone can view images)
CREATE POLICY "Public Access for Property Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'property-images';

-- Note: After running this, you can also create the bucket manually:
-- 1. Go to Supabase Dashboard
-- 2. Click "Storage" in the left sidebar
-- 3. Click "New Bucket"
-- 4. Name: property-images
-- 5. Check "Public bucket" (so images are publicly accessible)
-- 6. Click "Create bucket"
