import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Import components directly for better performance (they're already optimized)
import { SpotlightCard } from '../components/common/SpotlightCard';
import { Timeline } from '../components/common/Timeline';
import { 
  GraduationCap, 
  Heart, 
  Users, 
  Award, 
  BookOpen, 
  Target,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Building2,
  Globe,
  Microscope,
  Music,
  Dumbbell,
  Palette,
  Code,
  Library,
  Home,
  CheckCircle,
  MapPin,
  Handshake,
  UserCheck,
  Eye,
  Phone,
  Mail,
  Calendar,
  Quote
} from 'lucide-react';

// Custom hook for count-up animation
const useCountUp = (end, suffix = '', duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      // Start immediately if not using viewport detection
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasStarted, end, duration]);

  return [count, ref];
};

// CountUp component
const CountUp = ({ end, suffix = '', duration = 2000 }) => {
  const [count, ref] = useCountUp(end, suffix, duration, true);
  
  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const AboutPage = () => {

  // Scroll to top on component mount and prevent scroll restoration
  useEffect(() => {
    // Prevent browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also handle hash fragments
    if (window.location.hash) {
      const hash = window.location.hash;
      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = hash;
      }, 0);
    }
    
    // Additional scroll to top after a small delay to catch any late scrolls
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Statistics data with numeric values and suffixes
  const stats = [
    { icon: Users, value: 500, suffix: '+', label: 'Students Enrolled', gradient: 'from-blue-500 to-sky-500' },
    { icon: GraduationCap, value: 95, suffix: '%', label: 'Pass Rate', gradient: 'from-emerald-500 to-green-500' },
    { icon: Award, value: 50, suffix: '+', label: 'Awards Won', gradient: 'from-amber-500 to-yellow-500' },
    { icon: Heart, value: 100, suffix: '%', label: 'Scholarship Coverage', gradient: 'from-rose-500 to-pink-500' },
  ];

  // Core Values the values that we believe in and follow in our school
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We believe in treating every child with empathy, understanding, and unconditional care, creating a nurturing environment where they feel valued and supported.',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in education, continuously improving our programs and facilities to provide world-class learning experiences.',
      gradient: 'from-blue-500 to-sky-500'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical principles, building trust with our students, families, and the community.',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace creative teaching methods and modern technology to make learning engaging, relevant, and effective for every student.',
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'We welcome students from all backgrounds, ensuring equal opportunities and celebrating diversity as a strength of our community.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Sparkles,
      title: 'Empowerment',
      description: 'We empower students to discover their potential, build confidence, and become leaders who can make a positive impact on the world.',
      gradient: 'from-indigo-500 to-blue-500'
    },
  ];

  // Timeline milestones - formatted for new Timeline component
  const timelineData = [
    {
      title: '2015',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=70&w=800&auto=format&fit=crop',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-blue-100"
            >
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1.5 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Foundation
              </h4>
              <p className="text-sm sm:text-base text-slate-500 font-semibold uppercase tracking-wide">The Beginning</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-20">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Heal Paradise School was established with a vision to provide free, quality education to underprivileged children.
              Our journey began with a simple yet powerful mission: to break the cycle of poverty through education.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-bold shadow-md">Vision</span>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-bold shadow-md">Mission</span>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: '2017',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=70&w=800&auto=format&fit=crop',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-emerald-100"
            >
              <Award className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1.5 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                CBSE Affiliation
              </h4>
              <p className="text-sm sm:text-base text-slate-500 font-semibold uppercase tracking-wide">Recognition Achieved</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-20">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Successfully obtained CBSE affiliation, ensuring our students receive recognized, high-quality education.
              This milestone validated our commitment to academic excellence and opened doors to better opportunities.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold shadow-md">CBSE</span>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shadow-md">Quality</span>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: '2019',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=70&w=800&auto=format&fit=crop',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-amber-100"
            >
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1.5 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Expansion
              </h4>
              <p className="text-sm sm:text-base text-slate-500 font-semibold uppercase tracking-wide">Growing Strong</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-20">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Expanded facilities to accommodate more students, adding new classrooms, state-of-the-art labs, 
              and enhanced residential facilities. Our growth reflected the increasing trust and impact in the community.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold shadow-md">Growth</span>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-bold shadow-md">Facilities</span>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: '2022',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=70&w=800&auto=format&fit=crop',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-purple-100"
            >
              <Star className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1.5 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Recognition
              </h4>
              <p className="text-sm sm:text-base text-slate-500 font-semibold uppercase tracking-wide">Excellence Acknowledged</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-20">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Received multiple awards for excellence in education and social impact, gaining national recognition.
              Our dedication to transforming lives through education was celebrated and acknowledged at the highest levels.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-bold shadow-md">Awards</span>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-bold shadow-md">Excellence</span>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: '2024',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=70&w=800&auto=format&fit=crop',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-rose-100"
            >
              <Users className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1.5 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                500+ Students
              </h4>
              <p className="text-sm sm:text-base text-slate-500 font-semibold uppercase tracking-wide">Milestone Reached</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-20">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Reached a milestone of 500+ students, transforming lives through education and compassionate care.
              Each student represents a story of hope, resilience, and the power of education to change destinies.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold shadow-md">500+</span>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-md">Impact</span>
            </div>
          </div>
        </motion.div>
      )
    },
  ];

  // Why Choose Us features
  const features = [
    {
      icon: GraduationCap,
      title: 'World-Class Education',
      description: 'CBSE curriculum with experienced faculty and modern teaching methodologies',
      gradient: 'from-blue-500 to-sky-500'
    },
    {
      icon: Heart,
      title: '100% Free Education',
      description: 'Complete scholarship covering tuition, accommodation, meals, and all essentials',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: 'Holistic Development',
      description: 'Academic excellence combined with sports, arts, values education, and life skills',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      icon: Users,
      title: 'Residential Care',
      description: 'Safe, nurturing residential environment with 24/7 support and guidance',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Secure campus with dedicated staff ensuring the wellbeing of every child',
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Education that prepares students for success in an interconnected world',
      gradient: 'from-indigo-500 to-blue-500'
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 relative z-0 overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24 pb-6 md:pt-28 md:pb-8 z-10 px-4 sm:px-6">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60" />
        <div className="absolute top-0 right-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-gradient-to-br from-blue-200/40 to-sky-200/40 rounded-full blur-3xl -mr-32 md:-mr-64 -mt-32 md:-mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-gradient-to-tr from-sky-200/40 to-blue-200/40 rounded-full blur-3xl -ml-32 md:-ml-64 -mb-32 md:-mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-gradient-to-r from-orange-100/20 to-amber-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-blue-700 shadow-lg mb-4 md:mb-6 hover:shadow-xl transition-shadow duration-300"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              About Heal Paradise School
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 200 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 md:mb-5 px-2 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                Transforming Lives
              </span>
              <br />
              <span className="text-slate-900 drop-shadow-sm">Through Education</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-2 font-medium"
            >
              A compassionate, world-class CBSE school dedicated to uplifting underprivileged children, 
              single-parent families, and orphans — providing full scholarship, residential care, and 
              holistic education that empowers students to achieve their dreams.
            </motion.p>
          </div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-6 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l from-sky-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 relative z-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon || Users; // Fallback if icon is missing
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.03, type: "spring", stiffness: 150 }}
              >
                <SpotlightCard
                  className="rounded-2xl md:rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white to-slate-50/80 backdrop-blur-sm p-6 sm:p-7 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full group"
                  spotlightColor="#3b82f640"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2 md:mb-3 text-center">
                    <CountUp 
                      end={stat.value} 
                      suffix={stat.suffix} 
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm sm:text-base md:text-lg text-slate-600 font-semibold text-center leading-tight">
                    {stat.label}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      {/* Mission & Vision Section */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-100/20 to-sky-100/20 rounded-full blur-3xl -ml-32 sm:-ml-48 -mt-32 sm:-mt-48"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-sky-100/20 to-blue-100/20 rounded-full blur-3xl -mr-32 sm:-mr-48 -mb-32 sm:-mb-48"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="text-center mb-4 sm:mb-6 md:mb-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200/60 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700 shadow-sm mb-3 sm:mb-4">
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            Our Purpose
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">Mission & Vision</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 relative z-10">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut"
            }}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border-2 border-blue-200/60 p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-200 md:duration-500 md:hover:scale-[1.02]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-200/30 to-sky-200/30 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200 md:duration-300">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-3 sm:mb-4">
                To provide world-class CBSE education with complete residential care, free of cost, 
                to underprivileged children, single-parent families, and orphans.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed">
                We are committed to nurturing each child's potential through holistic education, 
                compassionate support, and values-based learning that empowers them to become 
                confident, responsible, and successful individuals who can transform their communities.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut"
            }}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-50 via-white to-violet-50 border-2 border-purple-200/60 p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-200 md:duration-500 md:hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-3xl -ml-24 sm:-ml-32 -mt-24 sm:-mt-32"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200 md:duration-300">
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-3 sm:mb-4">
                To be a beacon of hope and excellence in education, creating a nurturing environment 
                where every child, regardless of their background, receives equal opportunities to excel.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed">
                We envision a future where our students become leaders, innovators, and change-makers, 
                breaking cycles of poverty through education and contributing meaningfully to society 
                with integrity, compassion, and excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
      </div>

      {/* Our Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-sky-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-100/20 to-blue-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="space-y-5 md:space-y-6 flex flex-col"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-blue-700 shadow-md mb-4"
          >
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              Our Journey
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">Our Story</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Heal Paradise School was born from a simple yet powerful belief: every child, regardless of 
              their circumstances, deserves access to world-class education. Founded in 2015, we began 
              with a mission to break the cycle of poverty through education.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              What started as a small initiative has grown into a beacon of hope, transforming the lives 
              of hundreds of students. We provide not just education, but a complete ecosystem of care, 
              support, and opportunity that empowers children to dream big and achieve their goals.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
              {['Compassionate Care', 'Excellence', 'Innovation', 'Impact'].map((tag, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.2, delay: 0.1 + idx * 0.03 }}
                  className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200/60 text-sm md:text-base font-semibold text-blue-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="relative mt-6 md:mt-0 h-full"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl h-full">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full">
                <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4 h-full">
                  <div className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[120px] sm:min-h-[150px] md:min-h-[200px]">
                    <img 
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=70&w=600&auto=format&fit=crop" 
                      alt="Students learning"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent"></div>
                </div>
                  <div className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[120px] sm:min-h-[150px] md:min-h-[200px]">
                    <img 
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=75&w=400&auto=format&fit=crop" 
                      alt="School building"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-600/40 to-transparent"></div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4 h-full pt-4 sm:pt-6 md:pt-8">
                  <div className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[120px] sm:min-h-[150px] md:min-h-[200px]">
                    <img 
                      src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=75&w=400&auto=format&fit=crop" 
                      alt="Classroom"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent"></div>
                  </div>
                  <div className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group min-h-[120px] sm:min-h-[150px] md:min-h-[200px]">
                    <img 
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=75&w=400&auto=format&fit=crop" 
                      alt="Students together"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-600/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent"></div>
      </div>

      {/* Core Values Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/15 to-pink-100/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-indigo-100/15 to-blue-100/15 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-purple-200/60 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm mb-4">
            <Heart className="w-4 h-4" />
            What We Stand For
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Our Core Values</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2 leading-relaxed">
            The principles that guide our actions and shape our community
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {values.map((value, index) => {
            const Icon = value.icon || Heart; // Fallback to Heart if icon is missing
            const cardStyles = [
              'rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50/90 to-white p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
              'rounded-3xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/60 p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
              'rounded-xl border-2 border-amber-200/60 bg-gradient-to-br from-amber-50/90 to-yellow-50/70 p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
              'rounded-2xl border-2 border-purple-200/60 bg-gradient-to-br from-purple-50/80 to-violet-50/60 p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
              'rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 to-blue-50/70 p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
              'rounded-xl border-2 border-rose-200/60 bg-gradient-to-br from-rose-50/90 via-pink-50/70 to-rose-50/60 p-6 sm:p-7 md:p-9 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 h-full group',
            ];
            const iconShapes = ['rounded-xl', 'rounded-full', 'rounded-lg', 'rounded-2xl', 'rounded-full', 'rounded-xl'];
            const iconSizes = ['w-16 h-16', 'w-18 h-18', 'w-14 h-14', 'w-16 h-16', 'w-18 h-18', 'w-14 h-14'];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.03, type: "spring", stiffness: 150 }}
              >
                <div className={cardStyles[index % cardStyles.length]}>
                  <div className={`${iconSizes[index % iconSizes.length]} ${iconShapes[index % iconShapes.length]} bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-xl ring-4 ring-white/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className={`${index % 2 === 0 ? 'w-8 h-8' : 'w-9 h-9'} text-white`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 md:mb-4">
                    {value.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
      </div>

      {/* Timeline Section */}
      <section className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 relative">
        <Timeline data={timelineData} />
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-1">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      {/* Academic Programs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-green-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm mb-4">
            <BookOpen className="w-4 h-4" />
            Our Programs
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
              Academic Programs
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2 leading-relaxed">
            Comprehensive curriculum designed to nurture academic excellence, critical thinking, and personal growth
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {[
            { 
              title: 'CBSE Curriculum', 
              subtitle: 'Recognized Excellence',
              description: 'Following the Central Board of Secondary Education curriculum with emphasis on conceptual understanding, critical thinking, and practical application of knowledge.',
              features: ['Classes I to XII', 'Regular assessments', 'Remedial support', 'Career guidance'],
              gradient: 'from-blue-500 to-sky-500',
              bg: 'from-blue-50/80 via-white to-sky-50/60',
              border: 'border-2 border-blue-300/60',
              shape: 'rounded-3xl',
              iconShape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=70&w=600&auto=format&fit=crop',
              icon: GraduationCap,
              stats: 'I-XII',
              badge: 'CBSE'
            },
            { 
              title: 'Special Programs', 
              subtitle: 'Holistic Development',
              description: 'Enrichment programs including STEM education, language development, life skills training, and value-based education to ensure holistic development.',
              features: ['STEM Labs', 'Language clubs', 'Life skills', 'Value education'],
              gradient: 'from-emerald-500 to-green-500',
              bg: 'from-emerald-50/80 via-white to-green-50/60',
              border: 'border-2 border-emerald-300/60',
              shape: 'rounded-3xl',
              iconShape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=70&w=600&auto=format&fit=crop',
              icon: Sparkles,
              stats: '4+ Programs',
              badge: 'Enrichment'
            },
            { 
              title: 'IVC Institution', 
              subtitle: 'Institution of Visually Challenged',
              description: 'A specialized institution dedicated to providing comprehensive education for visually challenged students. We offer Braille training, assistive technology, life skills development, and inclusive support to empower every student to achieve their full potential.',
              features: ['Braille education', 'Assistive technology', 'Life skills training', 'Inclusive support'],
              gradient: 'from-purple-500 to-violet-500',
              bg: 'from-purple-50/80 via-white to-violet-50/60',
              border: 'border-2 border-purple-300/60',
              shape: 'rounded-3xl',
              iconShape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=70&w=600&auto=format&fit=crop',
              icon: Eye,
              stats: 'Specialized',
              badge: 'IVC'
            },
          ].map((program, index) => {
            const Icon = program.icon || GraduationCap; // Fallback if icon is missing
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${program.bg} ${program.border} ${program.shape} overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 h-full relative`}>
                  {/* Decorative corner element */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${program.gradient} opacity-10 rounded-bl-full -mr-16 -mt-16`}></div>
                  
                  {/* Image Section */}
                  <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                    <img 
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      index === 0 ? 'from-blue-900/80 via-blue-900/40' : 
                      index === 1 ? 'from-emerald-900/80 via-emerald-900/40' : 
                      'from-purple-900/80 via-violet-900/40'
                    } to-transparent`}></div>
                    
                    {/* Icon Badge */}
                    <div className={`absolute top-6 right-6 w-16 h-16 ${program.iconShape} bg-gradient-to-br ${program.gradient} flex items-center justify-center shadow-2xl ring-4 ring-white/40 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                        <span className="text-xs font-bold text-slate-900">{program.stats}</span>
                      </div>
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                        <span className={`text-xs font-semibold bg-gradient-to-r ${program.gradient} bg-clip-text text-transparent`}>
                          {program.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">
                        {program.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/90 font-medium">
                        {program.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 sm:p-8 md:p-10 relative">
                    {/* Decorative line */}
                    <div className={`absolute top-0 left-8 right-8 h-1 bg-gradient-to-r ${program.gradient} opacity-20`}></div>
                    
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
                      {program.description}
                    </p>
                    
                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {program.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          className="flex items-start gap-2.5 group/item"
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${program.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}>
                            <CheckCircle className="w-3 h-3 text-white fill-white" />
                          </div>
                          <span className="text-sm sm:text-base text-slate-700 font-medium leading-snug">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Bottom accent */}
                    <div className={`mt-6 h-1 w-20 bg-gradient-to-r ${program.gradient} rounded-full`}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
      </div>

      {/* School Facilities Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-12 relative">
        <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-5 md:mb-7"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-2">
            World-Class <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Facilities</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            State-of-the-art infrastructure designed to support holistic learning and development
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              icon: Microscope, 
              title: 'Science Laboratories', 
              description: 'Fully equipped physics, chemistry, and biology labs with modern equipment', 
              gradient: 'from-blue-500 to-sky-500', 
              bg: 'from-blue-100/60 to-sky-100/40', 
              border: 'border-blue-300/50', 
              shape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=70&w=600&auto=format&fit=crop',
              features: ['Modern Equipment', 'Safety Protocols', 'Research Support'],
              details: 'Our state-of-the-art science laboratories provide students with hands-on learning experiences in physics, chemistry, and biology. Equipped with the latest scientific instruments and safety equipment, our labs foster curiosity and scientific inquiry. Students conduct experiments, analyze data, and develop critical thinking skills in a safe and supportive environment.',
              highlights: ['Advanced microscopes and lab equipment', 'Dedicated spaces for each science discipline', 'Regular safety training and protocols', 'Research projects and science fairs']
            },
            { 
              icon: Library, 
              title: 'Digital Library', 
              description: 'Extensive collection of books, e-resources, and quiet study spaces', 
              gradient: 'from-emerald-500 to-green-500', 
              bg: 'from-emerald-100/60 to-green-100/40', 
              border: 'border-emerald-300/50', 
              shape: 'rounded-3xl',
              image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=70&w=600&auto=format&fit=crop',
              features: ['10,000+ Books', 'E-Resources', 'Study Spaces'],
              details: 'Our digital library is a treasure trove of knowledge with over 10,000 books covering various subjects and genres. The library features quiet study areas, computer stations for research, and access to digital resources. Students can explore fiction, non-fiction, reference materials, and academic journals in a peaceful, inspiring environment.',
              highlights: ['Extensive book collection across all subjects', 'Digital resources and online databases', 'Quiet study zones and reading corners', 'Librarian support for research assistance']
            },
            { 
              icon: Code, 
              title: 'Computer Labs', 
              description: 'Modern computer labs with latest technology and software for digital learning', 
              gradient: 'from-purple-500 to-violet-500', 
              bg: 'from-purple-100/60 to-violet-100/40', 
              border: 'border-purple-300/50', 
              shape: 'rounded-xl',
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=70&w=600&auto=format&fit=crop',
              features: ['Latest Software', 'High-Speed Internet', 'Digital Learning'],
              details: 'Our modern computer laboratories are equipped with the latest technology to prepare students for the digital age. Each lab features high-performance computers, educational software, and high-speed internet connectivity. Students learn programming, digital design, research skills, and computer applications in a technology-rich environment.',
              highlights: ['Latest computers and hardware', 'Educational software and programming tools', 'High-speed internet and Wi-Fi', 'Digital literacy and coding programs']
            },
            { 
              icon: Dumbbell, 
              title: 'Sports Complex', 
              description: 'Spacious playgrounds, courts, and facilities for various sports activities', 
              gradient: 'from-amber-500 to-yellow-500', 
              bg: 'from-amber-100/60 to-yellow-100/40', 
              border: 'border-amber-300/50', 
              shape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=70&w=600&auto=format&fit=crop',
              features: ['Multiple Courts', 'Fitness Center', 'Outdoor Fields'],
              details: 'Our comprehensive sports complex includes indoor and outdoor facilities for various sports and physical activities. Students can participate in basketball, volleyball, football, athletics, and more. The complex features well-maintained courts, a fitness center, and open fields, promoting physical fitness, teamwork, and healthy competition.',
              highlights: ['Basketball and volleyball courts', 'Football and cricket fields', 'Fitness center with modern equipment', 'Athletics track and field events']
            },
            { 
              icon: Music, 
              title: 'Arts & Music Rooms', 
              description: 'Dedicated spaces for music, dance, drama, and visual arts programs', 
              gradient: 'from-rose-500 to-pink-500', 
              bg: 'from-rose-100/60 to-pink-100/40', 
              border: 'border-rose-300/50', 
              shape: 'rounded-3xl',
              image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=70&w=600&auto=format&fit=crop',
              features: ['Music Studio', 'Dance Hall', 'Art Gallery'],
              details: 'Our arts and music facilities provide creative spaces for students to explore their artistic talents. The music room is equipped with various instruments, the dance hall offers space for performances, and the art studio provides materials for painting, drawing, and crafts. These spaces nurture creativity, self-expression, and cultural appreciation.',
              highlights: ['Music room with various instruments', 'Dance hall for performances', 'Art studio with painting and craft materials', 'Regular cultural events and exhibitions']
            },
            { 
              icon: Home, 
              title: 'Residential Facilities', 
              description: 'Safe, comfortable hostels with 24/7 supervision and modern amenities', 
              gradient: 'from-indigo-500 to-blue-500', 
              bg: 'from-indigo-100/60 to-blue-100/40', 
              border: 'border-indigo-300/50', 
              shape: 'rounded-xl',
              image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=70&w=600&auto=format&fit=crop',
              features: ['24/7 Security', 'Modern Amenities', 'Comfortable Living'],
              details: 'Our residential facilities provide a safe, comfortable, and nurturing home away from home for students. The hostels feature well-furnished rooms, common areas, dining facilities, and 24/7 security. With dedicated house parents and support staff, students receive care, guidance, and supervision in a family-like environment.',
              highlights: ['Well-furnished and spacious rooms', 'Common areas for recreation and study', 'Dining facilities with nutritious meals', '24/7 security and house parent supervision']
            },
          ].map((facility, index) => {
            const Icon = facility.icon || Building2; // Fallback if icon is missing
            const iconShapes = ['rounded-full', 'rounded-xl', 'rounded-lg', 'rounded-full', 'rounded-2xl', 'rounded-lg'];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group perspective-1000"
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 2,
                  rotateX: -2,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div 
                  className={`relative bg-gradient-to-br ${facility.bg} border-2 ${facility.border} ${facility.shape} overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform-gpu`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated background glow */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${facility.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Image container */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img 
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
                    
                    {/* Icon badge - top right */}
                    <div 
                      className={`absolute top-3 right-3 w-12 h-12 ${iconShapes[index % iconShapes.length]} bg-gradient-to-br ${facility.gradient} flex items-center justify-center shadow-xl ring-2 ring-white/60`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="relative p-5 z-10 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {facility.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-slate-700 leading-relaxed mb-4 flex-1">
                      {facility.description}
                    </p>
                    
                    {/* Features badges - always visible */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {facility.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${facility.gradient} text-white shadow-md`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
      </div>

      {/* Extracurricular Activities Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-12 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tr from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Beyond the Classroom
                    </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
              Extracurricular
            </span>
            <br />
            <span className="text-slate-900">Activities</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2 leading-relaxed">
            Diverse activities to explore talents, build skills, and foster creativity beyond the classroom
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 relative z-10">
          {[
            { 
              icon: Music, 
              title: 'Music & Dance', 
              gradient: 'from-rose-500 to-pink-500', 
              bg: 'from-rose-50 to-pink-50', 
              border: 'border-rose-200/60', 
              shape: 'rounded-2xl',
              iconShape: 'rounded-full',
              image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Palette, 
              title: 'Art & Craft', 
              gradient: 'from-purple-500 to-violet-500', 
              bg: 'from-purple-50 to-violet-50', 
              border: 'border-purple-200/60', 
              shape: 'rounded-3xl',
              iconShape: 'rounded-xl',
              image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Dumbbell, 
              title: 'Sports', 
              gradient: 'from-amber-500 to-yellow-500', 
              bg: 'from-amber-50 to-yellow-50', 
              border: 'border-amber-200/60', 
              shape: 'rounded-xl',
              iconShape: 'rounded-lg',
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Code, 
              title: 'Coding Club', 
              gradient: 'from-blue-500 to-sky-500', 
              bg: 'from-blue-50 to-sky-50', 
              border: 'border-blue-200/60', 
              shape: 'rounded-2xl',
              iconShape: 'rounded-full',
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: BookOpen, 
              title: 'Debate & Quiz', 
              gradient: 'from-emerald-500 to-green-500', 
              bg: 'from-emerald-50 to-green-50', 
              border: 'border-emerald-200/60', 
              shape: 'rounded-3xl',
              iconShape: 'rounded-2xl',
              image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Users, 
              title: 'Community Service', 
              gradient: 'from-indigo-500 to-blue-500', 
              bg: 'from-indigo-50 to-blue-50', 
              border: 'border-indigo-200/60', 
              shape: 'rounded-xl',
              iconShape: 'rounded-lg',
              image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Globe, 
              title: 'Language Clubs', 
              gradient: 'from-teal-500 to-cyan-500', 
              bg: 'from-teal-50 to-cyan-50', 
              border: 'border-teal-200/60', 
              shape: 'rounded-2xl',
              iconShape: 'rounded-full',
              image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=70&w=600&auto=format&fit=crop'
            },
            { 
              icon: Lightbulb, 
              title: 'Science Club', 
              gradient: 'from-orange-500 to-red-500', 
              bg: 'from-orange-50 to-red-50', 
              border: 'border-orange-200/60', 
              shape: 'rounded-3xl',
              iconShape: 'rounded-xl',
              image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=70&w=600&auto=format&fit=crop'
            },
          ].map((activity, index) => {
            const Icon = activity.icon || Palette; // Fallback if icon is missing
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.03, type: "spring", stiffness: 150 }}
                className="group"
              >
                <div className={`bg-white border ${activity.border} ${activity.shape} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] h-full flex flex-col relative`}>
                  {/* Image Section */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img 
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    {/* Icon Badge - Top Right */}
                    <div className={`absolute top-3 right-3 w-12 h-12 sm:w-14 sm:h-14 ${activity.iconShape} bg-gradient-to-br ${activity.gradient} flex items-center justify-center shadow-2xl ring-4 ring-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Title Section with Colored Background */}
                  <div className={`bg-gradient-to-br ${activity.bg} p-4 sm:p-5 flex-1 flex items-center justify-center min-h-[70px]`}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 text-center leading-tight group-hover:text-slate-800 transition-colors">
                      {activity.title}
                      </h3>
                  </div>
                  
                  {/* Decorative bottom accent */}
                  <div className={`h-1 bg-gradient-to-r ${activity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
      </div>

      {/* Faculty & Staff Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8 md:mb-12 relative z-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-2">
            Our <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Dedicated Team</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Experienced educators and staff committed to student success
          </p>
        </motion.div>

        <div className="relative z-10">
          {/* Desktop: Horizontal layout with dividers */}
          <div className="hidden md:flex items-center justify-between gap-3 lg:gap-6">
            {[
              { icon: UserCheck, title: 'Qualified Teachers', value: '50+', description: 'Certified and experienced educators', gradient: 'from-indigo-500 to-purple-600', color: 'indigo' },
              { icon: GraduationCap, title: 'Subject Experts', value: '15+', description: 'Specialized faculty for each subject', gradient: 'from-teal-500 to-cyan-600', color: 'teal' },
              { icon: Heart, title: 'Support Staff', value: '30+', description: 'Caring staff for student welfare', gradient: 'from-orange-500 to-amber-600', color: 'orange' },
              { icon: Shield, title: 'Counselors', value: '5+', description: 'Professional guidance counselors', gradient: 'from-pink-500 to-rose-600', color: 'pink' },
            ].map((team, index) => {
              const Icon = team.icon || Users; // Fallback if icon is missing
              return (
                <React.Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 150 }}
                    className="flex-1 group relative"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Large number with gradient background */}
                    <div className="relative mb-6">
                      <motion.div
                        className={`relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${team.gradient} flex items-center justify-center shadow-2xl`}
                        whileHover={{ 
                          rotate: [0, -5, 5, -5, 0],
                          scale: 1.1,
                          transition: { duration: 0.5 }
                        }}
                        animate={{
                          boxShadow: [
                            `0 20px 40px -10px ${team.color === 'indigo' ? 'rgba(99, 102, 241, 0.3)' : team.color === 'teal' ? 'rgba(20, 184, 166, 0.3)' : team.color === 'orange' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                            `0 25px 50px -10px ${team.color === 'indigo' ? 'rgba(99, 102, 241, 0.5)' : team.color === 'teal' ? 'rgba(20, 184, 166, 0.5)' : team.color === 'orange' ? 'rgba(249, 115, 22, 0.5)' : 'rgba(236, 72, 153, 0.5)'}`,
                            `0 20px 40px -10px ${team.color === 'indigo' ? 'rgba(99, 102, 241, 0.3)' : team.color === 'teal' ? 'rgba(20, 184, 166, 0.3)' : team.color === 'orange' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                          ],
                        }}
                        transition={{
                          boxShadow: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        {/* Icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-12 h-12 text-white/20" />
                    </div>
                        {/* Number */}
                        <span className="relative z-10 text-5xl font-extrabold text-white drop-shadow-lg">
                          {team.value}
                        </span>
                      </motion.div>
                      
                      {/* Floating icon badge */}
                      <motion.div
                        className={`absolute -top-2 -right-2 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${team.gradient} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                  </div>
              </motion.div>
                    </div>

                    {/* Title and description */}
                    <div className="text-center">
                      <motion.h3 
                        className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:via-blue-600 group-hover:to-slate-900 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {team.title}
                      </motion.h3>
                      <p className="text-sm lg:text-base text-slate-600 leading-relaxed max-w-[200px] mx-auto">
                        {team.description}
                      </p>
                    </div>

                    {/* Decorative line */}
                    <motion.div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${team.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      whileHover={{ width: 100 }}
                    />
                  </motion.div>

                  {/* Divider between items (not after last) */}
                  {index < 3 && (
                    <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-4"></div>
                  )}
                </React.Fragment>
            );
          })}
          </div>

          {/* Mobile: Grid layout */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {[
              { icon: UserCheck, title: 'Qualified Teachers', value: '50+', description: 'Certified and experienced educators', gradient: 'from-indigo-500 to-purple-600', color: 'indigo' },
              { icon: GraduationCap, title: 'Subject Experts', value: '15+', description: 'Specialized faculty for each subject', gradient: 'from-teal-500 to-cyan-600', color: 'teal' },
              { icon: Heart, title: 'Support Staff', value: '30+', description: 'Caring staff for student welfare', gradient: 'from-orange-500 to-amber-600', color: 'orange' },
              { icon: Shield, title: 'Counselors', value: '5+', description: 'Professional guidance counselors', gradient: 'from-pink-500 to-rose-600', color: 'pink' },
            ].map((team, index) => {
              const Icon = team.icon || Users; // Fallback if icon is missing
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group text-center"
                >
                  {/* Compact mobile design */}
                  <motion.div
                    className={`relative w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br ${team.gradient} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <span className="absolute -bottom-1 -right-1 text-lg font-bold text-white bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      {team.value}
                    </span>
                  </motion.div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {team.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-tight">
                    {team.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      {/* Accreditation & Affiliations Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-2">
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Accreditation</span> & Affiliations
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Recognized and affiliated with leading educational bodies
          </p>
              </motion.div>

         <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-0">
          {[
            { 
              title: 'CBSE Affiliation', 
              icon: Award,
              gradient: 'from-blue-500 to-sky-500'
            },
            { 
              title: 'ISO Certified', 
              icon: CheckCircle,
              gradient: 'from-emerald-500 to-green-500'
            },
            { 
              title: 'Government Recognition', 
              icon: Shield,
              gradient: 'from-amber-500 to-yellow-500'
            },
          ].map((affiliation, index) => {
            const Icon = affiliation.icon || Award; // Fallback if icon is missing
            return (
                <React.Fragment key={index}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col items-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-12 lg:px-16"
                >
                  <div className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${affiliation.gradient} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                   </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 text-center">
                    {affiliation.title}
                  </h3>
                </motion.div>
                {index < 2 && (
                  <div className="hidden sm:block w-px h-16 md:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
      </div>

      {/* Partnerships Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-2">
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Partnerships</span> & Collaborations
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Building strong relationships with organizations to enhance educational opportunities
          </p>
        </motion.div>

        {/* Scrolling Logos Bar */}
        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 animate-scroll">
            {/* First set of logos */}
            {[
              { name: 'NGO Partner', icon: Handshake, gradient: 'from-blue-500 to-sky-500' },
              { name: 'Corporate Partner', icon: Building2, gradient: 'from-emerald-500 to-green-500' },
              { name: 'University Partner', icon: GraduationCap, gradient: 'from-purple-500 to-violet-500' },
              { name: 'Tech Partner', icon: Code, gradient: 'from-orange-500 to-red-500' },
              { name: 'Education Partner', icon: BookOpen, gradient: 'from-indigo-500 to-blue-500' },
              { name: 'Community Partner', icon: Users, gradient: 'from-rose-500 to-pink-500' },
              { name: 'Research Partner', icon: Lightbulb, gradient: 'from-teal-500 to-cyan-500' },
              { name: 'Global Partner', icon: Globe, gradient: 'from-amber-500 to-yellow-500' },
            ].map((partner, index) => {
              const Icon = partner.icon || Handshake; // Fallback if icon is missing
              return (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2 sm:gap-3 group w-[100px] sm:w-auto"
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-600 text-center max-w-[90px] sm:max-w-[100px] md:max-w-[120px] leading-tight">
                    {partner.name}
                  </p>
                </div>
              );
            })}
            
            {/* Duplicate set for seamless loop */}
            {[
              { name: 'NGO Partner', icon: Handshake, gradient: 'from-blue-500 to-sky-500' },
              { name: 'Corporate Partner', icon: Building2, gradient: 'from-emerald-500 to-green-500' },
              { name: 'University Partner', icon: GraduationCap, gradient: 'from-purple-500 to-violet-500' },
              { name: 'Tech Partner', icon: Code, gradient: 'from-orange-500 to-red-500' },
              { name: 'Education Partner', icon: BookOpen, gradient: 'from-indigo-500 to-blue-500' },
              { name: 'Community Partner', icon: Users, gradient: 'from-rose-500 to-pink-500' },
              { name: 'Research Partner', icon: Lightbulb, gradient: 'from-teal-500 to-cyan-500' },
              { name: 'Global Partner', icon: Globe, gradient: 'from-amber-500 to-yellow-500' },
            ].map((partner, index) => {
              const Icon = partner.icon || Handshake; // Fallback if icon is missing
              return (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2 sm:gap-3 group w-[100px] sm:w-auto"
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-600 text-center max-w-[90px] sm:max-w-[100px] md:max-w-[120px] leading-tight">
                    {partner.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10 perspective-1000">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-orange-300/60 bg-gradient-to-br from-orange-100/90 via-orange-50/70 to-amber-100/80 p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(251,146,60,0.4)] group transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Enhanced bright animated background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -right-12 sm:-right-20 -top-12 sm:-top-20 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gradient-to-br from-orange-400/60 to-amber-400/60 blur-3xl animate-pulse"></div>
            <div className="absolute -left-10 sm:-left-16 -bottom-10 sm:-bottom-16 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gradient-to-br from-amber-400/60 to-orange-400/60 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-gradient-to-r from-yellow-300/40 to-orange-300/40 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200/50 to-orange-200/50 blur-2xl animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          {/* Bright decorative corner accents with 3D effect */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-300/50 via-orange-200/40 to-transparent rounded-bl-full transform rotate-12"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-amber-300/50 via-amber-200/40 to-transparent rounded-tr-full transform -rotate-12"></div>
          
          {/* Animated shimmer effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          ></motion.div>
          
          {/* 3D depth effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/5 rounded-2xl md:rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center" style={{ transform: 'translateZ(20px)' }}>
            {/* Badge with 3D effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 border-2 border-orange-400/60 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-orange-800 shadow-lg mb-3 sm:mb-4 transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Get Involved
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-2 drop-shadow-lg transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              Join Our Mission
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed mb-5 sm:mb-6 md:mb-7 px-2 font-medium"
            >
              Be part of a community that's transforming lives through education. 
              Whether you're a student, parent, or supporter, there's a place for you at Heal Paradise.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4"
            >
              <motion.a
                href="#support"
                whileHover={{ 
                  scale: 1.08,
                  rotateY: 5,
                  rotateX: -2,
                  boxShadow: "0 20px 40px -10px rgba(251, 146, 60, 0.6)"
                }}
                whileTap={{ 
                  scale: 0.95,
                  rotateY: 0,
                  rotateX: 0,
                }}
                className="group relative rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white shadow-xl transition-all duration-200 active:scale-95 active:shadow-lg active:bg-gradient-to-r active:from-orange-600 active:via-orange-700 active:to-amber-700 text-center overflow-hidden transform-gpu touch-manipulation"
                style={{ transformStyle: 'preserve-3d', WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Support Us
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                {/* Active state overlay */}
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 active:opacity-100 transition-opacity duration-150"></div>
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ 
                  scale: 1.08,
                  rotateY: -5,
                  rotateX: -2,
                }}
                whileTap={{ 
                  scale: 0.95,
                  rotateY: 0,
                  rotateX: 0,
                }}
                className="group rounded-full bg-white/95 backdrop-blur-sm border-2 border-slate-300/60 px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-slate-900 shadow-lg transition-all duration-200 hover:shadow-xl hover:bg-white hover:border-slate-400 active:scale-95 active:shadow-md active:bg-slate-50 active:border-slate-400 text-center transform-gpu touch-manipulation"
                style={{ transformStyle: 'preserve-3d', WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="relative z-10">Contact Us</span>
                {/* Active state overlay */}
                <div className="absolute inset-0 bg-slate-200/40 rounded-full opacity-0 active:opacity-100 transition-opacity duration-150"></div>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
    </div>

      {/* Contact Information Section */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-100/20 to-sky-100/20 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-emerald-100/20 to-green-100/20 rounded-full blur-3xl -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="text-center mb-2 sm:mb-3 md:mb-4 relative z-10"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200/60 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-2 sm:mb-3">
            <MapPin className="w-3 h-3" />
            Get In Touch
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3 px-2">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">Contact Us</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto px-2 leading-relaxed">
            We're here to answer your questions and help you learn more about our school
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 relative z-10">
          {/* Contact Details */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="group p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 md:hover:scale-105"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Visit Us</h3>
                  <a 
                    href="https://www.google.com/maps/place/HEAL+PARADISE+SECONDARY+SCHOOL/@16.6476137,80.793083,17.08z/data=!4m6!3m5!1s0x3a35e10014e10cf7:0xa8b6e0e50c33ca9a!8m2!3d16.647596!4d80.791592!16s%2Fg%2F11y7fmrmgj?entry=ttu&g_ep=EgoyMDI1MTIwOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-slate-700 leading-relaxed hover:text-blue-600 transition-colors cursor-pointer block"
                  >
                    Heal Paradise School<br />
                    3-118, Thotapalli Village<br />
                    Agiripalli Madalam, Eluru District<br />
                    PIN Code: 521211
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="group p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 md:hover:scale-105"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <a href="tel:+91XXXXXXXXXX" className="hover:text-blue-600 transition-colors break-all">+91 XXXXXXXXXX</a><br />
                    <a href="tel:+91XXXXXXXXXX" className="hover:text-blue-600 transition-colors break-all">+91 XXXXXXXXXX</a>
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="group p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-2 border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 md:hover:scale-105"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <a href="mailto:info@healparadiseschool.edu" className="hover:text-blue-600 transition-colors break-all">info@healparadiseschool.edu</a><br />
                    <a href="mailto:admissions@healparadiseschool.edu" className="hover:text-blue-600 transition-colors break-all">admissions@healparadiseschool.edu</a>
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="group p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-md hover:shadow-lg transition-all duration-300 md:hover:scale-105"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Office Hours</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-blue-100 shadow-md mt-3 md:mt-0 w-full"
            style={{ height: '350px', maxHeight: '100%' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center z-0">
              <MapPin className="w-12 h-12 sm:w-14 sm:h-14 text-blue-300 animate-pulse" />
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.091091074091!2d80.791592!3d16.647596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35e10014e10cf7%3A0xa8b6e0e50c33ca9a!2sHEAL%20PARADISE%20SECONDARY%20SCHOOL!5e0!3m2!1sen!2sin!4v1702300000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Heal Paradise Secondary School Location"
            />
            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-white/5 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

