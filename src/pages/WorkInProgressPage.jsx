import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Construction, 
  Wrench, 
  Clock, 
  Home, 
  ArrowLeft,
  Hammer,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const WorkInProgressPage = () => {
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes('infrastructure')) {
      return 'Infrastructure & Facilities';
    } else if (path.includes('academics')) {
      return 'Academics';
    } else if (path.includes('careers')) {
      return 'Careers';
    } else if (path.includes('disclosure')) {
      return 'Disclosure';
    }
    return 'This Page';
  };

  const getPageDescription = () => {
    const path = window.location.pathname;
    if (path.includes('infrastructure')) {
      return 'We are currently updating our infrastructure and facilities information. Check back soon for detailed information about our campus, labs, library, and sports facilities.';
    } else if (path.includes('academics')) {
      return 'Our academic programs and curriculum details are being updated. We will soon share comprehensive information about our courses, faculty, and educational approach.';
    } else if (path.includes('careers')) {
      return 'Career opportunities and job openings information is being prepared. We will soon post available positions and how to apply.';
    } else if (path.includes('disclosure')) {
      return 'Disclosure information and official documents are being updated. We will soon make all necessary information available.';
    }
    return 'This page is currently under construction. We are working hard to bring you the best experience.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center"
      >
        {/* Animated Construction Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center shadow-2xl">
              <Construction className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
              Work in Progress
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
            {getPageTitle()}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            {getPageDescription()}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Coming Soon</span>
          </div>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + step * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                {step < 3 && (
                  <div className="w-8 h-0.5 bg-blue-300" />
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-slate-500">We're working on it</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Go to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-4">In the meantime, explore:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/about"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              About Us
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/gallery"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Gallery
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/admission"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Admissions
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/contact"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkInProgressPage;

