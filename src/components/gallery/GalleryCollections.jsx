import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaToggle } from './MediaToggle';
import { X, ChevronLeft, ChevronRight, Download, Share2, Maximize, ZoomIn, Grid, List, Play, Pause } from 'lucide-react';

const categories = ['All', 'Events', 'Sports', 'Academics'];

const GalleryCollections = ({ images = [], onModalOpen, onModalClose }) => {
  const [mediaType, setMediaType] = useState('images');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [lightboxImages, setLightboxImages] = useState(images);
  const lightboxRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter images based on category and media type
  const filteredImages = images.filter((image) => {
    const categoryMatch = selectedCategory === 'All' || image.category === selectedCategory;
    const mediaTypeMatch = mediaType === 'images' 
      ? (image.type === 'image' || !image.type) // Default to image if type not specified
      : image.type === 'video';
    return categoryMatch && mediaTypeMatch;
  });

  const featuredImages = images.filter(img => {
    const mediaTypeMatch = mediaType === 'images' 
      ? (img.type === 'image' || !img.type) // Default to image if type not specified
      : img.type === 'video';
    return img.featured && mediaTypeMatch;
  });

  // Handle opening lightbox
  const openLightbox = (index, fromFeatured = false) => {
    // Ensure index is valid
    if (index < 0 || index >= images.length) {
      return;
    }
    
    if (fromFeatured) {
      // If opened from featured images, only show featured images (already filtered by mediaType)
      setLightboxImages(featuredImages);
      const featuredIndex = featuredImages.findIndex(img => img.src === images[index].src);
      setCurrentImageIndex(featuredIndex >= 0 ? featuredIndex : 0);
    } else {
      // If opened from regular gallery, show only filtered images based on current filters
      setLightboxImages(filteredImages);
      const filteredIndex = filteredImages.findIndex(img => img.src === images[index].src);
      setCurrentImageIndex(filteredIndex >= 0 ? filteredIndex : 0);
    }
    
    // Set lightbox open state immediately
    setLightboxOpen(true);
    
    // Notify parent component
    if (onModalOpen) {
      onModalOpen();
    }
  };

  // Handle closing lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    // Notify parent component
    if (onModalClose) onModalClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);

  // Scroll active thumbnail into view (top-aligned)
  useEffect(() => {
    if (!lightboxOpen) return;
    const el = thumbnailRefs.current[currentImageIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentImageIndex, lightboxOpen]);

  // Focus management for accessibility
  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
      // Force focus to lightbox for accessibility
      requestAnimationFrame(() => {
        if (lightboxRef.current) {
          lightboxRef.current.focus();
        }
      });
    }
  }, [lightboxOpen]);

  // Autoplay functionality
  useEffect(() => {
    if (!lightboxOpen || !isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [lightboxOpen, isAutoplay, currentImageIndex, lightboxImages.length]);

  // Download image
  const downloadImage = async (imageSrc, imageAlt) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageAlt.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Silently handle download errors
    }
  };

  // Share image
  const shareImage = async () => {
    const image = lightboxImages[currentImageIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.alt,
          text: `Check out this image: ${image.alt}`,
          url: image.src,
        });
      } catch (error) {
        // Silently handle share errors
      }
    } else {
      navigator.clipboard.writeText(image.src);
      alert('Image URL copied to clipboard!');
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Silently handle fullscreen errors
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Image zoom
  const handleZoom = (delta) => {
    setImageScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // Reset zoom when image changes
  useEffect(() => {
    setImageScale(1);
  }, [currentImageIndex]);

  return (
    <>
      {/* Collections Section */}
      <section className="relative py-4 sm:py-6 md:py-8 lg:py-10 -mt-40 sm:-mt-60 md:-mt-50 lg:-mt-80 xl:-mt-90 w-full">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-2 text-center px-2">
              Explore Our <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Collections</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 text-center max-w-2xl mx-auto px-2 mt-1">
              Browse through our curated collection of photos and videos showcasing school life, events, and achievements
            </p>
          </motion.div>

          {/* Filters Section */}
          <div className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8 md:mb-10 px-2">
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg scale-105'
                      : 'bg-white/90 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Media Toggle and View Mode */}
            <div className="flex justify-center items-center gap-3">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full p-1.5 sm:p-2 shadow-xl">
                <MediaToggle 
                  value={mediaType}
                  onChange={setMediaType}
                />
              </div>
              <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full p-1.5 shadow-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Lightbox Gallery Section */}
          <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4" 
              : "flex flex-col gap-4 max-w-2xl mx-auto"
            }>
              {filteredImages.map((image, index) => {
                const originalIndex = images.findIndex(img => img.src === image.src);
                return (
                  <motion.div
                    key={originalIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`gallery-image-container relative group ${viewMode === 'list' ? 'flex gap-4 items-center bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md' : ''}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'w-full aspect-square'} overflow-hidden rounded-lg`}>
                      {image.type === 'video' ? (
                        <video
                          src={image.src}
                          className="object-cover cursor-pointer w-full h-full hover:opacity-90 transition-all duration-300 rounded-lg group-hover:scale-105 group-hover:shadow-xl"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openLightbox(originalIndex);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          preload="metadata"
                          data-gallery-image="true"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover cursor-pointer w-full h-full hover:opacity-90 transition-all duration-300 rounded-lg group-hover:scale-105 group-hover:shadow-xl"
                          loading={index < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openLightbox(originalIndex);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          style={{ imageRendering: 'auto' }}
                          data-gallery-image="true"
                        />
                      )}
                      {image.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/80 transition-colors">
                            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                    </div>
                    {viewMode === 'list' && (
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{image.alt}</h4>
                        <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded-full">{image.category}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No {mediaType} found matching your search.</p>
              </div>
            )}
          </div>

          {/* Featured Section */}
          {featuredImages.length > 0 && selectedCategory === 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-5 text-center">
                <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Featured</span> {mediaType === 'images' ? 'Images' : 'Videos'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-5xl mx-auto">
                {featuredImages.map((image, index) => {
                  const imageIndex = images.findIndex(img => img.src === image.src);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="gallery-image-container relative group cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLightbox(imageIndex, true);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      data-gallery-image="true"
                    >
                      <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-2xl ring-2 ring-brand-500/50 group-hover:ring-brand-500 transition-all duration-300 bg-gradient-to-br from-brand-50 to-brand-50 p-1">
                        {image.type === 'video' ? (
                          <video
                            src={image.src}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                            loading="lazy"
                            style={{ imageRendering: 'auto' }}
                          />
                        )}
                        {image.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none drop-shadow-lg">
                          {image.alt}
                        </div>
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Featured
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal - Centered in viewport (screen center) */}
      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center px-2 sm:px-4"
              onClick={(e) => {
                // Close modal when clicking on backdrop (not on modal content)
                if (e.target === e.currentTarget) {
                  closeLightbox();
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Image Gallery"
              tabIndex={0}
              ref={lightboxRef}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
            <motion.div
              className="relative flex w-full max-w-6xl flex-col md:flex-row rounded-2xl bg-white shadow-2xl overflow-hidden h-[90vh] md:h-[85vh]"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                maxHeight: '90vh',
                maxWidth: '95vw',
                margin: 'auto',
                cursor: 'default'
              }}
            >
              {/* Main content */}
              <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden min-h-0">
                {/* Image area */}
                <div 
                  className="relative flex-1 flex items-center justify-center bg-slate-900 min-h-0 flex-shrink-0"
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchMove={(e) => {
                    touchEndX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={() => {
                    if (!touchStartX.current || !touchEndX.current) return;
                    
                    const distance = touchStartX.current - touchEndX.current;
                    const minSwipeDistance = 50; // Minimum distance for a swipe
                    
                    if (Math.abs(distance) > minSwipeDistance) {
                      if (distance > 0) {
                        // Swiped left - go to next image
                        nextImage();
                      } else {
                        // Swiped right - go to previous image
                        prevImage();
                      }
                    }
                    
                    // Reset touch positions
                    touchStartX.current = 0;
                    touchEndX.current = 0;
                  }}
                >
                  {/* Image counter - top left */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-sm font-medium text-white/90">
                      {currentImageIndex + 1} / {lightboxImages.length}
                    </span>
                  </div>

                  {/* Action buttons (play, download, share, fullscreen) - top right */}
                  <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAutoplay(!isAutoplay);
                      }}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                      aria-label={isAutoplay ? 'Pause slideshow' : 'Play slideshow'}
                    >
                      {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(lightboxImages[currentImageIndex].src, lightboxImages[currentImageIndex].alt);
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareImage();
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Share image"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Navigation arrows (overlay on sides) */}
                  <button
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Main media (image or video) */}
                  <div className="relative w-full h-full flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
                    {lightboxImages[currentImageIndex]?.type === 'video' ? (
                      <motion.video
                        key={currentImageIndex}
                        src={lightboxImages[currentImageIndex].src}
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg"
                        controls
                        style={{
                          transform: `scale(${imageScale})`,
                          transformOrigin: 'center center',
                        }}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Your browser does not support the video tag.
                      </motion.video>
                    ) : (
                      <motion.img
                        key={currentImageIndex}
                        src={lightboxImages[currentImageIndex].src}
                        alt={lightboxImages[currentImageIndex].alt}
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg"
                        style={{
                          transform: `scale(${imageScale})`,
                          transformOrigin: 'center center',
                        }}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.25}
                      />
                    )}
                  </div>

                  {/* Zoom controls – bottom center (only for images) */}
                  {lightboxImages[currentImageIndex]?.type !== 'video' && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoom(-0.2);
                      }}
                      className="p-1 rounded-full text-white hover:bg-white/15 transition-colors"
                      aria-label="Zoom out"
                    >
                      <ZoomIn className="w-4 h-4 rotate-180" />
                    </button>
                    <span className="text-xs font-medium text-white min-w-[3rem] text-center">
                      {Math.round(imageScale * 100)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoom(0.2);
                      }}
                      className="p-1 rounded-full text-white hover:bg-white/15 transition-colors"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageScale(1);
                      }}
                      className="px-2 py-0.5 text-[11px] font-medium text-white/90 hover:bg-white/15 rounded-full transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                  )}
                </div>

                {/* Thumbnails strip */}
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200/70 bg-white flex flex-col shadow-lg flex-shrink-0 h-[220px] md:h-full">
                  <div className="px-4 pt-4 pb-3 border-b border-slate-200/50 flex items-center justify-between flex-shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5" /> Thumbnails
                    </p>
                    <button
                      className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      aria-label="Close gallery"
                      onClick={closeLightbox}
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Close</span>
                    </button>
                  </div>
                  <div 
                    className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-2 modal-thumbnails-scrollbar min-h-0"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      touchAction: 'pan-y',
                      overscrollBehavior: 'contain',
                    }}
                    onWheel={(e) => {
                      // Allow scrolling with mouse wheel anywhere in the thumbnail area
                      e.stopPropagation();
                    }}
                    onTouchMove={(e) => {
                      // Allow touch scrolling in the thumbnail area
                      e.stopPropagation();
                    }}
                  >
                    {lightboxImages.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-full flex items-center gap-3 rounded-lg border px-2 py-2 text-left transition-all ${
                          index === currentImageIndex
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        ref={(el) => { thumbnailRefs.current[index] = el; }}
                      >
                        {item.type === 'video' ? (
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                            <video
                              src={item.src}
                              className="h-full w-full object-cover"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <span className="line-clamp-2 text-sm text-slate-700 font-medium flex-1 min-w-0">
                          {item.alt}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Mobile nav buttons at bottom */}
                  <div className="flex md:hidden items-center justify-between px-3 py-2 border-t border-slate-200/70 bg-white/90">
                    <button
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-black transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-black transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
};

export default GalleryCollections;