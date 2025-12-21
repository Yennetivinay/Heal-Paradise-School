import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = () => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(null);
  const isPulling = useRef(false);
  const pullDistanceRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const pullThreshold = 100; // Distance in pixels to trigger refresh

  // Check if device supports touch
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Sync refs with state
  useEffect(() => {
    pullDistanceRef.current = pullDistance;
  }, [pullDistance]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    if (!isTouchDevice) {
      return; // Don't enable on non-touch devices
    }

    const handleTouchStart = (e) => {
      // Check if we're at the top of the page
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const atTop = scrollY <= 5;

      if (atTop && e.touches.length === 1 && !isRefreshingRef.current) {
        touchStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current || touchStartY.current === null || isRefreshingRef.current) {
        return;
      }

      // Check if still at top
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 5) {
        // User scrolled away, reset
        isPulling.current = false;
        touchStartY.current = null;
        setPullDistance(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - touchStartY.current);

      // Only allow pulling down (positive distance)
      if (distance > 0) {
        pullDistanceRef.current = distance;
        setPullDistance(distance);
        // Prevent default scrolling when pulling down at top
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current || isRefreshingRef.current) {
        return;
      }

      const currentDistance = pullDistanceRef.current;

      // If pulled beyond threshold, trigger refresh
      if (currentDistance >= pullThreshold) {
        setIsRefreshing(true);
        // Small delay to show visual feedback before reload
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Reset if not enough pull
        setPullDistance(0);
        pullDistanceRef.current = 0;
        isPulling.current = false;
        touchStartY.current = null;
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice]);

  if (!isTouchDevice) {
    return null;
  }

  const pullProgress = Math.min(pullDistance / pullThreshold, 1);
  const shouldShowIndicator = pullDistance > 10 || isRefreshing;

  return (
    <AnimatePresence>
      {shouldShowIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-center pointer-events-none"
          style={{
            paddingTop: `${Math.min(pullDistance * 0.5, 60)}px`,
          }}
        >
          <motion.div
            animate={{
              scale: isRefreshing ? 1 : 0.7 + pullProgress * 0.3,
              rotate: isRefreshing ? 360 : pullProgress * 180,
            }}
            transition={{
              rotate: { duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0, ease: 'linear' },
              scale: { duration: 0.2 },
            }}
            className={`rounded-full p-3 shadow-lg ${
              pullProgress >= 1 || isRefreshing
                ? 'bg-brand-500 text-white'
                : 'bg-white/90 text-brand-500'
            }`}
          >
            <RefreshCw className="w-6 h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PullToRefresh;

