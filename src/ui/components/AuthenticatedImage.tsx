"use client";

import { useEffect, useState, useRef } from 'react';

interface AuthenticatedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

/**
 * Component to load images that require authentication
 * Fetches the image with Authorization header and converts to blob URL
 * Includes lazy loading and smooth loading transitions
 */
export function AuthenticatedImage({
  src,
  alt,
  className = '',
  fallbackSrc,
  onError,
}: AuthenticatedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once in view
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the image is visible
        rootMargin: '50px', // Start loading 50px before it comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Get auth token from localStorage
        const token = localStorage.getItem('access_token');
        
        const headers: Record<string, string> = {
          'Accept': 'image/*',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Use the original URL which already points to the API Gateway routes
        // Add cache busting parameter to avoid stale cached responses
        const urlWithCacheBust = new URL(src, window.location.origin);
        urlWithCacheBust.searchParams.set('_t', Date.now().toString());
        
        const response = await fetch(urlWithCacheBust.toString(), {
          headers,
          cache: 'no-cache',
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          
          // Only log detailed errors for debugging, not for normal "photo not found" cases
          if (response.status !== 404) {
            console.error(`Failed to load image: ${response.status} - ${errorText}`, {
              url: src,
              status: response.status,
              statusText: response.statusText
            });
          }
          
          throw new Error(`Failed to load image: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        console.log('AuthenticatedImage fetched blob', {
          src,
          size: blob.size,
          type: blob.type,
        });
        console.log('AuthenticatedImage created object URL', objectUrl);
        setImageSrc(objectUrl);
      } catch (error) {
        // Only log errors that are not 404 (photo not found is normal)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('404')) {
          console.error('Error loading authenticated image:', error);
        }
        
        setHasError(true);
        setIsLoading(false);
        
        // Use fallback image if available
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
        
        if (onError) {
          onError();
        }
      }
    };

    loadImage();

    // Cleanup: revoke object URL when component unmounts or src changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, fallbackSrc, onError, isInView]);

  return (
    <div ref={imgRef} className={`${className} relative overflow-hidden`}>
      {/* Placeholder/Skeleton while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500 text-xs">Cargando imagen...</span>
          </div>
        </div>
      )}

             {/* Error state - only show if no fallback image and no image loaded */}
             {hasError && !imageSrc && !fallbackSrc && (
               <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                 {/* Error is silent - parent will show default content */}
               </div>
             )}

      {/* Actual image with smooth transition */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setIsLoaded(true);
            setIsLoading(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
            }
            if (onError) {
              onError();
            }
          }}
        />
      )}

      {/* Fallback image if no authenticated image */}
      {!imageSrc && !isLoading && !hasError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

