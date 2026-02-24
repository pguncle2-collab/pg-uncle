// Firebase Storage image upload utilities
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a single image to Firebase Storage
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
    
    // Create storage reference
    const storageRef = ref(storage, storagePath);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log(`✅ Image uploaded successfully: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Return placeholder on error
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80';
  }
}

/**
 * Upload multiple images to Firebase Storage
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
 * Delete an image from Firebase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Only delete if it's a Firebase Storage URL
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      console.log('Not a Firebase Storage URL, skipping deletion');
      return;
    }
    
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      console.warn('Could not extract path from URL');
      return;
    }
    
    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);
    
    await deleteObject(storageRef);
    console.log(`✅ Image deleted: ${path}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - deletion failure shouldn't break the app
  }
}

/**
 * Delete multiple images from Firebase Storage
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
