/**
 * Image optimization utilities for fast rendering
 */

/**
 * Generate optimized image URL with size parameters
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} quality - Quality (1-100, default 80)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, width, quality = 80) => {
  if (!url) return '';
  
  // For Unsplash images, add size parameters
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }
  
  return url;
};

/**
 * Generate srcset for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {number[]} widths - Array of widths
 * @returns {string} srcset string
 */
export const generateSrcSet = (baseUrl, widths = [400, 800, 1200, 1600]) => {
  if (!baseUrl) return '';
  
  return widths
    .map(width => `${getOptimizedImageUrl(baseUrl, width)} ${width}w`)
    .join(', ');
};

/**
 * Get appropriate image size based on viewport
 * @param {string} size - Size category: 'small', 'medium', 'large', 'xlarge'
 * @returns {number} Width in pixels
 */
export const getImageSize = (size = 'medium') => {
  const sizes = {
    small: 400,
    medium: 800,
    large: 1200,
    xlarge: 1600,
  };
  return sizes[size] || sizes.medium;
};

/**
 * Check if WebP is supported
 * @returns {Promise<boolean>}
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Get optimized image props for React img element
 * @param {string} src - Image source
 * @param {Object} options - Options
 * @returns {Object} Image props
 */
export const getOptimizedImageProps = (src, options = {}) => {
  const {
    width = 800,
    height,
    quality = 80,
    priority = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px',
  } = options;

  const optimizedSrc = getOptimizedImageUrl(src, width, quality);
  const srcSet = generateSrcSet(src, [400, 800, 1200, 1600]);

  return {
    src: optimizedSrc,
    srcSet,
    sizes,
    width,
    height,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchPriority: priority ? 'high' : 'auto',
  };
};

