import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Award3DCard = ({ 
  title, 
  description, 
  year, 
  category, 
  icon: Icon,
  gradient = 'from-amber-400 via-yellow-500 to-amber-600',
  glowColor = 'rgba(251, 191, 36, 0.3)'
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full h-full perspective-1000"
    >
      <div
        style={{
          transform: 'translateZ(75px)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 shadow-2xl border border-slate-700/50 h-full overflow-hidden group">
          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />

          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Icon with 3D effect */}
            <motion.div
              style={{
                transform: 'translateZ(50px)',
              }}
              animate={{
                rotateY: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-2xl mx-auto`}
            >
              {Icon && <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />}
            </motion.div>

            {/* Year badge */}
            <motion.div
              style={{
                transform: 'translateZ(30px)',
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold text-lg mb-4 mx-auto shadow-lg"
            >
              {year}
            </motion.div>

            {/* Title */}
            <motion.h3
              style={{
                transform: 'translateZ(40px)',
              }}
              className="text-2xl md:text-3xl font-bold text-white mb-3 text-center"
            >
              {title}
            </motion.h3>

            {/* Category */}
            <motion.div
              style={{
                transform: 'translateZ(20px)',
              }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-4 mx-auto"
            >
              {category}
            </motion.div>

            {/* Description */}
            <motion.p
              style={{
                transform: 'translateZ(25px)',
              }}
              className="text-slate-300 leading-relaxed text-center flex-grow"
            >
              {description}
            </motion.p>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 blur-3xl -z-10" />
            <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Award3DCard;

