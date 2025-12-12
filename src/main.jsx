import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { optimizeAnimations } from './utils/animationOptimizer'
import { trackWebVitals } from './utils/webVitals'

// Defer CSS loading for faster initial render
const loadCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/index.css';
  document.head.appendChild(link);
};

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

// Load CSS and Lenis after initial render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadCSS();
    // Defer Lenis initialization
    setTimeout(initLenis, 100);
  });
} else {
  loadCSS();
  setTimeout(initLenis, 100);
}
