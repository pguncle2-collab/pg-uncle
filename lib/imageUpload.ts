import { createClient } from './supabase-client';

/**
 * Compress an image file using native HTML Canvas
 * This has zero external dependencies and runs completely locally.
 */
async function compressImage(file: File): Promise<File> {
  // Only compress if we're in the browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }
  
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const URL = window.URL || window.webkitURL;
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(imgUrl);
      
      let width = img.width;
      let height = img.height;
      const maxSize = 1920;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file); // Fallback to original
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob and then to File
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
              lastModified: Date.now(),
            }));
          } else {
            resolve(file); // Fallback
          }
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.8 // 80% quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imgUrl);
      resolve(file); // Fallback on load failure
    };
    
    img.src = imgUrl;
  });
}

/**
 * Validate that a URL is accessible and returns a valid image
 */
async function validateImageUrl(url: string): Promise<void> {
  // First, validate URL format
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL format: ${url}`);
  }
  
  // Check if it's a valid URL pattern (not just "not-a-valid-url")
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error(`Invalid URL protocol: ${url}`);
  }
  
  // Skip network validation in test environment
  if (process.env.NODE_ENV === 'test' || typeof fetch === 'undefined') {
    console.warn('Skipping network URL validation in test environment');
    return;
  }
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Image URL validation failed: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`URL does not return a valid image (content-type: ${contentType})`);
    }
  } catch (error) {
    throw new Error(`Failed to validate image URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = 'properties'
): Promise<string> {
  try {
    console.log(`Original image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    // Compress image natively
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
      console.log(`Compressed image: ${fileToUpload.name} (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (compressionError) {
      console.error('Error compressing image, falling back to original:', compressionError);
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${folder}/${filename}`;
    
    const supabase = createClient();

    // Upload file
    const { data, error } = await supabase.storage
      .from('properties') // Assume bucket name is 'properties'
      .upload(storagePath, fileToUpload, { upsert: false });
      
    if (error) {
      throw error;
    }
    
    // Get download URL
    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(storagePath);
    
    // Skip URL validation for performance - Supabase URLs are reliable
    // The validateImageUrl function was causing significant delays
    console.log(`✅ Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Let error propagate to caller
    throw error;
  }
}

/**
 * Upload multiple images to Supabase Storage with progress tracking
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'properties'
): Promise<string[]> {
  try {
    console.log(`📤 Starting upload of ${files.length} images...`);
    const startTime = Date.now();
    
    // Upload all images in parallel for better performance
    const uploadPromises = files.map((file, index) => {
      return uploadImage(file, folder).then(url => {
        console.log(`✅ Image ${index + 1}/${files.length} uploaded: ${file.name}`);
        return url;
      });
    });
    
    const results = await Promise.all(uploadPromises);
    
    const duration = Date.now() - startTime;
    console.log(`🎉 Successfully uploaded ${results.length} images in ${duration}ms`);
    return results;
  } catch (error) {
    console.error('❌ Error uploading multiple images:', error);
    // Let error propagate to caller
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Only delete if it's a Supabase Storage URL
    if (!imageUrl.includes('supabase.co/storage')) {
      console.log('Not a Supabase Storage URL, skipping deletion');
      return;
    }
    
    // Extract path from URL
    const url = new URL(imageUrl);
    // Format: /storage/v1/object/public/bucketName/path/to/file
    const parts = url.pathname.split('/');
    const publicIndex = parts.indexOf('public');
    
    if (publicIndex === -1 || parts.length <= publicIndex + 2) {
      console.warn('Could not extract path from URL');
      return;
    }
    
    // parts[publicIndex + 1] is bucketName
    const storagePath = parts.slice(publicIndex + 2).join('/');
    
    const supabase = createClient();
    const { error } = await supabase.storage.from('properties').remove([storagePath]);
    if (error) throw error;
    
    console.log(`✅ Image deleted: ${storagePath}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - deletion failure shouldn't break the app
  }
}

/**
 * Delete multiple images from Supabase Storage
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<void> {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${imageUrls.length} images`);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
  }
}
