/**
 * Image utility functions for cache-busting and optimization
 */

/**
 * Add cache-busting parameter to image URL
 * This forces browsers to fetch fresh images instead of using cached versions
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  // Don't add cache buster if it already has one
  if (url.includes('?t=') || url.includes('&t=')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Remove cache-busting parameter from URL
 * Useful for comparing URLs or storing clean URLs
 */
export function removeCacheBuster(url: string): string {
  if (!url) return url;
  return url.replace(/[?&]t=\d+/, '');
}

/**
 * Optimize image URL with size and quality parameters
 */
export function optimizeImageUrl(
  url: string, 
  size: 'thumbnail' | 'medium' | 'large' = 'large'
): string {
  if (!url) return url;
  
  // Add cache buster first
  const urlWithCacheBuster = addCacheBuster(url);
  
  // For Supabase images
  if (urlWithCacheBuster.includes('supabase.co/storage')) {
    const sizeParams = {
      thumbnail: 'width=400&quality=75',
      medium: 'width=800&quality=80',
      large: 'width=1200&quality=85'
    };
    
    // Check if URL already has parameters
    const hasParams = urlWithCacheBuster.includes('width=');
    if (hasParams) {
      return urlWithCacheBuster;
    }
    
    return `${urlWithCacheBuster}&${sizeParams[size]}`;
  }
  
  // For Unsplash images
  if (urlWithCacheBuster.includes('unsplash.com')) {
    const sizeParams = {
      thumbnail: 'w=400&q=75&fm=webp&fit=crop',
      medium: 'w=800&q=80&fm=webp&fit=crop',
      large: 'w=1200&q=85&fm=webp&fit=crop'
    };
    
    return `${urlWithCacheBuster}&${sizeParams[size]}`;
  }
  
  return urlWithCacheBuster;
}

/**
 * Ensure all images in an array have cache-busting parameters
 */
export function addCacheBusterToImages(images: string[]): string[] {
  return images.map(addCacheBuster);
}

/**
 * Get a fresh version of an image URL by updating the timestamp
 */
export function refreshImageUrl(url: string): string {
  const cleanUrl = removeCacheBuster(url);
  return addCacheBuster(cleanUrl);
}
