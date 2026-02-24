import { supabase } from './supabase';

/**
 * Extract file path from Supabase storage URL
 */
function extractPathFromUrl(imageUrl: string): string | null {
  try {
    // Handle cache-busted URLs (with ?t= parameter)
    const cleanUrl = imageUrl.split('?')[0];
    
    // Extract path from URL
    const url = new URL(cleanUrl);
    const pathParts = url.pathname.split('/property-images/');
    
    if (pathParts.length < 2) {
      console.warn('Invalid image URL format:', imageUrl);
      return null;
    }
    
    return pathParts[1];
  } catch (error) {
    console.error('Error extracting path from URL:', imageUrl, error);
    return null;
  }
}

/**
 * Delete a single image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Skip external URLs (unsplash, etc.)
    if (!imageUrl.includes('supabase')) {
      console.log('Skipping external image:', imageUrl);
      return true;
    }

    const filePath = extractPathFromUrl(imageUrl);
    if (!filePath) {
      return false;
    }

    console.log('Deleting image:', filePath);

    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    console.log('Successfully deleted image:', filePath);
    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Delete multiple images from Supabase Storage
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  const results = {
    success: 0,
    failed: 0,
    total: imageUrls.length
  };

  for (const url of imageUrls) {
    const deleted = await deleteImage(url);
    if (deleted) {
      results.success++;
    } else {
      results.failed++;
    }
  }

  return results;
}

/**
 * Delete all images associated with a property
 * Includes property images and room images
 */
export async function deletePropertyImages(property: {
  images?: string[];
  roomTypes?: Array<{ images?: string[] }>;
}): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  const allImages: string[] = [];

  // Collect property images
  if (property.images && Array.isArray(property.images)) {
    allImages.push(...property.images);
  }

  // Collect room images
  if (property.roomTypes && Array.isArray(property.roomTypes)) {
    property.roomTypes.forEach(room => {
      if (room.images && Array.isArray(room.images)) {
        allImages.push(...room.images);
      }
    });
  }

  // Filter out duplicates and empty strings
  const uniqueImages = [...new Set(allImages)].filter(url => url && url.trim() !== '');

  console.log(`Deleting ${uniqueImages.length} images for property`);

  if (uniqueImages.length === 0) {
    return { success: 0, failed: 0, total: 0 };
  }

  return await deleteMultipleImages(uniqueImages);
}

/**
 * List all files in the storage bucket
 */
export async function listAllStorageFiles(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from('property-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    // Recursively list files in subdirectories
    const allFiles: string[] = [];
    
    if (data) {
      for (const item of data) {
        if (item.name) {
          allFiles.push(item.name);
        }
      }

      // List files in 'properties' folder
      const { data: propertiesData } = await supabase.storage
        .from('property-images')
        .list('properties', { limit: 1000 });

      if (propertiesData) {
        propertiesData.forEach(item => {
          if (item.name) {
            allFiles.push(`properties/${item.name}`);
          }
        });
      }

      // List files in 'properties/rooms' folder
      const { data: roomsData } = await supabase.storage
        .from('property-images')
        .list('properties/rooms', { limit: 1000 });

      if (roomsData) {
        roomsData.forEach(item => {
          if (item.name) {
            allFiles.push(`properties/rooms/${item.name}`);
          }
        });
      }
    }

    return allFiles;
  } catch (error) {
    console.error('Error in listAllStorageFiles:', error);
    return [];
  }
}

/**
 * Find orphaned images (images in storage but not referenced in database)
 */
export async function findOrphanedImages(properties: Array<{
  images?: string[];
  roomTypes?: Array<{ images?: string[] }>;
}>): Promise<string[]> {
  try {
    // Get all files from storage
    const storageFiles = await listAllStorageFiles();
    
    // Get all image URLs from database
    const dbImageUrls = new Set<string>();
    
    properties.forEach(property => {
      if (property.images) {
        property.images.forEach(url => {
          const path = extractPathFromUrl(url);
          if (path) dbImageUrls.add(path);
        });
      }
      
      if (property.roomTypes) {
        property.roomTypes.forEach(room => {
          if (room.images) {
            room.images.forEach(url => {
              const path = extractPathFromUrl(url);
              if (path) dbImageUrls.add(path);
            });
          }
        });
      }
    });

    // Find files in storage that are not in database
    const orphanedFiles = storageFiles.filter(file => !dbImageUrls.has(file));
    
    console.log(`Found ${orphanedFiles.length} orphaned files out of ${storageFiles.length} total files`);
    
    return orphanedFiles;
  } catch (error) {
    console.error('Error finding orphaned images:', error);
    return [];
  }
}

/**
 * Clean up orphaned images
 */
export async function cleanupOrphanedImages(orphanedFiles: string[]): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  const results = {
    success: 0,
    failed: 0,
    total: orphanedFiles.length
  };

  if (orphanedFiles.length === 0) {
    return results;
  }

  console.log(`Cleaning up ${orphanedFiles.length} orphaned images...`);

  // Delete in batches of 10
  const batchSize = 10;
  for (let i = 0; i < orphanedFiles.length; i += batchSize) {
    const batch = orphanedFiles.slice(i, i + batchSize);
    
    const { error } = await supabase.storage
      .from('property-images')
      .remove(batch);

    if (error) {
      console.error('Error deleting batch:', error);
      results.failed += batch.length;
    } else {
      results.success += batch.length;
      console.log(`Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} files`);
    }
  }

  return results;
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  totalFiles: number;
  totalSize: number;
  folders: Record<string, number>;
}> {
  try {
    const files = await listAllStorageFiles();
    
    const stats = {
      totalFiles: files.length,
      totalSize: 0,
      folders: {} as Record<string, number>
    };

    // Count files by folder
    files.forEach(file => {
      const folder = file.includes('/') ? file.split('/')[0] : 'root';
      stats.folders[folder] = (stats.folders[folder] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalFiles: 0,
      totalSize: 0,
      folders: {}
    };
  }
}
