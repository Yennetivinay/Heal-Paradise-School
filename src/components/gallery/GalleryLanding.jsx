import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ images = [] }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pinchDistance, setPinchDistance] = useState(null);
  const autoPlayTimerRef = useRef(null);
  const lightboxRef = useRef(null);
  const imageRef = useRef(null);

  // Default sample images if none provided
  const displayImages =
    images.length > 0
      ? images
      : [
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          title: "Mountain Landscape",
          description: "Beautiful mountain view",
        },
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
          title: "Forest Path",
          description: "Serene forest trail",
        },

        {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
          title: "Lake View",
          description: "Peaceful lake scenery",
        },
        {
          url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
          title: "Sunset",
          description: "Golden hour beauty",
        },

        {
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
          title: "Nature Trail",
          description: "Hiking adventure",
        },
        {
          url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
          title: "Sunset",
          description: "Golden hour beauty",
        },
        {
          url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
          title: "Wilderness",
          description: "Wild and free",
        },
        {
          url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
          title: "Mountain Peak",
          description: "Reaching new heights",
        },
        {
          url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
          title: "Ocean Waves",
          description: "Coastal beauty",
        },
        {
          url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
          title: "Desert Dunes",
          description: "Sandy landscapes",
        },
      ];

  // Preload ALL images instantly for zero lag - optimized for performance
  useEffect(() => {
    if (displayImages.length === 0) return;

    const preloadLinks = [];

    // Preload all images immediately with priority
    displayImages.forEach((image, index) => {
      const img = new Image();
      // Set fetchPriority if supported
      if ('fetchPriority' in img) {
        img.fetchPriority = 'high';
      }
      img.src = image.url;
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
      // Don't wait for error, just mark as loaded attempt
      img.onerror = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
    });

    // Add preload links to head for browser-level preloading (only first 6 for LCP)
    displayImages.slice(0, 6).forEach((image) => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image.url;
        if ('fetchPriority' in link) {
          link.fetchPriority = 'high';
        }
        document.head.appendChild(link);
        preloadLinks.push(link);
      } catch (e) {
        // Silently handle preload link errors
      }
    });

    return () => {
      // Cleanup preload links on unmount
      preloadLinks.forEach(link => link.remove());
    };
  }, [displayImages.length]); // Only depend on length to avoid re-running

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Auto-play carousel - defined after displayImages
  useEffect(() => {
    // Clear any existing timer
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    const imageCount = displayImages.length;
    if (imageCount === 0) return;

    // Set up auto-play (change image every 4 seconds)
    autoPlayTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % imageCount);
    }, 4000);

    // Cleanup on unmount
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [displayImages]);

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCarousel();
    }
    if (isRightSwipe) {
      prevCarousel();
    }

    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);

    // Reset auto-play timer after manual swipe
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    autoPlayTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % displayImages.length);
    }, 4000);
  };

  // Lightbox functions
  const openLightbox = (index) => {
    if (index < 0 || index >= displayImages.length) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
    // Pause carousel autoplay when lightbox opens
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    // Restore background scrolling when lightbox closes
    document.body.style.overflow = '';
    // Resume carousel autoplay when lightbox closes
    if (displayImages.length > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % displayImages.length);
      }, 4000);
    }
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Reset zoom when image changes
  useEffect(() => {
    if (lightboxOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [lightboxIndex, lightboxOpen]);

  // Cleanup: restore body scroll on unmount if lightbox was open
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Calculate distance between two touch points
  const getTouchDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch events for pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      setPinchDistance(distance);
    } else if (e.touches.length === 1 && zoom > 1) {
      // Single touch drag when zoomed
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchDistance !== null) {
      // Pinch zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchDistance;
      const newZoom = Math.max(1, Math.min(5, zoom * scale));
      setZoom(newZoom);
      setPinchDistance(distance);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Pan when zoomed
      e.preventDefault();
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setPinchDistance(null);
    setIsDragging(false);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (!lightboxOpen) return;
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(1, Math.min(5, zoom + delta));
    setZoom(newZoom);

    // Reset pan if zoomed out to 1
    if (newZoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  // Handle mouse drag for panning
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, displayImages.length]);


  return (
    <div className="w-full">
      {/* Mobile Carousel - Enhanced */}
      <div className="md:hidden w-full">
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-200/40 shadow-2xl bg-gradient-to-br from-white via-brand-50/30 to-white">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-100/20 via-transparent to-brand-100/20 rounded-3xl blur-2xl -z-10"></div>

          <div
            className="relative h-[350px] overflow-hidden rounded-3xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ backgroundColor: '#f8fafc' }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 w-full h-full"
                style={{
                  willChange: 'opacity',
                  backgroundColor: '#f1f5f9'
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  style={{ backgroundColor: '#f1f5f9' }}
                  onClick={() => openLightbox(carouselIndex)}
                >
                  <img
                    src={displayImages[carouselIndex].url}
                    alt={displayImages[carouselIndex].title || `Gallery image ${carouselIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    width="1200"
                    height="800"
                    style={{
                      opacity: imagesLoaded.has(carouselIndex) ? 1 : 1,
                      objectPosition: 'center center',
                      minWidth: '100%',
                      minHeight: '100%',
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none">
                    <div className="absolute bottom-16 left-0 right-0 px-6 pb-2 text-white pointer-events-none">
                      {displayImages[carouselIndex].title && (
                        <h3 className="text-xl font-bold mb-2 drop-shadow-2xl">{displayImages[carouselIndex].title}</h3>
                      )}
                      {displayImages[carouselIndex].description && (
                        <p className="text-sm text-white/95 drop-shadow-lg leading-relaxed">{displayImages[carouselIndex].description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots Indicator - Enhanced */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`rounded-full transition-all duration-300 ${index === carouselIndex
                    ? 'bg-white w-8 h-2 shadow-lg shadow-white/50'
                    : 'bg-white/50 w-2 h-2 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Gallery Grid - Enhanced Beautiful Layout */}
      <div className="hidden md:block w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-white via-brand-50/30 to-white rounded-3xl border-2 border-brand-200/40 shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/20 via-transparent to-brand-100/20 rounded-3xl blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-200/30 to-transparent rounded-full blur-3xl -mr-48 -mt-48 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-200/30 to-transparent rounded-full blur-3xl -ml-48 -mb-48 -z-10"></div>

        <div className="grid grid-cols-4 gap-4 relative z-10" style={{ gridTemplateRows: '320px 230px 320px', gridAutoRows: 'minmax(140px, auto)' }}>
          {displayImages.slice(0, 10).map((image, index) => {
            // Layout pattern matching the sketch:
            // Row 1: Large (cols 1-2) | Medium (col 3) | Medium (col 4)
            // Row 2: Small (col 1) | Small (col 2) | Medium (col 3) | Medium (col 4)
            // Row 3: Small (col 1) | Small (col 2) | Large (cols 3-4)
            const getImageStyle = () => {
              const positions = [
                { gridColumn: '1 / 3', gridRow: '1' }, // 0: Top-left Large
                { gridColumn: '3', gridRow: '1' }, // 1: Top-right Upper
                { gridColumn: '4', gridRow: '1' }, // 2: Top-right Upper (second)
                { gridColumn: '1', gridRow: '2' }, // 3: Middle-left Upper
                { gridColumn: '2', gridRow: '2' }, // 4: Middle-left Upper (second)
                { gridColumn: '3', gridRow: '2' }, // 5: Middle-right Upper
                { gridColumn: '4', gridRow: '2' }, // 6: Mountain Peak - smaller
                { gridColumn: '1 / 3', gridRow: '3' }, // 0: Top-left Large
                { gridColumn: '3', gridRow: '3' }, // 1: Top-right Upper
                { gridColumn: '4', gridRow: '3' },
              ];
              return positions[index] || {};
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-white/50"
                style={getImageStyle()}
              >
                {/* Image */}
                <div
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                    width="800"
                    height="600"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Gradient Overlay - Enhanced */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Brand Color Accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:via-brand-500/5 group-hover:to-brand-500/10 transition-all duration-500"></div>

                  {/* Content Overlay - Enhanced */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {image.title && (
                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm text-white/95 drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-150">{image.description}</p>
                    )}
                  </div>

                  {/* Shine Effect - Enhanced */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"></div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-500/0 to-transparent group-hover:from-brand-500/20 transition-all duration-500"></div>

                  {/* Click Indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/0 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {typeof document !== 'undefined' && document.body && createPortal(
        <AnimatePresence mode="wait">
          {lightboxOpen && displayImages.length > 0 && displayImages[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md flex items-center justify-center"
              onClick={(e) => {
                // Close lightbox when clicking outside the image container
                if (e.target === e.currentTarget) {
                  closeLightbox();
                }
              }}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              ref={lightboxRef}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full flex items-center justify-center p-4"
                onClick={(e) => {
                  // Close lightbox when clicking on the container (outside the image)
                  if (e.target === e.currentTarget) {
                    closeLightbox();
                  }
                  // Reset zoom on double click
                  if (e.detail === 2) {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }
                }}
                style={{ touchAction: 'none' }}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 shadow-lg border border-white/20 transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Previous Button */}
                {displayImages.length > 1 && (
                  <button
                    onClick={prevLightbox}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 shadow-lg border border-white/20 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Next Button */}
                {displayImages.length > 1 && (
                  <button
                    onClick={nextLightbox}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 shadow-lg border border-white/20 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Image Counter */}
                {displayImages.length > 1 && (
                  <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-medium shadow-lg border border-white/20">
                    {lightboxIndex + 1} / {displayImages.length}
                  </div>
                )}

                {/* Main Image - Zoomable */}
                <motion.img
                  key={lightboxIndex}
                  ref={imageRef}
                  src={displayImages[lightboxIndex].url}
                  alt={displayImages[lightboxIndex].title || `Gallery image ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg select-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: zoom,
                    x: pan.x,
                    y: pan.y
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: zoom === 1 ? 0.2 : 0,
                    ease: "easeOut"
                  }}
                  style={{
                    transformOrigin: 'center center',
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Image Info - Enhanced */}
                {(displayImages[lightboxIndex].title || displayImages[lightboxIndex].description) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-3 md:py-4 rounded-2xl bg-gradient-to-br from-black/90 via-black/85 to-black/90 backdrop-blur-xl text-white text-center w-[90%] sm:w-[85%] md:max-w-lg shadow-2xl border-2 border-white/30"
                  >
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full"></div>

                    {displayImages[lightboxIndex].title && (
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{displayImages[lightboxIndex].title}</h3>
                    )}
                    {displayImages[lightboxIndex].description && (
                      <p className="text-sm text-white/95 leading-relaxed drop-shadow-md">{displayImages[lightboxIndex].description}</p>
                    )}

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}



