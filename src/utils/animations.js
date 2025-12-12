// Global animation configurations optimized for all devices
// Detects device type and reduces motion for better performance

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Optimized animation variants for mobile and desktop
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.3 : 0.5),
      ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoothness
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.2 : 0.4),
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.3 : 0.5),
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.3 : 0.5),
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.3 : 0.5),
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Stagger container for list animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : (isMobile() ? 0.05 : 0.08),
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
};

// Viewport settings optimized for mobile
export const viewportSettings = {
  once: true,
  margin: isMobile() ? "-100px" : "-150px",
  amount: isMobile() ? 0.2 : 0.3
};

// Optimized transition presets
export const transitions = {
  smooth: {
    duration: isMobile() ? 0.3 : 0.5,
    ease: [0.25, 0.1, 0.25, 1]
  },
  fast: {
    duration: isMobile() ? 0.2 : 0.3,
    ease: "easeOut"
  },
  spring: {
    type: "spring",
    stiffness: isMobile() ? 200 : 150,
    damping: isMobile() ? 25 : 20,
    mass: 1
  }
};

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : -20
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: prefersReducedMotion() ? 0 : (isMobile() ? 0.2 : 0.3)
};

