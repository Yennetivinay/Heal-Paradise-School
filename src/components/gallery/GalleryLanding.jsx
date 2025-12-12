import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ images = [] }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayTimerRef = useRef(null);

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

  // Preload images to prevent white screen during transitions
  useEffect(() => {
    displayImages.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
    });
  }, []);

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

  return (
    <div className="w-full">
      {/* Mobile Carousel */}
      <div className="md:hidden w-full">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl" style={{ backgroundColor: '#f1f5f9' }}>
          <div 
            className="relative h-[300px] overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ backgroundColor: '#f1f5f9' }}
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
                  className="relative w-full h-full overflow-hidden"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <img
                    src={displayImages[carouselIndex].url}
                    alt={displayImages[carouselIndex].title || `Gallery image ${carouselIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    style={{
                      opacity: imagesLoaded.has(carouselIndex) ? 1 : 0.7,
                      transition: 'opacity 0.5s ease-out',
                      objectPosition: 'center center',
                      minWidth: '100%',
                      minHeight: '100%',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  {!imagesLoaded.has(carouselIndex) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse pointer-events-none" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-8 left-0 right-0 p-4 text-white">
                      {displayImages[carouselIndex].title && (
                        <h3 className="text-lg font-bold mb-1">{displayImages[carouselIndex].title}</h3>
                      )}
                      {displayImages[carouselIndex].description && (
                        <p className="text-sm text-white/90">{displayImages[carouselIndex].description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === carouselIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Gallery Grid - Layout Matching Sketch */}
      <div className="hidden md:block w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-3xl border border-slate-200/50 shadow-xl">
        <div className="grid grid-cols-4 gap-3" style={{ gridTemplateRows: '300px auto 300px', gridAutoRows: 'minmax(120px, auto)' }}>
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
                { gridColumn: '4', gridRow: '2'}, // 6: Mountain Peak - smaller
                { gridColumn: '1 / 3', gridRow: '3' }, // 0: Top-left Large
                { gridColumn: '3', gridRow: '3' }, // 1: Top-right Upper
                { gridColumn: '4', gridRow: '3' },
              ];
              return positions[index] || {};
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 shadow-md hover:shadow-xl transition-all duration-500 hover:scale-[1.03]"
                style={getImageStyle()}
              >
            {/* Image */}
            <div 
              className="relative w-full h-full overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                {image.title && (
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{image.title}</h3>
                )}
                {image.description && (
                  <p className="text-sm text-white/90 drop-shadow-md">{image.description}</p>
                )}
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}



