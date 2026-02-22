# Image Upload Setup Guide

## Overview
This guide explains how to set up Supabase Storage for property image uploads and how the new file upload system works.

## What Changed

### Before:
- Admin had to paste image URLs manually
- Images hosted externally
- No control over image storage

### After:
- Admin uploads image files directly
- Images stored in Supabase Storage
- Automatic URL generation
- Image preview before upload
- File validation (type and size)

## Setup Steps

### Step 1: Create Storage Bucket in Supabase

#### Option A: Using SQL (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `SUPABASE_STORAGE_SETUP.sql`
3. Paste and run the SQL
4. Verify bucket was created

#### Option B: Using Dashboard (Manual)
1. Go to Supabase Dashboard
2. Click "Storage" in left sidebar
3. Click "New Bucket"
4. Enter details:
   - **Name**: `property-images`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: image/jpeg, image/png, image/webp (optional)
5. Click "Create bucket"

### Step 2: Set Up Storage Policies

The SQL script creates these policies automatically:

1. **Public Read Access** - Anyone can view images
2. **Authenticated Upload** - Logged-in users can upload
3. **Authenticated Update** - Logged-in users can update
4. **Authenticated Delete** - Logged-in users can delete

If you created the bucket manually, you need to add these policies:

#### Policy 1: Public Read
```sql
CREATE POLICY "Public Access for Property Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');
```

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

### Step 3: Verify Setup

1. Go to Storage → property-images bucket
2. Try uploading a test image
3. Check if image is publicly accessible
4. Delete the test image

## How It Works

### File Upload Flow

1. **Admin selects images** → File input in PropertyForm
2. **Client-side validation** → Check file type and size
3. **Preview generation** → Show thumbnails using blob URLs
4. **Form submission** → Upload files to Supabase Storage
5. **URL generation** → Get public URLs from Supabase
6. **Save to database** → Store URLs in properties table

### File Validation

- **Allowed types**: JPEG, JPG, PNG, WebP
- **Max size**: 5MB per file
- **Multiple uploads**: Yes, unlimited
- **Preview**: Yes, before upload

### Image Storage Structure

```
property-images/
├── properties/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── 1234567892-ghi789.webp
└── rooms/
    ├── 1234567893-jkl012.jpg
    └── 1234567894-mno345.png
```

## Features

### ✅ File Upload
- Drag and drop support (via file input)
- Multiple file selection
- Instant preview
- Progress indication

### ✅ Validation
- File type checking (JPEG, PNG, WebP only)
- File size limit (5MB max)
- User-friendly error messages

### ✅ Image Management
- Preview before upload
- Remove images before submitting
- First image marked as "Main Image"
- Existing images preserved when editing

### ✅ Storage Management
- Automatic unique filenames
- Organized folder structure
- Public URL generation
- Delete functionality (for cleanup)

## Usage in Admin Panel

### Adding New Property

1. Click "Add New Property"
2. Fill in property details
3. Click "Add Images" button
4. Select one or more image files
5. Preview appears immediately
6. Click "Save Property"
7. Images upload automatically
8. Property saved with image URLs

### Editing Existing Property

1. Click "Edit" on a property
2. Existing images show as previews
3. Click "Add Images" to add more
4. Click X on any image to remove
5. Click "Save Property"
6. New images upload, URLs update

## API Functions

### Upload Single Image
```typescript
import { uploadImage } from '@/lib/imageUpload';

const url = await uploadImage(file, 'properties');
```

### Upload Multiple Images
```typescript
import { uploadMultipleImages } from '@/lib/imageUpload';

const urls = await uploadMultipleImages(files, 'properties');
```

### Delete Image
```typescript
import { deleteImage } from '@/lib/imageUpload';

await deleteImage(imageUrl);
```

### Delete Multiple Images
```typescript
import { deleteMultipleImages } from '@/lib/imageUpload';

await deleteMultipleImages(imageUrls);
```

## Troubleshooting

### Issue: "Upload failed: new row violates row-level security policy"
**Solution**: Make sure storage policies are set up correctly. Run the SQL script again.

### Issue: "Invalid file type"
**Solution**: Only JPEG, PNG, and WebP are allowed. Convert your image or use a different file.

### Issue: "File size too large"
**Solution**: Compress your image or use a smaller file. Maximum is 5MB.

### Issue: Images not showing after upload
**Solution**: 
1. Check if bucket is set to "Public"
2. Verify public read policy exists
3. Check browser console for errors

### Issue: "Bucket not found"
**Solution**: Create the bucket using the SQL script or manually in dashboard.

## Security Considerations

### ✅ Safe
- File type validation
- File size limits
- Authenticated uploads only
- Public read access (for displaying images)

### ⚠️ Consider
- Add virus scanning for production
- Implement rate limiting
- Add image optimization/compression
- Set up CDN for better performance

## Performance Tips

1. **Compress images before upload** - Use tools like TinyPNG
2. **Use WebP format** - Better compression than JPEG/PNG
3. **Limit image dimensions** - Resize to max 1920x1080
4. **Enable CDN** - Supabase has built-in CDN support

## Cost Considerations

Supabase Storage pricing (as of 2024):
- **Free tier**: 1GB storage, 2GB bandwidth
- **Pro tier**: 100GB storage, 200GB bandwidth
- **Additional**: $0.021/GB storage, $0.09/GB bandwidth

Estimate:
- Average image: 500KB
- 1000 images: ~500MB storage
- Well within free tier limits

## Next Steps

After setup:
1. ✅ Test image upload in admin panel
2. ✅ Verify images display on property pages
3. ✅ Check mobile upload works
4. ✅ Test with different image formats
5. ✅ Monitor storage usage

## Support

If you encounter issues:
1. Check Supabase Storage logs
2. Verify bucket permissions
3. Test with a small image first
4. Check browser console for errors

---

**Your image upload system is now ready!** 📸
