# Supabase Storage Setup Guide

## Issue: Bucket Not Found Error

If you're seeing "Bucket not found" errors when uploading images, you need to create the storage bucket in Supabase.

## Steps to Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open Storage Section**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create the Bucket**
   - Bucket name: `property-images`
   - Make it **Public** (check the "Public bucket" option)
   - Click "Create bucket"

4. **Set Bucket Policies (Important!)**
   - Click on the `property-images` bucket
   - Go to "Policies" tab
   - Add the following policies:

### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'property-images' );
```

### Policy 3: Allow Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'property-images' );
```

## Alternative: Allow Anonymous Upload (Less Secure)

If you want to allow uploads without authentication (not recommended for production):

```sql
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'property-images' );
```

## Verify Setup

1. Try uploading an image through the admin panel
2. Check the browser console for any errors
3. Verify the image URL is accessible

## Troubleshooting

- **Still getting errors?** Check that your Supabase environment variables are set correctly in `.env.local`
- **Images not loading?** Ensure the bucket is set to "Public"
- **Upload fails silently?** Check the browser console and Supabase logs
