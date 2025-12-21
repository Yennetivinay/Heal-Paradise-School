import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { optimizeAnimations } from './utils/animations'
import { trackWebVitals } from './utils/webVitals'
import Lenis from 'lenis'
// Import CSS - Vite will handle bundling correctly in both dev and production
import './index.css'

// Render app immediately - prioritize rendering over other initialization
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});
// Defer non-critical initialization to improve TTI
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Optimize animations after initial render
    optimizeAnimations();
    
    // Initialize Web Vitals tracking (non-blocking)
    trackWebVitals();
  }, { timeout: 2000 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(() => {
    optimizeAnimations();
    trackWebVitals();
  }, 100);
}

