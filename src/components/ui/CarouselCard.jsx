import { useState, useEffect, useRef } from "react";

// Component for carousel with cards
const CarouselCard = ({ data = [], showCarousel = true, cardsPerView = 3, cardsPerViewMobile = 2 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSingleCard, setIsSingleCard] = useState(false);
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

  useEffect(() => {
    setIsSingleCard(data?.length === 1);
  }, [data]);

  // Calculate width percentage for each card based on responsiveCardsPerView
  const cardWidth = 75 / responsiveCardsPerView;

  const nextSlide = () => {
    if (isAnimating || !showCarousel || !data) return;

    // Don't allow navigation if there aren't enough cards
    if (data.length <= responsiveCardsPerView) return;

    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % data.length;

    if (containerRef.current) {
      // Apply slide out animation
      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      // After animation completes, reset position and update index
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = "translateX(0)";

          // Force reflow
          void containerRef.current.offsetWidth;

          setIsAnimating(false);
        }
      }, 500);
    }
  };

  const prevSlide = () => {
    if (isAnimating || !showCarousel || !data) return;
    if (data.length <= responsiveCardsPerView) return;

    setIsAnimating(true);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;

    if (containerRef.current) {
      // First move instantly to the right position
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      // Update the index immediately
      setCurrentIndex(prevIndex);

      // Force reflow
      void containerRef.current.offsetWidth;

      // Then animate back to center
      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = "translateX(0)";

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  // Calculate which cards to show
  const getVisibleCards = () => {
    if (!showCarousel || !data) return data || [];

    const visibleCards = [];
    const totalCards = data.length;

    // For next slide animation, we need current cards + 1 extra
    for (let i = 0; i < responsiveCardsPerView + 1; i++) {
      const index = (currentIndex + i) % totalCards;
      visibleCards.push(data[index]);
    }

    return visibleCards;
  };

  if (!data || data.length === 0) {
    return <div>No card data available</div>;
  }

  return (
    <div className="w-full px-4">
      <div className={`relative ${isSingleCard ? 'max-w-sm mx-auto' : 'w-full'}`}>
        {/* Carousel Controls */}
        {showCarousel && data.length > responsiveCardsPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50"
              disabled={isAnimating}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50"
              disabled={isAnimating}
              aria-label="Next slide"
            >
              →
            </button>
          </>
        )}

        {/* Cards Container Wrapper - limits visible area */}
        <div className="overflow-hidden">
          {/* Sliding Cards Container */}
          <div
            ref={containerRef}
            className="flex"
            style={{
              transform: "translateX(0)",
              width: showCarousel ? `${(responsiveCardsPerView + 1) * 100 / responsiveCardsPerView}%` : '100%'
            }}
          >
            {getVisibleCards().map((card, idx) => (
              <div
                key={`card-${currentIndex}-${idx}`}
                style={{
                  width: showCarousel ? `${100 / (responsiveCardsPerView + 1)}%` : `${100 / Math.min(responsiveCardsPerView, data.length)}%`
                }}
                className="px-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md group h-full">
                  <div className="w-full h-64">
                    <img
                      src={card.imgUrl || card.image}
                      alt={card.title || `Card ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/80 text-white p-4 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 overflow-y-auto">
                    {card.content && typeof card.content === 'string' ? (
                      <p className="text-sm">{card.content}</p>
                    ) : (
                      <div className="text-sm">{card.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;

