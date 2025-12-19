import {
  useScroll,
  useTransform,
  motion,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };
    
    // Initial measurement
    updateHeight();
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heightSpring = useSpring(heightTransform, springConfig);

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        Math.floor(latest * data.length),
        data.length - 1
      );
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, data.length]);

  return (
    <div
      className="w-full relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-200/20 to-brand-200/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-200/20 to-brand-200/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/50 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-brand-700 shadow-sm mb-3 md:mb-4">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Our Journey
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 px-2 leading-tight">
            <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">
              Milestones That
            </span>
            <br />
            <span className="text-slate-900">Shape Our Story</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            A timeline of growth, achievement, and transformation in our mission to provide world-class education
          </p>
        </motion.div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Animated timeline line - Mobile: left side, Desktop: centered */}
        <div className="hidden md:block absolute left-48 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent overflow-hidden">
          <motion.div
            style={{
              height: heightSpring,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-b from-brand-600 via-brand-500 to-brand-600 rounded-full shadow-lg"
          />
        </div>
        
        {/* Mobile timeline line */}
        <div className="md:hidden absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent overflow-hidden">
          <motion.div
            style={{
              height: heightSpring,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-b from-brand-600 via-brand-500 to-brand-600 rounded-full shadow-lg"
          />
        </div>

        {data.map((item, index) => {
          const isActive = activeIndex === index;
          const isPast = activeIndex > index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.2 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.06,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="relative mb-5 sm:mb-6 md:mb-16 pl-6 sm:pl-8 md:pl-0"
            >
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-8 items-start">
                {/* Year Badge - Mobile: Full width, Desktop: Left Side */}
                <div className="flex-shrink-0 w-full md:w-48">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.03 : 1,
                      opacity: isActive || isPast ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="relative inline-block w-full md:w-auto">
                      {/* Glowing background effect */}
                      {(isActive || isPast) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-brand-400/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-lg -z-10"
                        />
                      )}
                      
                      {/* Year card */}
                      <div className={`
                        relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl border-2 transition-all duration-300 w-full md:w-auto
                        ${isActive 
                          ? 'bg-gradient-to-br from-brand-500 to-brand-500 border-brand-400 shadow-xl sm:shadow-2xl shadow-brand-500/50' 
                          : isPast
                          ? 'bg-gradient-to-br from-brand-100 to-brand-100 border-brand-200 shadow-md sm:shadow-lg'
                          : 'bg-white border-slate-200 shadow-sm sm:shadow-md'
                        }
                      `}>
                        <motion.h3
                          animate={{
                            color: isActive ? '#ffffff' : isPast ? '#0098CA' : '#64748b',
                          }}
                          className={`
                            text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold transition-colors duration-300 text-center md:text-left leading-tight
                            ${isActive ? 'text-white' : isPast ? 'text-brand-700' : 'text-slate-600'}
                          `}>
                          {item.title}
                        </motion.h3>
                        
                        {/* Progress indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-white/50 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content Card - Right Side */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1 w-full"
                >
                  <div className={`
                    relative group rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 flex flex-col md:flex-row
                    ${isActive 
                      ? 'bg-white shadow-2xl ring-4 ring-brand-500/20 border-2 border-brand-300/50' 
                      : isPast
                      ? 'bg-white shadow-xl ring-2 ring-brand-200/30 border-2 border-brand-200/40'
                      : 'bg-white shadow-lg border-2 border-slate-200/60 hover:shadow-xl hover:ring-2 hover:ring-brand-100/40'
                    }
                  `}>
                    {/* Animated background gradient */}
                    <motion.div 
                      className={`absolute inset-0 z-0 ${
                        isActive 
                          ? 'bg-gradient-to-br from-brand-50/50 via-brand-50/30 to-brand-50/50' 
                          : isPast
                          ? 'bg-gradient-to-br from-brand-50/30 via-brand-50/20 to-brand-50/30'
                          : 'bg-gradient-to-br from-slate-50/50 to-white'
                      }`}
                      animate={isActive ? {
                        background: [
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(14, 165, 233, 0.03) 50%, rgba(59, 130, 246, 0.05) 100%)',
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(59, 130, 246, 0.08) 100%)',
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(14, 165, 233, 0.03) 50%, rgba(59, 130, 246, 0.05) 100%)',
                        ]
                      } : {}}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                      animate={{
                        x: ['-200%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Text Content Section - Mobile: Full width, Desktop: Left Side (2/3) */}
                    <div className="relative z-10 w-full md:flex-[2] p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-center order-2 md:order-1">
                      {/* Content wrapper with better spacing */}
                      <div className="space-y-4 sm:space-y-5">
                        {item.content}
                      </div>
                    </div>

                    {/* Image Section - Mobile: Full width top, Desktop: Right Side (1/3) */}
                    {item.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-full h-64 sm:h-72 md:h-auto md:flex-1 overflow-hidden order-1 md:order-2 md:rounded-r-2xl md:rounded-l-none rounded-t-2xl md:rounded-t-3xl"
                      >
                        {/* Image with overlay */}
                        <motion.img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="400"
                          className="w-full h-full object-cover md:rounded-r-2xl md:rounded-l-none rounded-t-2xl md:rounded-t-3xl"
                          style={{ aspectRatio: '3/2' }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/10 to-transparent z-10 md:rounded-r-2xl rounded-t-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/10 z-10 md:rounded-r-2xl rounded-t-2xl"></div>
                        
                        {/* Animated border glow */}
                        {isActive && (
                          <motion.div 
                            className="absolute inset-0 border-l-0 md:border-l-4 border-t-4 md:border-t-0 border-brand-400/30 z-20 pointer-events-none md:rounded-r-2xl rounded-t-2xl"
                            animate={{
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    )}

                    {/* Decorative elements */}
                    {isActive && (
                      <>
                        {/* Top-right accent */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-400/10 to-brand-400/10 rounded-bl-full z-0"
                        />
                        {/* Bottom-left accent */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-400/10 to-brand-400/10 rounded-tr-full z-0"
                        />
                      </>
                    )}

                    {/* Bottom border accent */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${
                        isActive 
                          ? 'bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500' 
                          : isPast
                          ? 'bg-gradient-to-r from-brand-400 via-brand-400 to-brand-400'
                          : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive || isPast ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Timeline dot connector - Mobile: left side, Desktop: centered */}
              <div className="absolute left-0 md:left-48 top-4 sm:top-5 md:top-6 -translate-x-1/2 z-20">
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : isPast ? 1.05 : 1,
                    boxShadow: isActive 
                      ? '0 0 0 3px rgba(59, 130, 246, 0.15), 0 0 0 1.5px rgba(14, 165, 233, 0.25)'
                      : isPast
                      ? '0 0 0 1.5px rgba(59, 130, 246, 0.1)'
                      : '0 0 0 0px rgba(59, 130, 246, 0)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border-2 sm:border-[2.5px] md:border-[3px] lg:border-4 transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-brand-500 to-brand-500 border-white' 
                      : isPast
                      ? 'bg-gradient-to-br from-brand-400 to-brand-400 border-white'
                      : 'bg-white border-slate-300'
                    }
                  `}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
