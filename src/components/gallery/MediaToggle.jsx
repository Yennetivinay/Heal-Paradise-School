import { motion } from 'framer-motion'
import { Image as ImageIcon, Video } from 'lucide-react'

export function MediaToggle({ value, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <motion.button
        onClick={() => onChange('images')}
        className={`
          relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm
          transition-all duration-300
          ${value === 'images' 
            ? 'text-white' 
            : 'text-slate-600 hover:text-slate-900'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {value === 'images' && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full shadow-lg"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <ImageIcon className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 ${value === 'images' ? 'text-white' : 'text-slate-500'}`} />
        <span className="relative z-10 hidden xs:inline">Images</span>
        <span className="relative z-10 xs:hidden">Imgs</span>
      </motion.button>

      <motion.button
        onClick={() => onChange('videos')}
        className={`
          relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm
          transition-all duration-300
          ${value === 'videos' 
            ? 'text-white' 
            : 'text-slate-600 hover:text-slate-900'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {value === 'videos' && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full shadow-lg"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <Video className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 ${value === 'videos' ? 'text-white' : 'text-slate-500'}`} />
        <span className="relative z-10 hidden xs:inline">Videos</span>
        <span className="relative z-10 xs:hidden">Vids</span>
      </motion.button>
    </div>
  )
}

