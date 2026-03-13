import { createClient } from './supabase-client';

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = 'properties'
): Promise<string> {
  try {
    // Validate file size (50 MB max)
    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error(
        `File size exceeds 50 MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      );
    }

    // Validate file type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF`
      );
    }

    console.log(`Uploading image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to upload images. Please sign in and try again.');
    }
    
    console.log('User authenticated, proceeding with upload...');
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${folder}/${filename}`;
    
    console.log(`Upload path: ${storagePath}`);

    // Upload file
    const { data, error } = await supabase.storage
      .from('properties') // Bucket name is 'properties'
      .upload(storagePath, file, { 
        upsert: false,
        contentType: file.type 
      });
      
    if (error) {
      console.error('Upload error details:', error);
      
      // Provide helpful error messages
      if (error.message.includes('Bucket not found')) {
        throw new Error(
          'Storage bucket not configured. Please contact support or check the setup guide.'
        );
      }
      if (error.message.includes('not authenticated') || error.message.includes('Unauthorized')) {
        throw new Error('Authentication failed. Please sign out and sign in again.');
      }
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        throw new Error(
          'Storage permissions not configured correctly. Please contact support.'
        );
      }
      throw error;
    }
    
    // Get download URL
    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(storagePath);
    
    console.log(`✅ Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error; // Re-throw to let caller handle the error
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
    // Return placeholders on error
    return files.map(() => 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80');
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
