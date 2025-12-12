import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { optimizeAnimations } from './utils/animationOptimizer'
import { trackWebVitals } from './utils/webVitals'
// Import CSS - Vite will handle bundling correctly in both dev and production
import './index.css'

// Initialize Lenis lazily after initial render with mobile optimization
const initLenis = () => {
  import('lenis').then(({ default: Lenis }) => {
    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: !prefersReducedMotion,
      smoothTouch: !prefersReducedMotion && !isMobile, // Disable on mobile for better performance
      touchMultiplier: isMobile ? 1.5 : 2,
      wheelMultiplier: isMobile ? 0.8 : 1,
      infinite: false,
    });
    window.lenis = lenis;
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
};

// Optimize animations before rendering
optimizeAnimations();

// Initialize Web Vitals tracking
trackWebVitals();

// Render app immediately
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

// Initialize Lenis after initial render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Defer Lenis initialization
    setTimeout(initLenis, 100);
  });
} else {
  setTimeout(initLenis, 100);
}
