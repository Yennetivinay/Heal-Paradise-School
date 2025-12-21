import { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";

// Testimonial data structure
// {
//   id: number,
//   name: string,
//   rating: number (1-5),
//   text: string,
//   logo?: string (optional logo URL)
// }

const TestimonialCarousel = ({ 
  data = [], 
  cardsPerView = 3,
  cardsPerViewMobile = 2,
  showPagination = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [responsiveCardsPerView, setResponsiveCardsPerView] = useState(cardsPerView);
  const containerRef = useRef(null);

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


  const nextSlide = () => {
    if (isAnimating || !data || data.length <= responsiveCardsPerView) return;

    setIsAnimating(true);
    // Move by one full slide (responsiveCardsPerView cards)
    const nextIndex = currentIndex + responsiveCardsPerView;
    // If we've reached the end, loop back to start
    if (nextIndex >= data.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isAnimating || !data || data.length <= responsiveCardsPerView) return;

    setIsAnimating(true);
    // Move back by one full slide (responsiveCardsPerView cards)
    const prevIndex = currentIndex - responsiveCardsPerView;
    // If we've gone before the start, go to the last slide
    if (prevIndex < 0) {
      const lastSlideStart = Math.floor((data.length - 1) / responsiveCardsPerView) * responsiveCardsPerView;
      setCurrentIndex(lastSlideStart);
    } else {
      setCurrentIndex(prevIndex);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating) return;
    // slideIndex is the page number (0, 1, 2, etc.)
    // Convert to card index
    const cardIndex = slideIndex * responsiveCardsPerView;
    setCurrentIndex(cardIndex);
  };

  // Calculate which cards to show (always show exactly responsiveCardsPerView cards)
  const getVisibleCards = () => {
    if (!data || data.length === 0) return [];

    const visibleCards = [];
    const totalCards = data.length;

    // Show exactly responsiveCardsPerView cards starting from currentIndex
    for (let i = 0; i < responsiveCardsPerView; i++) {
      const index = currentIndex + i;
      if (index < totalCards) {
        visibleCards.push({ ...data[index], displayIndex: index });
      }
    }

    return visibleCards;
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(data.length / responsiveCardsPerView);
  const currentPage = Math.floor(currentIndex / responsiveCardsPerView);

  if (!data || data.length === 0) {
    return <div className="text-center text-slate-600 py-12">No testimonials available</div>;
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
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 z-20 bg-black/80 hover:bg-black text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnimating}
              aria-label="Next testimonial"
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
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >
            {/* Render all slides */}
            {Array.from({ length: totalPages }).map((_, slideIndex) => (
              <div
                key={`slide-${slideIndex}`}
                className="flex-shrink-0 w-full"
                style={{ display: 'flex' }}
              >
                {data.slice(slideIndex * responsiveCardsPerView, (slideIndex + 1) * responsiveCardsPerView).map((testimonial, cardIndex) => (
                  <div
                    key={`testimonial-${testimonial.id || slideIndex * responsiveCardsPerView + cardIndex}`}
                    className="flex-shrink-0 px-3"
                    style={{
                      width: `${100 / responsiveCardsPerView}%`,
                    }}
                  >
                <div className="bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Top Section: Logo, Name, Quote Icon */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {testimonial.logo ? (
                        <img
                          src={testimonial.logo}
                          alt="School Logo"
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg sm:text-xl">H</span>
                        </div>
                      )}
                    </div>

                    {/* Name - Centered */}
                    <div className="flex-1 text-center px-2">
                      <h3 className="text-white font-bold text-base sm:text-lg md:text-xl">
                        {testimonial.name}
                      </h3>
                    </div>

                    {/* Quote Icon */}
                    <div className="flex-shrink-0">
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4 sm:mb-6 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < (testimonial.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <div className="flex-1">
                    <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                      {testimonial.text}
                    </p>
                  </div>
                </div>
              </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {showPagination && data.length > responsiveCardsPerView && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * responsiveCardsPerView)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "bg-brand-500 w-6 sm:w-8"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;

