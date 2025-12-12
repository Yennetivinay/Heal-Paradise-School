import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Award, Star, Medal, Trophy, Sparkles } from 'lucide-react';

const AwardShowcase3D = ({ awards = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Auto-rotate awards
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % awards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, awards.length]);

  const currentAward = awards[selectedIndex];
  const iconMap = {
    Award,
    Star,
    Medal,
    Trophy,
  };
  const Icon = currentAward?.icon ? iconMap[currentAward.icon] || Award : Award;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[500px] perspective-1000"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        {/* Background glow */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/30 via-yellow-500/30 to-amber-600/30 blur-3xl"
        />

        {/* Main showcase container */}
        <div
          style={{
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-amber-500/20 p-8 md:p-12 overflow-hidden"
        >
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-2 h-2 rounded-full bg-amber-400/60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: 'translateZ(10px)',
              }}
            />
          ))}

          {/* 3D Award Icon */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              style={{
                transform: 'translateZ(100px)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateY: isHovered ? 360 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl">
                <Icon className="w-16 h-16 md:w-20 md:h-20 text-white" />
                
                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-amber-300/30"
                  style={{
                    transform: 'translateZ(20px)',
                  }}
                />
              </div>

              {/* Orbiting stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    x: 60,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    transformOrigin: '0 0',
                    transform: `translateZ(30px) rotate(${i * 60}deg)`,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Award content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 90 }}
              transition={{ duration: 0.6 }}
              style={{
                transform: 'translateZ(50px)',
                transformStyle: 'preserve-3d',
              }}
              className="text-center"
            >
              <motion.div
                style={{
                  transform: 'translateZ(30px)',
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-medium mb-4"
              >
                <Sparkles className="w-4 h-4" />
                {currentAward?.year || '2024'}
              </motion.div>

              <motion.h3
                style={{
                  transform: 'translateZ(40px)',
                }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                {currentAward?.title || 'Excellence Award'}
              </motion.h3>

              <motion.p
                style={{
                  transform: 'translateZ(25px)',
                }}
                className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                {currentAward?.description || 'Outstanding achievement and dedication'}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {awards.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-amber-400'
                    : 'bg-amber-400/30 hover:bg-amber-400/50'
                }`}
                style={{
                  transform: 'translateZ(20px)',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AwardShowcase3D;
