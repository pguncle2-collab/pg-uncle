'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onError?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  loading,
  quality = 80,
  sizes,
  placeholder,
  blurDataURL,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load image: ${src?.substring(0, 100)}...`);
      setImgSrc(FALLBACK_IMAGE);
      setHasError(true);
      onError?.();
    }
  };

  // Check if the URL is valid
  const isValidUrl = imgSrc && (
    imgSrc.startsWith('http://') || 
    imgSrc.startsWith('https://') || 
    imgSrc.startsWith('/') ||
    imgSrc.startsWith('data:') // Support base64 data URLs
  );

  if (!isValidUrl) {
    return (
      <Image
        src={FALLBACK_IMAGE}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
        loading={loading}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    );
  }

  // For base64 data URLs, use regular img tag (Next.js Image doesn't support them)
  if (imgSrc.startsWith('data:')) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={fill ? { 
          objectFit: 'cover', 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          inset: 0
        } : width && height ? {
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'cover'
        } : undefined}
        loading={loading || (priority ? 'eager' : 'lazy')}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      quality={quality}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleError}
    />
  );
};
