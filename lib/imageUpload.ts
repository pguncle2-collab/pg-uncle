import { supabase } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., 'properties', 'rooms')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: string = 'properties'
): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple images to Supabase Storage
 * @param files - Array of files to upload
 * @param folder - Optional folder path
 * @returns Array of public URLs
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'properties'
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/property-images/');
    if (pathParts.length < 2) {
      throw new Error('Invalid image URL');
    }
    const filePath = pathParts[1];

    // Delete from storage
    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Delete multiple images from Supabase Storage
 * @param imageUrls - Array of public URLs to delete
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<void> {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
}
