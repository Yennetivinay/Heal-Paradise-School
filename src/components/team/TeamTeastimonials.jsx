import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

// Calculate gap based on container width (from circular testimonials)
function calculateGap(width) {
  // Mobile: smaller gap for small screens
  if (width < 640) {
    return 30; // Small gap for mobile
  }
  // Tablet: medium gap
  if (width < 1024) {
    return 40;
  }
  // Desktop: adjusted for portrait images (more visible side images)
  const minWidth = 260;
  const maxWidth = 300;
  const minGap = 45;
  const maxGap = 60;
  if (width >= maxWidth) return maxGap;
  if (width <= minWidth) return minGap;
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const TeamTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}) => {
  const [active, setActive] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef(null);
  const desktopImageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const startAutoplay = useCallback(() => {
    if (autoplay && autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
      }, 9000);
    }
  }, [autoplay, testimonials.length]);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    // Restart autoplay after manual navigation
    if (autoplay) {
      setTimeout(() => {
        startAutoplay();
      }, 100);
    }
  }, [testimonials.length, autoplay, startAutoplay]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    // Restart autoplay after manual navigation
    if (autoplay) {
      setTimeout(() => {
        startAutoplay();
      }, 100);
    }
  }, [testimonials.length, autoplay, startAutoplay]);

  const isActive = (index) => {
    return index === active;
  };

  // Responsive width tracking
  useEffect(() => {
    function handleResize() {
      // Check desktop container first (for web view), then mobile
      const container = desktopImageContainerRef.current || imageContainerRef.current;
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [startAutoplay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, testimonials.length, handleNext, handlePrev]);

  // Get image style for circular positioning (shows 3 images: left, center, right)
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === active;
    const isLeft = (active - 1 + testimonials.length) % testimonials.length === index;
    const isRight = (active + 1) % testimonials.length === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.9) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.9) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  return (
    <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-6 relative z-10 overflow-visible", className)}>
      {/* Mobile View - Circular Testimonials Style */}
      <div className="relative flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:hidden">
        {/* Image Section - Circular Layout - Portrait */}
        <div className="relative mx-auto overflow-visible">
          <div
            ref={imageContainerRef}
            className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[280px] sm:h-[320px] md:h-[360px] overflow-visible"
            style={{ perspective: '1000px' }}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100/50 via-brand-100/30 to-transparent rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl -z-10" />
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-brand-200/20 to-brand-200/20 rounded-xl sm:rounded-[2rem] blur-xl sm:blur-2xl -z-10" />

            {/* Circular testimonials - shows 3 images at once */}
            {testimonials.map((testimonial, index) => {
              const style = getImageStyle(index);
              return (
                <img
                  key={testimonial.src || index}
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl backdrop-blur-sm"
                  loading="lazy"
                  decoding="async"
                  style={style}
                />
              );
            })}
          </div>
        </div>

        {/* Name and Designation - Below Image, Centered */}
        <motion.div
          key={`name-${active}`}
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -20,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-center space-y-2"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {testimonials[active].name}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-brand-600 font-semibold">
            {testimonials[active].designation}
          </p>
        </motion.div>

        {/* Description/Quote - Below Images */}
        <motion.div
          key={`quote-${active}`}
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -20,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-center max-w-2xl mx-auto min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center mt-4 sm:mt-6"
        >
          <div className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-medium px-2">
            {testimonials[active].quote}
          </div>
        </motion.div>

        {/* Navigation Controls - Arrows and Dots - Bottom */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 pt-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="group relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-md sm:shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/70 border border-slate-700/80 flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 hover:border-brand-500/50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-brand-400 transition-colors duration-300 group-hover:translate-x-[-2px]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  isActive(index)
                    ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-gradient-to-r from-brand-500 to-brand-500 shadow-md shadow-brand-500/50"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-600 hover:bg-slate-500"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-md sm:shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/70 border border-slate-700/80 flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 hover:border-brand-500/50"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-brand-400 transition-colors duration-300 group-hover:translate-x-[2px]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Desktop View - 2 Column Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start overflow-visible">
        {/* Image Section - Circular Testimonials Style - Portrait */}
        <div className="relative flex items-start justify-center overflow-visible px-16 h-[320px] lg:h-[360px]">
          <div
            ref={desktopImageContainerRef}
            className="relative w-[260px] lg:w-[300px] h-[320px] lg:h-[360px]"
            style={{ perspective: '1000px', overflow: 'visible' }}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100/50 via-brand-100/30 to-transparent rounded-3xl blur-3xl -z-10" />
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-200/20 to-brand-200/20 rounded-[2rem] blur-2xl -z-10" />

            {/* Circular testimonials - shows 3 images at once */}
            {testimonials.map((testimonial, index) => {
              const style = getImageStyle(index);
              return (
                <img
                  key={testimonial.src || index}
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-3xl shadow-2xl backdrop-blur-sm"
                  loading="lazy"
                  decoding="async"
                  style={style}
                />
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center space-y-4 lg:space-y-2 relative z-10 h-[320px] lg:h-[360px] -mt-4 lg:-mt-6">
          <motion.div
            key={active}
            initial={{
              y: 30,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -30,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="space-y-4 lg:space-y-5"
          >
            {/* Quote Icon */}
            <div className="flex items-start">
              <div className="text-4xl lg:text-5xl font-serif text-brand-200/60 leading-none">"</div>
            </div>

            {/* Quote Text */}
            <div className="text-base lg:text-lg xl:text-xl text-slate-700 leading-relaxed font-medium pl-3 min-h-[120px] lg:min-h-[140px] flex items-center mt-4 lg:mt-6">
              {testimonials[active].quote}
            </div>

            {/* Name and Designation */}
            <div className="pl-3 pt-3 border-l-2 border-gradient-to-b from-brand-500 to-brand-500 border-brand-500">
              <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                {testimonials[active].name}
              </h3>
              <p className="text-base lg:text-lg text-brand-600 font-semibold">
                {testimonials[active].designation}
              </p>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 pl-3 pt-2">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="group relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/70 border border-slate-700/80 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-brand-500/50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-slate-300 group-hover:text-brand-400 transition-colors duration-300 group-hover:translate-x-[-2px]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="group relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/70 border border-slate-700/80 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-brand-500/50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-400 transition-colors duration-300 group-hover:translate-x-[2px]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2 ml-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    isActive(index)
                      ? "w-8 h-2 bg-gradient-to-r from-brand-500 to-brand-500 shadow-md shadow-brand-500/50"
                      : "w-2 h-2 bg-slate-600 hover:bg-slate-500"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
