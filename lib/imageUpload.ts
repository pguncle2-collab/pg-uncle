// Image upload utilities - uses /api/upload server route for Supabase storage uploads
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
      // Use WebP for PNGs to keep transparency but compress well; otherwise JPEG.
      const isPng = file.type === 'image/png';
      const outType = isPng ? 'image/webp' : 'image/jpeg';
      const extension = isPng ? '.webp' : '';
      const outName = isPng ? file.name.replace(/\.[^/.]+$/, "") + extension : file.name;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], outName, {
              type: blob.type || outType,
              lastModified: Date.now(),
            }));
          } else {
            resolve(file); // Fallback
          }
        },
        outType,
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
 * Upload a single image to Supabase Storage via the server API
 * Uses the server-side route to bypass RLS restrictions with the service role key
 */
export async function uploadImage(
  file: File,
  folder: string = 'properties'
): Promise<string> {
  try {
    // Compress image natively first
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
      console.log(`Compressed image: ${fileToUpload.name} (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (compressionError) {
      console.error('Error compressing image, falling back to original:', compressionError);
    }

    // Upload via server API route that uses service role key
    const MAX_SIZE_MB = 4.5;
    if (fileToUpload.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Image ${file.name} is too large (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB) even after compression. Maximum allowed size is ${MAX_SIZE_MB}MB due to server limits.`);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      let errorMessage = '';
      try {
        const errJson = JSON.parse(errorText);
        errorMessage = errJson.error || errJson.message;
      } catch (e) {
        errorMessage = errorText;
      }
      
      // If error message is empty or generic, include status
      const finalError = errorMessage && errorMessage !== 'Internal Server Error' 
        ? errorMessage 
        : `Upload failed with status ${response.status}: ${errorText.substring(0, 500)}`;
        
      throw new Error(finalError);
    }

    const { url } = await response.json();
    console.log(`✅ Image uploaded successfully: ${url}`);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
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
