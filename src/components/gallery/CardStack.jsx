import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { cn } from "../../lib/utils"

const SWIPE_THRESHOLD = 50

export function CardStack({
  cards = [],
  className,
  onCardClick,
}) {
  const [expandedCard, setExpandedCard] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set())

  // Preload first few images
  useEffect(() => {
    if (!cards || cards.length === 0) return
    
    const preloadImages = cards.slice(0, 3).map(card => {
      if (card?.image) {
        const img = new Image()
        img.src = card.image
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, card.image]))
        }
        return img
      }
      return null
    }).filter(Boolean)
    
    return () => {
      preloadImages.forEach(img => {
        if (img && img.src) {
          img.src = ''
        }
      })
    }
  }, [cards])

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      const newIndex = (activeIndex + 1) % cards.length
      setActiveIndex(newIndex)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      const newIndex = (activeIndex - 1 + cards.length) % cards.length
      setActiveIndex(newIndex)
    }

    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }

  const getLayoutStyles = (stackPosition) => {
    return {
      top: stackPosition * 6,
      left: stackPosition * 6,
      zIndex: cards.length - stackPosition,
      rotate: (stackPosition - 1) * 2,
    }
  }

  const containerStyles = "relative h-64 w-64 md:h-80 md:w-80"

  const displayCards = getStackOrder()

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No gallery items to display</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <LayoutGroup>
        <motion.div layout className={cn(containerStyles, "mx-auto")}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card, cardIndex) => {
              if (!card || !card.id) return null
              const styles = getLayoutStyles(card.stackPosition || 0)
              const isExpanded = expandedCard === card.id
              const isTopCard = (card.stackPosition || 0) === 0

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.05 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm p-4 overflow-hidden",
                    "hover:border-brand-500/50 transition-colors shadow-lg",
                    "absolute w-56 h-48 md:w-64 md:h-56",
                    isTopCard && "cursor-grab active:cursor-grabbing",
                    isExpanded && "ring-2 ring-brand-500",
                  )}
                  style={{
                    backgroundColor: card.color || undefined,
                  }}
                >
                  {card.image && (
                    <div className="absolute inset-0 -z-10">
                      {!loadedImages.has(card.image) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-500/20 to-brand-600/20 animate-pulse" />
                      )}
                      <img
                        src={card.image}
                        alt={card.title}
                        className={cn(
                          "w-full h-full object-cover opacity-30 transition-opacity duration-300",
                          loadedImages.has(card.image) ? "opacity-30" : "opacity-0"
                        )}
                        loading={card.stackPosition === 0 ? "eager" : "lazy"}
                        decoding="async"
                        onLoad={() => {
                          setLoadedImages(prev => new Set([...prev, card.image]))
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80" />
                    </div>
                  )}

                  <div className="flex items-start gap-3 relative z-10">
                    {card.icon && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-white">
                        {card.icon}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate">{card.title}</h3>
                      <p className="text-sm text-slate-300 mt-1 line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {isTopCard && (
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="text-xs text-slate-400/50">Swipe to navigate</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index)
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === activeIndex ? "w-4 bg-brand-500" : "w-1.5 bg-slate-600 hover:bg-slate-500",
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
