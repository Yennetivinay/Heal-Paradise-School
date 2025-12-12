import { useEffect } from 'react';
import { isMobile, prefersReducedMotion, viewportSettings, transitions } from '../utils/animations';

/**
 * Hook to optimize animations for performance
 * Adds GPU acceleration and optimizes settings based on device
 */
export const useOptimizedAnimation = (ref) => {
  useEffect(() => {
    if (!ref?.current) return;
    
    const element = ref.current;
    
    // Add GPU acceleration classes
    element.classList.add('transform-gpu');
    
    // Optimize for mobile
    if (isMobile()) {
      element.setAttribute('data-mobile-optimize', 'true');
    }
    
    // Respect reduced motion preference
    if (prefersReducedMotion()) {
      element.setAttribute('data-reduced-motion', 'true');
    }
    
    return () => {
      element.classList.remove('transform-gpu');
      element.removeAttribute('data-mobile-optimize');
      element.removeAttribute('data-reduced-motion');
    };
  }, [ref]);
};

/**
 * Get optimized viewport settings for animations
 */
export const getOptimizedViewport = (customMargin = null) => {
  return {
    ...viewportSettings,
    margin: customMargin || viewportSettings.margin
  };
};

/**
 * Get optimized transition based on device
 */
export const getOptimizedTransition = (type = 'smooth') => {
  return transitions[type] || transitions.smooth;
};

