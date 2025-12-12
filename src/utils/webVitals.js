// Web Vitals tracking for performance monitoring using native PerformanceObserver API
// No external dependencies required
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        
        if (lcp && process.env.NODE_ENV === 'production') {
          // Send to analytics service (e.g., Google Analytics, Sentry)
          // Example: sendToAnalytics('LCP', lcp);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Silently handle errors
    }

    // Track Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        if (process.env.NODE_ENV === 'production') {
          // Send to analytics service (e.g., Google Analytics, Sentry)
          // Example: sendToAnalytics('CLS', clsValue);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Silently handle errors
    }

    // Track First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          
          if (fid && process.env.NODE_ENV === 'production') {
            // Send to analytics service (e.g., Google Analytics, Sentry)
            // Example: sendToAnalytics('FID', fid);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Silently handle errors
    }
  }
};

