import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useLocation } from "react-router-dom";

// --- FlipCard Component ---
const IMG_WIDTH = 60;  // Reduced from 100
const IMG_HEIGHT = 85; // Reduced from 140

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}) {
  return (
    <motion.div
            // Smoothly animate to the coordinates defined by the parent
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}

            // Initial style
      style={{
        position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200 ring-2 ring-white/50"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`hero-${index}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0" />
          <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 flex flex-col items-center justify-center p-4 border-2 border-white/20"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
                        <p className="text-[8px] font-bold text-brand-200 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 21;
const MAX_SCROLL = 3000; // Virtual scroll range

// Unsplash Images
const IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
  "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80",
];

// Helper for linear interpolation
const lerp = (start, end, t) => start * (1 - t) + end * t;

export default function IntroAnimation({ onAnimationComplete }) {
  const location = useLocation();
  const [introPhase, setIntroPhase] = useState("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationCompleteRef = useRef(false);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    // Initial set
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

    // --- Virtual Scroll Logic with Scroll Locking ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);
  const lockedScrollPosition = useRef(0);
  const isLockedRef = useRef(false);
  const navigationActiveRef = useRef(false); // Flag to completely disable scroll lock when navigation is active
    const exploreVisionScrollCount = useRef(0); // Count scrolls after "Explore Our Vision" is visible
    const wasExploreVisionVisible = useRef(false); // Track if "Explore Our Vision" was visible
    const wasOutOfViewRef = useRef(false); // Track if component was out of view
    
    const clearBodyLock = () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
    };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

        // Dispatch start event when component mounts (only on gallery page)
        if (location.pathname === '/gallery') {
            window.dispatchEvent(new CustomEvent('introAnimationStart'));
        }

        // Check if animation is complete
        const isAnimationComplete = () => {
            return scrollRef.current >= MAX_SCROLL;
        };

        // Check if component is in view
        const isInView = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
            return rect.top < viewportHeight && rect.bottom > 0;
        };

        // Check if component is out of view
        const isOutOfView = () => {
            const rect = container.getBoundingClientRect();
            return rect.bottom < 0;
        };

        // Check if "Explore Our Vision" section is reached and visible
        const isExploreVisionVisible = () => {
            // "Explore Our Vision" becomes visible when virtual scroll reaches 80% of morph distance (480 out of 600)
            return scrollRef.current >= 480;
        };

        // Check if should unlock (after 4 scrolls when "Explore Our Vision" is visible)
        const shouldUnlockAfterExploreVision = () => {
            const isVisible = isExploreVisionVisible();
            
            if (isVisible && !wasExploreVisionVisible.current) {
                // Just became visible, reset counter
                wasExploreVisionVisible.current = true;
                exploreVisionScrollCount.current = 0;
            }
            
            // If visible and we've had 4 scrolls, unlock
            if (isVisible && wasExploreVisionVisible.current && exploreVisionScrollCount.current >= 4) {
                return true;
            }
            
            return false;
        };

    const handleWheel = (e) => {
            // NEVER block navigation - check if hovering over nav or navigation is active
      const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            if (isNavigationElement(target) || navigationActiveRef.current) {
                // If hovering over nav or navigation is active, unlock immediately and disable lock
                navigationActiveRef.current = true;
                if (isLockedRef.current) {
                    isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                        });
                    }
                }
                return;
            }
            
            // Don't lock if navigation is active
            if (navigationActiveRef.current) {
                return;
            }

            // If out of view, unlock and allow normal scroll
            if (isOutOfView() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                return;
            }

            // ALWAYS unlock when scrolling up - allow normal page scrolling, but update virtual scroll for reverse animation
            if (e.deltaY < 0) {
                // Unlock if locked
                if (isLockedRef.current) {
                    isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                        });
                    }
                }
                
                // Always update virtual scroll for reverse animation when scrolling up (even if not locked)
                if (isInView() && !isAnimationComplete()) {
                    const newScroll = Math.max(scrollRef.current + e.deltaY, 0);
          scrollRef.current = newScroll;
          virtualScroll.set(newScroll);
                }
                
                return; // Allow normal scroll up
            }

            // If "Explore Our Vision" is visible, count scrolls (only when scrolling down)
            if (isExploreVisionVisible() && wasExploreVisionVisible.current && e.deltaY > 0) {
                exploreVisionScrollCount.current = Math.min(exploreVisionScrollCount.current + 1, 4);
            }
            
            // Reset visibility flag if scrolled back before "Explore Our Vision" becomes visible
            if (!isExploreVisionVisible() && wasExploreVisionVisible.current) {
                wasExploreVisionVisible.current = false;
                exploreVisionScrollCount.current = 0;
            }

            // If should unlock after 4 scrolls when "Explore Our Vision" is visible
            if (shouldUnlockAfterExploreVision() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return; // Allow normal scroll
            }

            // IMPORTANT: Always check navigation first - never lock if navigation is active
            // This check must happen BEFORE any scroll locking, even when "Explore Our Vision" is visible
            if (navigationActiveRef.current) {
                return; // Don't lock if navigation is active
            }

            // Only lock if scrolling down, animation is not complete, component is in view, not ready to unlock, and navigation is not active
            if (e.deltaY > 0 && !isAnimationComplete() && isInView() && !shouldUnlockAfterExploreVision() && !navigationActiveRef.current) {
                // Double-check navigation hasn't been activated (race condition protection)
                if (navigationActiveRef.current) {
                    return;
                }
                
                // Update virtual scroll (only when scrolling down)
                const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
                
          e.preventDefault();
          e.stopPropagation();
          
          scrollRef.current = newScroll;
          virtualScroll.set(newScroll);
          
                // Lock scroll position
          if (!isLockedRef.current) {
            lockedScrollPosition.current = window.scrollY;
            isLockedRef.current = true;
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${lockedScrollPosition.current}px`;
                    document.body.style.width = '100%';
                    document.body.style.paddingRight = `${scrollbarWidth}px`;
                }

                // Maintain locked position
          window.scrollTo(0, lockedScrollPosition.current);
        }
        };

        // Handle scroll - maintain lock or unlock when complete or about to go down
        const handleScroll = () => {
            // Check if component is out of view and dispatch event to show navbar
            // Only show navbar when going out of view, don't hide it again when reversing
            const outOfView = isOutOfView();
            if (outOfView && !wasOutOfViewRef.current) {
                // Component just went out of view - show navbar (and keep it visible)
                wasOutOfViewRef.current = true;
                window.dispatchEvent(new CustomEvent('introAnimationOutOfView'));
            }
            // Don't hide navbar again when component comes back into view (reversing)
            
            // If out of view, unlock
            if (isOutOfView() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return;
            }

            // If user is scrolling up, unlock to allow normal page scroll
            if (isLockedRef.current && isInView()) {
                const currentScroll = window.scrollY;
                // If page scroll is trying to go above locked position, user is scrolling up
                if (currentScroll < lockedScrollPosition.current) {
                    // User is scrolling up, unlock immediately
                    isLockedRef.current = false;
                    clearBodyLock();
                    return;
                }
            }

            // If should unlock after 4 scrolls when "Explore Our Vision" is visible
            if (shouldUnlockAfterExploreVision() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return;
            }

            // If animation complete, unlock
            if (isAnimationComplete() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return;
            }

            // Maintain lock if locked and animation not complete and not ready to unlock
            if (isLockedRef.current && !isAnimationComplete() && isInView() && !shouldUnlockAfterExploreVision()) {
          window.scrollTo(0, lockedScrollPosition.current);
        }
        };

            // Dispatch event when animation completes
            const checkAndDispatchAnimationComplete = (value) => {
                if (value >= MAX_SCROLL && !wasAnimationCompleteDispatched.current) {
                    wasAnimationCompleteDispatched.current = true;
                    // Dispatch custom event to notify navbar
                    window.dispatchEvent(new CustomEvent('introAnimationComplete'));
                } else if (value < MAX_SCROLL && wasAnimationCompleteDispatched.current) {
                    // Reset if animation is reversed
                    wasAnimationCompleteDispatched.current = false;
                    window.dispatchEvent(new CustomEvent('introAnimationStart'));
                }
            };

            // Unlock when "Explore Our Vision" section is reached or animation completes
            const unsubscribe = virtualScroll.on("change", (value) => {
                // Check and dispatch animation complete event
                checkAndDispatchAnimationComplete(value);
                
                // Check if component is out of view and dispatch event to show navbar
                // Only show navbar when going out of view, don't hide it again when reversing
                const outOfView = isOutOfView();
                if (outOfView && !wasOutOfViewRef.current) {
                    // Component just went out of view - show navbar (and keep it visible)
                    wasOutOfViewRef.current = true;
                    window.dispatchEvent(new CustomEvent('introAnimationOutOfView'));
                }
                // Don't hide navbar again when component comes back into view (reversing)
                
            if (isOutOfView() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                return;
            }

            // If scrolled back to beginning (value = 0), unlock to allow normal page scroll up
            if (value <= 0 && isLockedRef.current && isInView()) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return;
            }

            // Reset visibility flag if scrolled back before "Explore Our Vision" becomes visible
            if (value < 480 && wasExploreVisionVisible.current) {
                wasExploreVisionVisible.current = false;
                exploreVisionScrollCount.current = 0;
            }

            // If should unlock after 4 scrolls when "Explore Our Vision" is visible
            if (shouldUnlockAfterExploreVision() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
                return;
            }

            if (value >= MAX_SCROLL && isLockedRef.current) {
        isLockedRef.current = false;
                clearBodyLock();
                const scrollY = document.body.style.top;
                if (scrollY) {
                    const scrollPosition = parseInt(scrollY || '0') * -1;
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    });
                }
            }
        });

        // Navigation handlers - always allow navigation
        const isNavigationElement = (target) => {
            // Ensure target is a valid DOM element
            if (!target || typeof target.closest !== 'function' || !target.nodeType) {
                return false;
            }
            
            // EXCLUDE gallery images - they should not trigger navigation
            if (target.closest('[data-gallery-image]') || target.hasAttribute('data-gallery-image')) {
                return false;
            }
            
            // Check if element is within navbar - more comprehensive check
            const navElement = target.closest('nav') || 
                             target.closest('[role="navigation"]') ||
                             target.closest('[data-navigation]') ||
                             // Check if parent has navbar-related classes
                             target.closest('.navbar') ||
                             target.closest('[class*="nav"]') ||
                             // Check for fixed navbar (common pattern)
                             (target.closest('[class*="fixed"]') && target.closest('[class*="top"]'));
            
            // Check for React Router Link components (they render as <a> tags with href)
            // BUT exclude gallery images
            const isLink = (target.closest('a[href]') && !target.closest('[data-gallery-image]')) || 
                          ((target.tagName === 'A' && target.hasAttribute('href')) && !target.hasAttribute('data-gallery-image')) ||
                          (target.closest('[href]') && !target.closest('[data-gallery-image]')) ||
                          // Check for React Router specific attributes or patterns
                          (target.closest('[data-router-link]') && !target.closest('[data-gallery-image]')) ||
                          // Check if it's a clickable element that might navigate
                          (target.closest('a') && target.closest('a')?.getAttribute('href') && !target.closest('[data-gallery-image]'));
            
            // Check for buttons and interactive elements that might navigate
            // BUT exclude gallery images
            const isInteractive = (target.closest('button') && !target.closest('[data-gallery-image]')) || 
                                 (target.closest('[data-navigate]') && !target.closest('[data-gallery-image]')) ||
                                 (target.closest('[onClick]') && !target.closest('[data-gallery-image]')) ||
                                 ((target.tagName === 'BUTTON' || target.tagName === 'NAV') && !target.hasAttribute('data-gallery-image'));
            
            return navElement || isLink || isInteractive;
        };

        // Unlock on hover over navigation - use mouseover for event delegation
        const handleMouseOver = (e) => {
            const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            // Check for navigation elements - be very permissive
            const isNav = target.closest('a[href]') || 
                         target.closest('nav') || 
                         target.closest('button') ||
                         (target.tagName === 'A' && target.hasAttribute('href')) ||
                         isNavigationElement(target);
            
            if (isNav) {
                // Set navigation active flag to disable scroll lock - do this FIRST
                navigationActiveRef.current = true;
                if (isLockedRef.current) {
        isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                        });
                    }
        }
      } else {
                // Reset navigation flag when not hovering over navigation (with small delay to prevent flicker)
                // Only reset if we're not in the middle of a navigation action
                setTimeout(() => {
                    const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
                    if (elementAtPoint && elementAtPoint.nodeType && typeof elementAtPoint.closest === 'function') {
                        const stillNav = elementAtPoint.closest('a[href]') || 
                                       elementAtPoint.closest('nav') || 
                                       elementAtPoint.closest('button') ||
                                       isNavigationElement(elementAtPoint);
                        if (!stillNav) {
                            navigationActiveRef.current = false;
                        }
                    }
                }, 100);
            }
        };
        
        // Also check on mouseenter for better detection
        const handleMouseEnter = (e) => {
            const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            if (isNavigationElement(target)) {
                // Set navigation active flag to disable scroll lock
                navigationActiveRef.current = true;
                if (isLockedRef.current) {
        isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                        });
                    }
                }
            }
        };

        const handleMouseDown = (e) => {
      const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            // EXCLUDE gallery images - they should not trigger navigation
            if (target.closest('[data-gallery-image]') || target.hasAttribute('data-gallery-image')) {
                return; // Don't activate navigation for gallery images
            }
            
            // Check if this is a navigation element - be very permissive
            // Check for any link, nav element, or button that might navigate
            const isNav = target.closest('a[href]') || 
                         target.closest('nav') || 
                         target.closest('button') ||
                         (target.tagName === 'A' && target.hasAttribute('href')) ||
                         isNavigationElement(target);
            
            if (isNav) {
                // Set navigation active flag to completely disable scroll lock
                navigationActiveRef.current = true;
                // Immediately unlock and allow navigation - do this synchronously
                if (isLockedRef.current) {
                    isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        // Restore scroll position immediately - don't use requestAnimationFrame for navigation
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    }
                }
                // Don't prevent default or stop propagation - allow navigation to work immediately
                // Let the event bubble normally so React Router can handle it
                // Return without doing anything else to let the event proceed normally
                return;
            }
        };

    const handleClick = (e) => {
      const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            // EXCLUDE gallery images - they should not trigger navigation
            if (target.closest('[data-gallery-image]') || target.hasAttribute('data-gallery-image')) {
                return; // Don't activate navigation for gallery images
            }
            
            // Check if this is a navigation element - be very permissive
            // Check for any link, nav element, or button that might navigate
            const isNav = target.closest('a[href]') ||
                         target.closest('nav') ||
                         target.closest('button') ||
                         (target.tagName === 'A' && target.hasAttribute('href')) ||
                         isNavigationElement(target);
            
            if (isNav) {
                // Set navigation active flag to completely disable scroll lock
                navigationActiveRef.current = true;
                // Immediately unlock and allow navigation - do this synchronously
        if (isLockedRef.current) {
          isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        // Restore scroll position immediately - don't use requestAnimationFrame for navigation
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    }
                }
                // Don't prevent default or stop propagation - allow navigation to work immediately
                // Let the event bubble normally so React Router can handle it
                // Return without doing anything else to let the event proceed normally
                return;
            }
        };

        // Touch support
    let touchStartY = 0;
    let touchStartScroll = 0;
    let touchStartPageScroll = 0;
    let isTouching = false;
    
    const handleTouchStart = (e) => {
      const target = e?.target;
            // Check if target is valid DOM element before calling closest
            if (target && target.nodeType && typeof target.closest === 'function' && isNavigationElement(target)) {
                // Immediately unlock on touch of navigation
                if (isLockedRef.current) {
                    isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    }
                }
                return;
            }

            // If should unlock after 4 scrolls when "Explore Our Vision" is visible
            if (shouldUnlockAfterExploreVision() && isLockedRef.current) {
                isLockedRef.current = false;
                clearBodyLock();
                return;
            }

            if (!isAnimationComplete() && isInView() && !shouldUnlockAfterExploreVision()) {
        touchStartY = e.touches[0].clientY;
        touchStartScroll = scrollRef.current;
        touchStartPageScroll = window.scrollY;
        lockedScrollPosition.current = window.scrollY;
        isTouching = true;

                if (!isLockedRef.current) {
        isLockedRef.current = true;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${lockedScrollPosition.current}px`;
          document.body.style.width = '100%';
                }
      }
    };

    const handleTouchMove = (e) => {
            if (!isTouching || isAnimationComplete()) return;

            const target = e?.target;
            if (!target || !target.nodeType || typeof target.closest !== 'function') return;
            if (isNavigationElement(target)) {
                // Immediately unlock on touch of navigation
                isTouching = false;
                if (isLockedRef.current) {
        isLockedRef.current = false;
                    clearBodyLock();
                    const scrollY = document.body.style.top;
                    if (scrollY) {
                        const scrollPosition = parseInt(scrollY || '0') * -1;
                        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                    }
                }
                return;
            }

            // If "Explore Our Vision" is visible, count scrolls (increment on scroll down, decrement on scroll up)
        const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            
            if (isExploreVisionVisible() && wasExploreVisionVisible.current) {
                if (deltaY < 0) {
                    // Scrolling down (touch moving up)
                    exploreVisionScrollCount.current = Math.min(exploreVisionScrollCount.current + 1, 4);
                } else if (deltaY > 0) {
                    // Scrolling up (touch moving down) - reverse the count
                    exploreVisionScrollCount.current = Math.max(exploreVisionScrollCount.current - 1, 0);
                }
            }
            
            // Reset visibility flag if scrolled back before "Explore Our Vision" becomes visible
            if (!isExploreVisionVisible() && wasExploreVisionVisible.current) {
                wasExploreVisionVisible.current = false;
                exploreVisionScrollCount.current = 0;
            }

            // If should unlock after 4 scrolls when "Explore Our Vision" is visible
            if (shouldUnlockAfterExploreVision() && isLockedRef.current) {
          isTouching = false;
                isLockedRef.current = false;
                clearBodyLock();
                return;
        }
        
            if (isInView() && !shouldUnlockAfterExploreVision()) {
                const sensitivity = window.innerWidth < 768 ? 1.5 : 1;
                const newScroll = Math.min(Math.max(touchStartScroll + (deltaY * sensitivity), 0), MAX_SCROLL);
                
                // ALWAYS unlock when scrolling up (deltaY > 0 means finger moving up = scrolling up)
                if (deltaY > 0) {
                    // Unlock if locked
                    if (isLockedRef.current) {
          isTouching = false;
                        isLockedRef.current = false;
                        clearBodyLock();
                        const scrollY = document.body.style.top;
        if (scrollY) {
          const scrollPosition = parseInt(scrollY || '0') * -1;
                            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
                        }
                    }
                    
                    // Always update virtual scroll for reverse animation when scrolling up (even if not locked)
                    if (!isAnimationComplete()) {
                        scrollRef.current = newScroll;
                        virtualScroll.set(newScroll);
                    }
                    return; // Allow normal scroll up
                }
                
                // Only lock when scrolling down
                if (deltaY < 0) {
          e.preventDefault();
          scrollRef.current = newScroll;
          virtualScroll.set(newScroll);
          window.scrollTo(0, touchStartPageScroll);
        }
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

        // Attach listeners
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
        window.addEventListener("scroll", handleScroll, { passive: false, capture: true });
        // Use capture: false for navigation events to ensure React Router handles them first
        document.addEventListener("mousedown", handleMouseDown, { capture: false });
        document.addEventListener("click", handleClick, { capture: false });
        // Add hover listeners for navigation - unlock on hover (use mouseover and mouseenter for better detection)
        document.addEventListener("mouseover", handleMouseOver, { capture: true, passive: true });
        document.addEventListener("mouseenter", handleMouseEnter, { capture: true, passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
            window.removeEventListener("scroll", handleScroll, { capture: true });
            document.removeEventListener("mousedown", handleMouseDown, { capture: true });
            document.removeEventListener("click", handleClick, { capture: true });
            document.removeEventListener("mouseover", handleMouseOver, { capture: true });
            document.removeEventListener("mouseenter", handleMouseEnter, { capture: true });
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
            clearBodyLock();
            // Reset navigation flag on cleanup
            navigationActiveRef.current = false;
      unsubscribe();
    };
  }, [virtualScroll]);

  // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 600
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 600)
    // Rotates the bottom arc as user continues scrolling
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
      const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // --- Random Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
      opacity: 0,
    }));
  }, []);

  // --- Render Loop (Manual Calculation for Morph) ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
        <div ref={containerRef} className="relative w-full h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden" style={{ position: 'relative' }}>
            {/* Animated Background - Matching Gallery Page */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-brand-100/25 via-brand-100/25 to-brand-100/25 rounded-full blur-3xl" />
                
                {/* Floating Sparkles */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-brand-400/60 rounded-full"
      style={{ 
                            left: `${10 + (i * 7)}%`,
                            top: `${15 + (i * 6)}%`,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 2 + (i * 0.3),
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
                
                {/* Light Sweep Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      style={{ 
                        width: '50%',
                        height: '100%',
                        transform: 'skewX(-20deg)',
                    }}
                    animate={{
                        x: ['-100%', '200%'],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'easeInOut',
                    }}
                />
      </div>

      {/* Container */}
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000 relative z-10">

        {/* Intro Text (Fades out) */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(10px)", scale: 0.9 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight mb-2"
          >
            <span 
              className="bg-gradient-to-r from-brand-600 via-brand-500 via-cyan-500 to-brand-600 bg-clip-text text-transparent animate-gradient"
            style={{
              textShadow: '0 4px 20px rgba(59, 130, 246, 0.3), 0 2px 10px rgba(14, 165, 233, 0.2)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
                letterSpacing: '-0.02em',
            }}
          >
            Welcome to Our Gallery
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.6 - morphValue * 1.2, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-xs md:text-sm font-bold tracking-[0.3em] text-brand-600/80 uppercase"
            style={{
              letterSpacing: '0.3em',
              textShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
            }}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </div>

        {/* Arc Active Content (Fades in) */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[14%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <motion.h2 
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #0098CA 0%, #0098CA 50%, #0098CA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Explore Our Vision
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium"
            style={{ opacity: contentOpacity }}
          >
            Discover a world where technology meets creativity. <br className="hidden md:block" />
            Scroll through our curated collection of innovations designed to shape the future.
          </motion.p>
        </motion.div>

        {/* Main Container */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            // 1. Intro Phases (Scatter -> Line)
            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
                            const lineSpacing = 70; // Adjusted for smaller images (60px width + 10px gap)
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);

              // A. Calculate Circle Position
              const circleRadius = Math.min(minDimension * 0.35, 350);

              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              // B. Calculate Bottom Arc Position
                            // "Rainbow" Arch: Convex up. Center is highest point.

                            // Radius:
              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            // Position:
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;

                            // Spread angle:
              const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
              const step = spreadAngle / (TOTAL_IMAGES - 1);

              // Apply Scroll Rotation (Shuffle) with Bounds
                            // We want to clamp rotation so images don't disappear.
                            // Map scroll range [600, 3000] to a limited rotation range.
                            // Range: [-spreadAngle/2, spreadAngle/2] keeps them roughly in view.
                            // We map 0 -> 1 (progress of scroll loop) to this range.

                            // Note: rotateValue comes from smoothScrollRotate which maps [600, 3000] -> [0, 360]
                            // We need to adjust that mapping in the hook above, OR adjust it here.
                            // Better to adjust it here relative to the spread.

                            // Let's interpret rotateValue (0 to 360) as a progress 0 to 1
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);

                            // Calculate bounded rotation:
                            // Move from 0 (centered) to -spreadAngle (all the way left) or similar.
                            // Let's allow scrolling through the list.
                            // Total sweep needed to see all items if we start at one end?
                            // If we start centered, we can go +/- spreadAngle/2.

                            // User wants to "stop on the last image".
                            // Let's map scroll to: 0 -> -spreadAngle (shifts items left)
                            const maxRotation = spreadAngle * 0.8; // Don't go all the way, keep last item visible
              const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8, // Increased scale for active state
              };

              // C. Interpolate (Morph)
              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                                phase={introPhase} // Pass intro phase for initial animations
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

