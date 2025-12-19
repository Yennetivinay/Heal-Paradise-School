import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../components/common/SpotlightCard';

// Lazy load heavy components
const TeamTestimonials = lazy(() => import('../components/team/TeamTeastimonials').then(module => ({ default: module.TeamTestimonials })));
const Gallery = lazy(() => import('../components/gallery/GalleryLanding'));

import { GraduationCap, Trophy, Award, Medal, Star, Users, BookOpen, Building2, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, Sparkles, TrendingUp, Library, Microscope, Music, Dumbbell, Palette, Heart, Quote, Shield, Target, Zap, Home, Laptop, Activity, School } from 'lucide-react';
import videoSrc from '../assets/Hero vid.mp4';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// Optimized Lazy Video Component - Uses poster image for fast LCP, loads video lazily but plays automatically
const LazyVideo = ({ videoSource, title }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Start loading video immediately but with a small delay to prioritize placeholder for LCP
  useEffect(() => {
    // Small delay ensures placeholder renders first (better LCP)
    const loadTimer = setTimeout(() => {
      setShouldLoad(true);
    }, 50);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(loadTimer);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Auto-play video when it loads and is visible
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (videoLoaded && isVisible) {
      // Auto-play video when loaded and visible
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handle autoplay restrictions silently
        });
      }
    } else if (!isVisible) {
      // Pause video when out of view
      video.pause();
    }

    // Cleanup: pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [isVisible, videoLoaded]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // Ensure video plays once loaded
    if (videoRef.current && isVisible) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handle autoplay restrictions silently
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full">
      {/* Video - uses metadata preload to show first frame quickly, then plays automatically */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.78vh',
            objectFit: 'cover',
          }}
          src={videoSource}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onLoadedMetadata={handleVideoLoaded}
          title={title}
        />
      )}
    </div>
  );
};

const LandingPage = () => {
  const [contentVisible, setContentVisible] = React.useState(true);
  const [typedText, setTypedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(true);
  const [showButtons, setShowButtons] = React.useState(false);
  const sectionRef = React.useRef(null);
  const buttonsRef = React.useRef(null);

  const videoContainerRef = React.useRef(null);

  const FULL_TEXT = "A compassionate, world‑class CBSE school dedicated to uplifting under‑privileged children, single‑parent families, and orphans — providing full scholarship, residential care.";

  // Show buttons after 2 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Typing animation effect
  React.useEffect(() => {
    let currentIndex = 0;
    let timeoutId;

    const typeText = () => {
      if (currentIndex < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, 30); // Typing speed: 30ms per character
      } else {
        // After typing completes, wait 5 seconds then start deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          currentIndex = FULL_TEXT.length;
          const deleteText = () => {
            if (currentIndex > 0) {
              setTypedText(FULL_TEXT.slice(0, currentIndex - 1));
              currentIndex--;
              timeoutId = setTimeout(deleteText, 30); // Deleting speed: 30ms per character
            } else {
              setTypedText('');
            }
          };
          deleteText();
        }, 5000); // Wait 5 seconds
      }
    };

    typeText();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!videoContainerRef.current || !buttonsRef.current) return;

      const videoRect = videoContainerRef.current.getBoundingClientRect();
      const buttonsRect = buttonsRef.current.getBoundingClientRect();
      
      // Hide content when buttons touch the bottom of the video (not the black space)
      // Video container is h-screen, so when its bottom reaches viewport bottom, hide content
      if (videoRect.bottom <= buttonsRect.bottom) {
        setContentVisible(false);
      } else {
        setContentVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, []);

  return (
    <main>
    <header ref={sectionRef} className="relative overflow-hidden h-screen bg-black">
      <div ref={videoContainerRef} className="absolute inset-0 h-screen w-full">
        <div className="absolute inset-0 z-0 w-full h-full">
          <LazyVideo
            videoSource={videoSrc}
            title="Heal Paradise Hero Video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/0 w-full h-full pointer-events-none" />
        </div>
      </div>
      <div 
        className={`absolute top-0 left-0 right-0 z-10 mx-auto max-w-7xl px-6 pt-20 sm:pt-24 md:pt-28 pb-28 text-center h-screen flex flex-col justify-center transition-opacity duration-300 ${
          contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
          <span className="inline-flex items-center gap-2 rounded-full bg-transparent/20 border border-white/40 px-3 py-1 text-[10px] sm:text-xs font-medium text-white backdrop-blur max-w-fit mx-auto whitespace-nowrap mt-4 sm:mt-6 md:mt-12 lg:mt-16">
            <GraduationCap fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />Residential School Affiliated to CBSE
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-6xl">
            <span className="text-brand-400" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 0px 1px 0px rgba(0,0,0,0.8), 0px -1px 0px rgba(0,0,0,0.8), 1px 0px 0px rgba(0,0,0,0.8), -1px 0px 0px rgba(0,0,0,0.8)' }}>
              Heal
            </span>{' '}
            <span className="text-white" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 0px 1px 0px rgba(0,0,0,0.8), 0px -1px 0px rgba(0,0,0,0.8), 1px 0px 0px rgba(0,0,0,0.8), -1px 0px 0px rgba(0,0,0,0.8)' }}>
              School
            </span>
          </h1>
         
          <div 
            ref={buttonsRef} 
            className={`mt-90 flex flex-nowrap items-center justify-center gap-3 transition-all duration-700 ease-out ${
              showButtons 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              to="/admission"
              className="rounded-full bg-gradient-to-r from-brand-500 to-brand-500 px-5 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-semibold text-white shadow-md transition hover:shadow-lg hover:from-brand-600 hover:to-brand-500 whitespace-nowrap"
            >
              Apply for Admissions
            </Link>
            <Link
              to="/about"
              className="rounded-full bg-transparent border border-white px-5 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-semibold text-white backdrop-blur transition hover:bg-white/20 whitespace-nowrap"
            >
              Our Mission
            </Link>
          </div>
        </div>
    </header>

    {/* Gallery Section */}
    <section id="gallery" className="w-full mb-3 pb-6 bg-gradient-to-br from-slate-50 via-white to-brand-50/30 rounded-3xl overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
      {/* Text and Illustration Section */}
      
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch py-6 md:py-8">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 backdrop-blur-sm border border-brand-200/60 px-4 py-2 text-sm font-semibold text-brand-500 shadow-sm mb-4 w-fit">
              <Heart className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
                Transforming Lives
              </span>
              <br />
              <span className="text-slate-900">Through Education</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed">
              At Heal School, we believe every child deserves access to world-class education, regardless of their circumstances. Through our comprehensive scholarship program and residential care, we're building a future where every student can dream, achieve, and inspire.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['100% Free Education', 'Residential Care', 'CBSE Curriculum', 'Holistic Development'].map((tag, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-50 to-brand-50 border border-brand-200/60 text-sm font-semibold text-brand-500 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {tag}
                </motion.span>
              ))}
          </div>
          </motion.div>

          {/* Illustration/Cartoon */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full min-h-[300px] md:min-h-[500px] w-full"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-brand-50/80 via-brand-50/50 to-white rounded-3xl p-4 md:p-6 lg:p-8 overflow-hidden shadow-2xl border-2 border-brand-100/60">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-200/20 to-brand-200/20 rounded-3xl blur-2xl"></div>
              <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden z-10">
                <DotLottieReact 
                  src="https://lottie.host/4d9ea1cd-2ace-4050-b163-f474e23c12ff/RKARS6NZe4.lottie"
                  loop
                  autoplay
                  className="w-full h-full rounded-3xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Gallery Component */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 relative z-20">
        <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="text-slate-600">Loading gallery...</div></div>}>
          <Gallery />
        </Suspense>
      </div>
      
      {/* View More Button */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center pt-6"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/gallery"
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 text-white font-bold rounded-full shadow-2xl hover:shadow-brand-500/50 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">View More</span>
          <motion.svg
            className="w-5 h-5 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
        </Link>
        </motion.div>
      </motion.div>
      </div>

     
    </section>

    {/* About Heal Paradise School */}
    <section className="relative overflow-hidden pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8 z-10">
      {/* Background matching gallery section */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/30" />
      {/* Decorative background elements - matching gallery style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-brand-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-brand-500 shadow-lg mb-4 md:mb-6 hover:shadow-xl transition-shadow duration-300"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            About Heal School
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 200 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">
              Heal School
          </span>
          <br />
            <span className="relative inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-slate-900 drop-shadow-md">
                More Than a School
              </span>
              <span className="mx-2 sm:mx-3 text-slate-900">—</span>
              <span className="text-slate-900 font-bold drop-shadow-lg">
                A Place of <span className="relative">
                  <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">Hope</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-brand-400/50 via-brand-300/50 to-brand-400/50 rounded-full blur-sm"></span>
                </span>
              </span>
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full mt-6 md:mt-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-brand-100/60">
              <div className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium space-y-4 text-justify">
                <p>
                  HEAL School is part of the <span className="font-semibold text-brand-500">HEAL Paradise Village</span>, a 30-acre integrated campus near Gannavaram Airport, Vijayawada. The school supports the education and development of <span className="font-bold text-brand-500">900+ underprivileged children</span>, providing learning, care, and guidance under one roof.
                </p>
                <p>
                  Backed by <span className="font-bold text-brand-500">33 years of service</span>, HEAL continues its mission of uplifting the underprivileged through education and healthcare.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Divider between sections */}
    <div className="relative py-2 md:py-3">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-brand-300/60 to-transparent"></div>
      </div>
    </div>

    {/* Our Story Section */}
    <section className="relative overflow-hidden pt-6 md:pt-8 pb-12 md:pb-16 lg:pb-20 z-10">
      {/* Background matching surrounding sections */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/30" />
      {/* Decorative background elements - matching gallery style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-brand-500 shadow-md mb-4 md:mb-6"
            >
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              Our Journey
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight"
            >
              <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">Our Story</span>
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200, delay: 0.15 }}
            className="w-full"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-brand-100/60 space-y-5 md:space-y-6">
              <div className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium space-y-5 md:space-y-6 text-justify">
                <p>
                  <span className="font-bold text-brand-500">HEAL</span> was built on a clear conviction: education must reach the child who needs it most.
                </p>
                <p>
                  What began in 1968 as <span className="font-semibold">Praja Seva Samithi</span> evolved into <span className="font-bold text-brand-500">HEAL – Health and Education for All</span> in 1992, under the vision of <span className="font-semibold">Dr. Koneru Satya Prasad</span>. The purpose was never expansion for its own sake. It was to take complete responsibility for children who had no support system.
                </p>
                <p>
                  <span className="font-bold text-brand-500">HEAL</span> works with orphans, semi-orphans, and children from deeply underprivileged families. For them, education alone is insufficient. Stability, discipline, care, and values are equally essential. <span className="font-bold text-brand-500">HEAL</span> provides all of this under one system: schooling, accommodation, nutrition, healthcare, and moral guidance.
                </p>
                <p>
                  Inclusive education is central to this ideology. Visually challenged children are educated with dignity through Braille training and assistive tools, ensuring equal opportunity, not special treatment.
                </p>
                <p>
                  Success at <span className="font-bold text-brand-500">HEAL</span> is measured by independence. Children are guided until they are educated, employable, and confident enough to stand on their own. Many return as professionals and contributors, proving the model works.
                </p>
                <p>
                  <span className="font-bold text-brand-500">HEAL</span>'s story is simple and deliberate.
                </p>
              </div>
              <div className="pt-4 md:pt-6 border-t border-brand-200/60">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-900 leading-relaxed font-bold italic text-center bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
                  Take responsibility. Educate with purpose. Build lives that last.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Images in Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 md:mt-10 w-full"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[150px] sm:min-h-[180px] md:min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=70&w=600&auto=format&fit=crop" 
                  alt="Students learning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-500/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[150px] sm:min-h-[180px] md:min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=75&w=400&auto=format&fit=crop" 
                  alt="School building"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-500/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[150px] sm:min-h-[180px] md:min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=75&w=400&auto=format&fit=crop" 
                  alt="Classroom"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-500/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[150px] sm:min-h-[180px] md:min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=75&w=400&auto=format&fit=crop" 
                  alt="Students together"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-500/40 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* What Makes Us Different Section */}
    <section className="relative overflow-hidden py-12 md:py-16 z-10 px-4 sm:px-6">
      {/* Background matching surrounding sections */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/30" />
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-100/20 to-brand-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl">
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-12 relative z-10"
          >
            <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-brand-500 shadow-md mb-4"
          >
            <Star className="w-4 h-4 md:w-5 md:h-5" />
            Our Uniqueness
              </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
              What Makes Us Different
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2 leading-relaxed">
            Discover the unique qualities that set Heal School apart and make us a beacon of hope for underprivileged children
          </p>
          </motion.div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
           {[
             {
               icon: <Heart className="w-8 h-8" />,
               title: '100% Free Education',
               description: 'No tuition fees, books, uniforms, or exam costs.',
               gradient: 'from-brand-500 to-brand-500'
             },
             {
               icon: <Home className="w-8 h-8" />,
               title: 'Residential Support',
               description: 'Safe accommodation, nutritious meals, and daily care.',
               gradient: 'from-brand-500 to-brand-500'
             },
             {
               icon: <Award className="w-8 h-8" />,
               title: 'CBSE Curriculum',
               description: 'Structured, nationally recognized academics.',
               gradient: 'from-brand-500 to-brand-500'
             },
             {
               icon: <Users className="w-8 h-8" />,
               title: 'Holistic Growth',
               description: 'Academics, sports, arts, values, and wellbeing.',
               gradient: 'from-brand-500 to-brand-500'
             }
           ].map((feature, index) => (
          <motion.div 
              key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-brand-100/60 hover:border-brand-200/80"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-transparent to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
            <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-500 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
                ))}
              </div>
            </div>
    </section>

    {/* Our Impact Section - Horizontal Banner Style */}
    <section className="relative overflow-hidden py-12 md:py-16 z-10 px-4 sm:px-6 bg-white">
      <div className="relative mx-auto max-w-7xl">
        {/* Heading Section */}
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-10 md:mb-12 relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-3 md:mb-4"
          >
            <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
              Our Impact at a Glance
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-700 font-semibold"
          >
            Changing Lives Through Education
          </motion.p>
        </motion.div>

        {/* Horizontal banner with icons */}
        <div className="flex flex-nowrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 relative z-10 px-2 sm:px-4">
          {[
            {
              icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />,
              text: 'Students placed in higher education & careers',
              delay: 0.1
            },
            {
              icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />,
              text: 'Specialized support for visually challenged students',
              delay: 0.2
            },
            {
              icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />,
              text: '100% free education, care & healthcare',
              delay: 0.3
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: item.delay,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{ 
                scale: 1.1,
                y: -5
              }}
              className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 group cursor-pointer flex-1 max-w-[33.333%]"
            >
              {/* Icon in circular border */}
              <motion.div 
                className="relative"
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Outer circle border */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-brand-500 animate-pulse-slow"
                  animate={item.highlight ? {
                    opacity: [1, 0.6, 1],
                    scale: [1, 1.05, 1]
                  } : {
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                {/* Icon container */}
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-brand-500 bg-white flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:border-brand-500 ${item.highlight ? 'ring-2 ring-brand-300 ring-offset-2' : ''}`}>
                  <div className="text-brand-500">
                    {item.icon}
                  </div>
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={item.highlight ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    } : {
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </div>
              </motion.div>

              {/* Text label */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: item.delay + 0.2 }}
                className="text-center w-full px-1 sm:px-2"
              >
                {/* Underline for first 3 items */}
                {index < 3 && (
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: item.delay + 0.3 }}
                    className="h-0.5 bg-brand-500 mb-1.5 sm:mb-2 mx-auto"
                    style={{ maxWidth: '50px' }}
                  ></motion.div>
                )}
                <p className={`text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-brand-500 group-hover:text-brand-500 transition-colors duration-300 leading-tight ${item.highlight ? 'font-bold' : ''}`}>
                  {item.text}
                </p>
              </motion.div>
            </motion.div>
                ))}
              </div>

        {/* Highlighted Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
          className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 relative z-10 px-2 sm:px-4"
        >
          <motion.div
            className="inline-block relative w-full max-w-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-100/50 via-brand-50/30 to-brand-100/50 rounded-xl sm:rounded-2xl blur-2xl -z-10"></div>
            
            {/* Text container */}
            <div className="relative bg-gradient-to-r from-brand-50/80 via-white to-brand-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-8 border-2 border-brand-200/60 shadow-xl w-full">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold leading-tight break-words"
              >
                <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
                  16,000
                </span>
                <span className="text-slate-700 mx-1 sm:mx-1.5 md:mx-2 lg:mx-3">–</span>
                <span className="text-slate-800 block sm:inline">
                  where the underprivileged become privileged
                </span>
              </motion.p>
              
              {/* Decorative underline */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.9 }}
                className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full mt-3 sm:mt-4 mx-auto"
                style={{ maxWidth: '200px' }}
              ></motion.div>
            </div>
          </motion.div>
          </motion.div>
      </div>
    </section>

    {/* Founder Message */}
    <article className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-white via-brand-50/70 to-brand-50/60 rounded-xl sm:rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border-2 border-brand-200/80 overflow-hidden"
      >
        {/* Enhanced bright background decorations */}
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-brand-300/50 to-brand-300/50 rounded-full blur-3xl -mr-36 sm:-mr-48 -mt-36 sm:-mt-48"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-tr from-brand-300/50 to-brand-300/50 rounded-full blur-3xl -ml-28 sm:-ml-40 -mb-28 sm:-mb-40"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>
        
        {/* Brighter grid pattern */}
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#0098CA_1px,transparent_1px),linear-gradient(to_bottom,#0098CA_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Brighter decorative corner accents */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-brand-200/70 to-transparent rounded-bl-3xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-tr from-brand-200/70 to-transparent rounded-tr-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-start lg:items-center">
          {/* Left Side - Founder Image and Name */}
          <motion.div 
            className="flex flex-col items-center text-center lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="relative mb-3 sm:mb-4"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced brighter glow effects */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-brand-400/60 to-brand-400/60 rounded-full blur-xl"
                animate={{ 
                  opacity: [0.5, 0.7, 0.5],
                  scale: [1, 1.08, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              ></motion.div>
              
              {/* Brighter outer decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-300 via-brand-300 to-brand-300 p-0.5 animate-spin-slow opacity-70">
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>
              
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden ring-3 ring-brand-200/90 ring-offset-2 ring-offset-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=600&auto=format&fit=crop"
                  alt="Founder"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/10 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative badge */}
              <motion.div 
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-2.5 md:-right-2.5 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-brand-500 to-brand-500 rounded-full shadow-md flex items-center justify-center ring-2 ring-white"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="space-y-1.5">
              <motion.h3 
                className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 via-brand-500 to-slate-800 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Dr. Koneru Satya Prasad
              </motion.h3>
              <motion.p 
                className="text-xs sm:text-sm md:text-sm lg:text-base text-brand-500 font-semibold"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Founder – HEAL
              </motion.p>
              
              {/* Enhanced decorative line */}
              <motion.div 
                className="mt-2 h-0.5 w-16 sm:w-20 bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 rounded-full shadow-sm mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Right Side - Founder Message */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
                <motion.div 
                  className="h-1.5 sm:h-2 w-8 sm:w-10 bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 rounded-full shadow-md"
                  initial={{ width: 0 }}
                  whileInView={{ width: 40 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                ></motion.div>
                <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-slate-800">
                    Message from the <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">Founder</span>
                </h2>
                  <p className="text-sm sm:text-base md:text-base text-brand-500 font-semibold mt-0.5">
                    The Thinking Behind HEAL
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Enhanced quote container */}
              <motion.div 
                className="relative pl-5 sm:pl-6 md:pl-7 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-lg border-l-3 border-brand-500"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Decorative border gradient */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-brand-500 to-brand-500"></div>
                
                {/* Quote icon */}
                <div className="absolute -left-2.5 top-3 w-6 h-6 sm:w-6.5 sm:h-6.5 bg-gradient-to-br from-brand-500 to-brand-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                  <Quote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                
                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed">
                  <p className="text-brand-500 font-bold text-sm sm:text-base md:text-lg italic">
                    "Education must build independence."
                  </p>
                  
                  <p>
                    <span className="text-brand-500 font-bold">HEAL</span> began with a refusal to accept early failure as destiny. Poverty and disability were not excuses. They were challenges to be addressed.
                  </p>
                  
                  <p>
                    Since decades, the approach has remained firm. Strong systems create strong individuals.
                  </p>
                  
                  <p>
                    At <span className="text-brand-500 font-bold">Heal School</span>, expectations are equal. Support is intentional.
                  </p>
                  
                  <p>
                    Education here is preparation for life, not protection from it.
                  </p>
                  
                  <p className="font-semibold text-brand-500">
                    That commitment defines <span className="font-bold">HEAL</span>.
                  </p>
                </div>
                
                {/* Closing quote mark */}
                <div className="absolute -right-1.5 sm:-right-2 bottom-3 text-3xl sm:text-4xl md:text-5xl text-brand-200/50 font-serif leading-none">"</div>
              </motion.div>
              
              {/* Enhanced signature section */}
              <motion.div 
                className="pt-3 sm:pt-4 border-t border-brand-200/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                 
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </article>

    {/* Team/Leadership Carousel */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
          Our Leadership Team
        </h2>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
          Meet the dedicated leaders who guide our mission of excellence and compassion
        </p>
      </div>
      
      <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="text-slate-600">Loading testimonials...</div></div>}>
        <TeamTestimonials 
          testimonials={[
          {
            name: "Dr. John Smith",
            designation: "Principal",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            quote: "With over 20 years of experience in education, Dr. Smith leads our academic excellence initiatives."
          },
          {
            name: "Ms. Sarah Johnson",
            designation: "Vice Principal",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
            quote: "Passionate about student welfare and holistic development, Ms. Johnson ensures every child receives personalized attention."
          },
          {
            name: "Mr. David Williams",
            designation: "Head of Academics",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
            quote: "An expert in curriculum development, Mr. Williams designs innovative learning programs for our students."
          }
        ]}
        autoplay={true}
      />
      </Suspense>
    </section>
 

  {/* Mission */}
    <section id="mission" className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-10 md:mb-12 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-3 md:mb-4"
        >
          <span className="bg-gradient-to-r from-brand-500 via-brand-500 to-brand-500 bg-clip-text text-transparent">
            Our Approach
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-700 font-semibold"
        >
          Education With Accountability
        </motion.p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-4 sm:p-5 md:p-6 h-full flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
          spotlightColor="#0098CA30"
        >
          <h3 className="text-sm sm:text-base md:text-sm lg:text-base xl:text-sm font-semibold text-slate-900 italic leading-relaxed flex-grow flex items-center justify-center text-center">Structured Schooling, not informal learning</h3>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-4 sm:p-5 md:p-6 h-full flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
          spotlightColor="#0098CA30"
        >
          <h3 className="text-sm sm:text-base md:text-sm lg:text-base xl:text-sm font-semibold text-slate-900 italic leading-relaxed flex-grow flex items-center justify-center text-center">Long-term care, not short-term interventions</h3>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-4 sm:p-5 md:p-6 h-full flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
          spotlightColor="#0098CA30"
        >
          <h3 className="text-sm sm:text-base md:text-sm lg:text-base xl:text-sm font-semibold text-slate-900 italic leading-relaxed flex-grow flex items-center justify-center text-center">Skill integration, not textbook dependency</h3>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-4 sm:p-5 md:p-6 h-full flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
          spotlightColor="#0098CA30"
        >
          <h3 className="text-sm sm:text-base md:text-sm lg:text-base xl:text-sm font-semibold text-slate-900 italic leading-relaxed flex-grow flex items-center justify-center text-center">Inclusive tools, including Braille training and assistive technology</h3>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-4 sm:p-5 md:p-6 h-full flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
          spotlightColor="#0098CA30"
        >
          <h3 className="text-sm sm:text-base md:text-sm lg:text-base xl:text-sm font-semibold text-slate-900 italic leading-relaxed flex-grow flex items-center justify-center text-center">Character building, alongside academics</h3>
        </SpotlightCard>
      </div>
    </section>

    {/* Call To Action */}
    <section id="admissions" className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border-4 border-amber-300/60 bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50/50 p-6 md:p-8 lg:p-12 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(255, 247, 237, 0.9) 25%, rgba(255, 251, 245, 0.95) 50%, rgba(255, 247, 237, 0.9) 75%, rgba(254, 243, 199, 0.8) 100%)',
          boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.1)'
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/40 via-orange-400/30 to-rose-400/30 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -left-16 -bottom-16 h-96 w-96 rounded-full bg-gradient-to-br from-orange-400/40 via-amber-400/30 to-yellow-400/30 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], rotate: [360, 180, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-300/20 to-orange-300/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        {/* Floating sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>
        ))}

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              rotate: { duration: 2, repeat: Infinity }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400/90 via-orange-400/90 to-rose-400/90 border-2 border-amber-300/60 px-5 py-2.5 text-sm font-bold text-white shadow-xl mb-6 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="drop-shadow-sm">Admissions Now Open</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
          
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6">
            <motion.span 
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent drop-shadow-sm"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200%' }}
            >
              Admissions Open
            </motion.span>
            <br />
            <span className="text-slate-900 drop-shadow-sm">100% Scholarship</span>
          </h3>
          
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-800 leading-relaxed mb-8 font-medium">
            For under‑privileged students, single‑parent children, and orphans. Join a nurturing
            CBSE school with complete residential support at no cost.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                to="/admission"
                className="group relative rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-4 text-base font-bold text-white shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 overflow-hidden inline-block border-2 border-amber-400/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Application
                  <motion.svg 
                    className="w-5 h-5"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </motion.div>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-full bg-white/95 backdrop-blur-md border-2 border-amber-300/60 px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-white hover:border-amber-400"
            >
              Download Prospectus
            </motion.a>
          </div>
        </div>
      </motion.div>
      
    </section>
    </main>
  )
}

export default LandingPage;
