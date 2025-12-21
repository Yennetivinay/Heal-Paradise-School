import React, { useState } from 'react';

/**
 * Image component with error handling and fallback
 * Prevents broken images from showing and provides fallback
 */
export const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackSrc = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  className = "",
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default ImageWithFallback;

