/**
 * Global animation optimizer
 * Applies performance optimizations to all animations on the page
 */

// Check if device is mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Optimize all motion components on the page
 */
export const optimizeAnimations = () => {
  if (typeof window === 'undefined') return;
  
  // Add GPU acceleration to all motion divs
  const observer = new MutationObserver(() => {
    const motionElements = document.querySelectorAll('[data-framer-name], [style*="transform"]');
    motionElements.forEach((el) => {
      if (!el.classList.contains('transform-gpu')) {
        el.classList.add('transform-gpu');
        el.style.backfaceVisibility = 'hidden';
        el.style.perspective = '1000px';
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Optimize scroll performance
  if (isMobileDevice()) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  // Reduce motion if preferred
  if (prefersReducedMotion()) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  }
  
  return () => observer.disconnect();
};

/**
 * Get optimized animation settings
 */
export const getAnimationSettings = () => {
  const mobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  return {
    duration: reducedMotion ? 0 : (mobile ? 0.3 : 0.5),
    delay: reducedMotion ? 0 : (mobile ? 0.05 : 0.08),
    viewport: {
      once: true,
      margin: mobile ? "-100px" : "-150px",
      amount: mobile ? 0.2 : 0.3
    },
    transition: {
      ease: [0.25, 0.1, 0.25, 1],
      type: mobile ? 'tween' : 'spring',
      stiffness: mobile ? 200 : 150,
      damping: mobile ? 25 : 20
    }
  };
};

