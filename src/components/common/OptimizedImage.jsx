import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImageProps } from '../../utils/imageOptimizer';

/**
 * Optimized Image Component with lazy loading, responsive sizes, and error handling
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px',
  quality = 80,
  fallbackSrc,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [priority, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Generate optimized image props
  const imageProps = getOptimizedImageProps(src, {
    width: width || 800,
    height,
    quality,
    priority,
    sizes,
  });

  const displaySrc = hasError && fallbackSrc ? fallbackSrc : imageProps.src;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      {/* Placeholder/loading state */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Optimized image */}
      {isInView && (
        <img
          ref={imgRef}
          src={displaySrc}
          srcSet={!hasError ? imageProps.srcSet : undefined}
          sizes={!hasError ? imageProps.sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={imageProps.loading}
          decoding={imageProps.decoding}
          fetchPriority={imageProps.fetchPriority}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: width && height ? `${width}px ${height}px` : undefined,
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

