import { useState, useEffect, useRef } from "react";
import { CalendarCheck } from "lucide-react";

// Timeline data structure
// {
//   id: number,
//   year: string,
//   title: string,
//   description: string
// }

const TimelineCarousel = ({ 
  data = [], 
  cardsPerView = 4,
  cardsPerViewMobile = 2,
  showPagination = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [responsiveCardsPerView, setResponsiveCardsPerView] = useState(cardsPerView);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

  // Handle responsive cardsPerView
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setResponsiveCardsPerView(cardsPerViewMobile);
      } else {
        setResponsiveCardsPerView(cardsPerView);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [cardsPerView, cardsPerViewMobile]);

  // Auto-play: move one card at a time every 3 seconds
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear any existing interval
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    // Only start auto-play if not hovered
    if (!isHovered) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // If we've reached the end, reset to 0 seamlessly
          if (nextIndex >= data.length) {
            // Reset without animation for seamless loop
            setTimeout(() => {
              setCurrentIndex(0);
            }, 500);
            return nextIndex;
          }
          return nextIndex;
        });
      }, 3000); // Change card every 3 seconds
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [data.length, isHovered]);

  const nextSlide = () => {
    if (isAnimating || !data) return;

    setIsAnimating(true);
    // Move by one card
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isAnimating || !data) return;

    setIsAnimating(true);
    // Move back by one card
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    setCurrentIndex(prevIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating) return;
    setCurrentIndex(slideIndex);
  };

  if (!data || data.length === 0) {
    return <div className="text-center text-slate-600 py-12">No timeline data available</div>;
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Arrows */}
        {showArrows && data.length > responsiveCardsPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 z-20 bg-black/80 hover:bg-black text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnimating}
              aria-label="Previous timeline"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 z-20 bg-black/80 hover:bg-black text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnimating}
              aria-label="Next timeline"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Cards Container */}
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / responsiveCardsPerView)}%)`,
            }}
          >
            {/* Render all cards in a continuous loop for seamless scrolling */}
            {[...data, ...data, ...data].map((item, index) => {
              // Calculate the actual data index
              const dataIndex = index % data.length;
              return (
              <div
                key={`timeline-${item.id}-${index}`}
                className="flex-shrink-0 px-1.5 sm:px-3"
                style={{
                  width: `${100 / responsiveCardsPerView}%`,
                }}
              >
                {/* Timeline Card */}
                <div 
                  className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-brand-200/60 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Top Year Badge */}
                  <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white px-2 py-1.5 sm:px-4 sm:py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mx-auto">
                      <CalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">{item.year}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-2.5 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Timeline Connector Line (visual element) */}
                    <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-brand-100">
                    </div>
                  </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 via-brand-50/0 to-brand-50/0 group-hover:from-brand-50/50 group-hover:via-brand-50/30 group-hover:to-brand-50/50 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimelineCarousel;

