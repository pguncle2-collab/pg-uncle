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
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load image: ${src?.substring(0, 100)}...`);
      setImgSrc(FALLBACK_IMAGE);
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
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
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
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
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  }

  // For base64 data URLs, use regular img tag (Next.js Image doesn't support them)
  if (imgSrc.startsWith('data:')) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
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
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        priority={priority}
        loading={loading}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};
