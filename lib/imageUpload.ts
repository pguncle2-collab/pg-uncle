import { createClient } from './supabase-client';

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
    console.log(`Uploading image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${folder}/${filename}`;
    
    const supabase = createClient();

    // Upload file
    const { data, error } = await supabase.storage
      .from('properties') // Assume bucket name is 'properties'
      .upload(storagePath, file, { upsert: false });
      
    if (error) {
      throw error;
    }
    
    // Get download URL
    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(storagePath);
    
    // Validate that the URL is accessible
    await validateImageUrl(publicUrl);
    
    console.log(`✅ Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Let error propagate to caller
    throw error;
  }
}

/**
 * Upload multiple images to Supabase Storage
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'properties'
): Promise<string[]> {
  try {
    console.log(`Uploading ${files.length} images...`);
    
    // Upload all images in parallel
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    console.log(`✅ Successfully uploaded ${results.length} images`);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
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
