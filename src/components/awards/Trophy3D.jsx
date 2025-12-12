import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy } from 'lucide-react';

const Trophy3D = ({ size = 200, glow = true }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['25deg', '-25deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-25deg', '25deg']);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ width: size, height: size }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        {/* Glow effect */}
        {glow && (
          <motion.div
            animate={{
              scale: isHovered ? 1.3 : 1,
              opacity: isHovered ? 0.8 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 blur-3xl -z-10"
            style={{
              filter: 'blur(60px)',
            }}
          />
        )}

        {/* Trophy base - 3D layers */}
        <div
          style={{
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full"
        >
          {/* Base shadow */}
          <motion.div
            style={{
              transform: 'translateZ(-30px)',
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-gradient-to-t from-amber-900/50 to-transparent blur-xl"
          />

          {/* Trophy base */}
          <motion.div
            style={{
              transform: 'translateZ(20px)',
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 rounded-t-full bg-gradient-to-b from-amber-600 via-amber-500 to-yellow-500 shadow-2xl"
          >
            <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>

          {/* Trophy stem */}
          <motion.div
            style={{
              transform: 'translateZ(40px)',
            }}
            animate={{
              scaleY: isHovered ? 1.1 : 1,
            }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-32 bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-600 rounded-full shadow-xl"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-transparent to-white/20" />
          </motion.div>

          {/* Trophy cup */}
          <motion.div
            style={{
              transform: 'translateZ(60px)',
            }}
            animate={{
              scale: isHovered ? 1.15 : 1,
              y: isHovered ? -10 : 0,
            }}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-40"
          >
            {/* Cup outer */}
            <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 shadow-2xl">
              <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-t-full border-4 border-amber-300/50" />
            </div>

            {/* Cup inner highlight */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-28 rounded-t-full bg-gradient-to-b from-amber-300/30 to-transparent" />

            {/* Trophy icon overlay */}
            <motion.div
              animate={{
                rotate: isHovered ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Trophy className="w-16 h-16 text-white/90 drop-shadow-2xl" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Shine effect */}
          <motion.div
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%',
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: 'linear',
            }}
            className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden pointer-events-none"
            style={{
              transform: 'translateZ(80px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 w-1/2" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Trophy3D;

