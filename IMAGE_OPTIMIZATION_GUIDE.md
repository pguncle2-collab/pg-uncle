# Image Optimization Guide

## Current Issue
- 1 GB storage limit on free tier
- Images can be 500 KB - 2 MB each
- Need to optimize to fit more properties

## Solution: Compress Images Before Upload

### Recommended Image Sizes

```javascript
// Property main image
- Max width: 1200px
- Max height: 800px
- Format: WebP or JPEG
- Quality: 80%
- Target size: 100-200 KB

// Property gallery images
- Max width: 1200px
- Max height: 800px
- Format: WebP or JPEG
- Quality: 75%
- Target size: 80-150 KB

// Thumbnails
- Max width: 400px
- Max height: 300px
- Format: WebP or JPEG
- Quality: 70%
- Target size: 20-40 KB
```

### Tools to Compress Images

#### Online Tools (Free)
1. **TinyPNG** - https://tinypng.com
   - Drag and drop images
   - Compresses 50-80%
   - Maintains quality

2. **Squoosh** - https://squoosh.app
   - Google's tool
   - Convert to WebP
   - Adjust quality slider

3. **ImageOptim** (Mac) - https://imageoptim.com
   - Desktop app
   - Batch processing
   - Lossless compression

#### Automatic Compression (Add to Your App)

Install package:
```bash
npm install sharp
```

Add to your image upload code:
```javascript
import sharp from 'sharp';

async function compressImage(file: File) {
  const buffer = await file.arrayBuffer();
  
  const compressed = await sharp(Buffer.from(buffer))
    .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  
  return compressed;
}
```

### Storage Calculation

With optimization:
- 20 properties × 10 images = 200 images
- 200 images × 100 KB = 20 MB
- **Can fit 500+ properties in 1 GB!**

Without optimization:
- 200 images × 500 KB = 100 MB
- **Can only fit 100 properties in 1 GB**

### Best Practices

1. **Always compress before upload**
2. **Use WebP format** (50% smaller than JPEG)
3. **Resize to max 1200px width**
4. **Delete old images** when updating properties
5. **Run orphaned image cleanup** weekly

### Quick Wins

1. Compress existing images:
   - Download all from Supabase
   - Run through TinyPNG
   - Re-upload compressed versions
   - Can save 50-70% storage!

2. Set up automatic compression:
   - Add sharp to your upload flow
   - Compress on client or server
   - Users upload any size, you store optimized

### Monitoring Storage

Check storage usage:
```sql
-- In Supabase SQL Editor
SELECT 
  pg_size_pretty(sum(size)) as total_size,
  count(*) as file_count
FROM storage.objects
WHERE bucket_id = 'property-images';
```

Or use the maintenance page: `/admin/maintenance`
