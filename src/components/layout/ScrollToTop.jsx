import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Immediately scroll to top using native smooth scrolling
    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Scroll immediately
    scrollToTop();

    // Also scroll on next frame to ensure it happens after any layout changes
    requestAnimationFrame(() => {
      scrollToTop();
      // One more time after a tiny delay to catch any async layout changes
      setTimeout(scrollToTop, 0);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

