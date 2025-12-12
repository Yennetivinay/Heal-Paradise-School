import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

/**
 * @param {{images: {src: string, alt?: string}[]}} props
 */
export function ZoomParallax({ images }) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const smoothEase = (t) => t * (2 - t); // easeOutQuad

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 5], { ease: smoothEase });
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5], { ease: smoothEase });
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6], { ease: smoothEase });
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8], { ease: smoothEase });
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9], { ease: smoothEase });

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div
      ref={container}
      className="relative h-[120vh] sm:h-[140vh] md:h-[155vh] w-full max-w-[1200px] mx-auto"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{
                scale,
                transformOrigin: 'center center',
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 30,
                mass: 1,
              }}
              className={`absolute top-0 flex h-full w-full items-center justify-center
                ${
                  index === 1
                    ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw]  [&>div]:!h-[30vh] [&>div]:!w-[35vw]'
                    : ''
                }
                ${
                  index === 2
                    ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]'
                    : ''
                }
                ${
                  index === 3
                    ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]'
                    : ''
                }
                ${
                  index === 4
                    ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw]  [&>div]:!h-[25vh] [&>div]:!w-[20vw]'
                    : ''
                }
                ${
                  index === 5
                    ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]'
                    : ''
                }
                ${
                  index === 6
                    ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]'
                    : ''
                }
              `}
            >
              <div
                className="group relative h-[18vh] w-[28vw] rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/60 backdrop-blur-sm
                           sm:h-[20vh] sm:w-[26vw]
                           md:h-[22vh] md:w-[24vw]"
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* depth overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                  }}
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                />

                {/* shine */}
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* glow */}
                <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-blue-400/20 via-sky-400/20 to-blue-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
