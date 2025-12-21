import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// Import components directly for better performance (they're already optimized)
import { SpotlightCard } from '../components/common/SpotlightCard';
import TimelineCarousel from '../components/ui/TimelineCarousel';
import { 
  GraduationCap, 
  Heart, 
  Users, 
  Award, 
  Handshake, 
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
  Quote,
  UserCheck,
  Eye,
  Phone,
  Mail,
  Calendar,
  Cog,
  Presentation,
  X,
  ChevronLeft,
  ChevronRight
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
  // State for hover modal
  const [hoveredValue, setHoveredValue] = useState(null);

  // Core Values detailed data
  const coreValuesData = {
    cwa: {
      acronym: 'CWA',
      title: 'Compassion with Accountability',
      description: 'Care is unconditional, but growth requires discipline. HEAL combines empathy with clear expectations, structure, and responsibility.'
    },
    eai: {
      acronym: 'EAI',
      title: 'Equality and Inclusion',
      description: 'Every child is treated with dignity, regardless of background, disability, or past hardship. Inclusive education is practiced, not preached.'
    },
    iat: {
      acronym: 'IAT',
      title: 'Integrity and Transparency',
      description: 'Honesty in administration, education, and community engagement is non-negotiable. Trust is built through consistent action.'
    },
    ete: {
      acronym: 'ETE',
      title: 'Excellence through Effort',
      description: 'Children are encouraged to strive for their best, not perfection. Hard work, consistency, and self-belief are actively cultivated.'
    },
    sts: {
      acronym: 'STS',
      title: 'Service to Society',
      description: 'Education at HEAL instills a sense of social responsibility. Giving back is part of success, not an afterthought.'
    }
  };

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
    { icon: Handshake, value: 33, suffix: 'yrs+', label: 'Service', gradient: 'from-amber-500 to-yellow-500' },
    { icon: Users, value: 16000, suffix: '+', label: 'Students Enrolled', gradient: 'from-brand-500 to-brand-500' },
    { icon: GraduationCap, value: 99, suffix: '%', label: 'Pass Rate', gradient: 'from-emerald-500 to-green-500' },
    
    { icon: Heart, value: 100, suffix: '%', label: 'Scholarship Coverage', gradient: 'from-rose-500 to-pink-500' },
  ];


  // Timeline data for carousel
  const timelineData = [
    {
      id: 1,
      year: '1967',
      title: 'Praja Seva Samithi',
      description: 'Dr. Koneru Satya Prasad lays the foundation for social service. This marked the beginning of a lifelong mission rooted in community welfare.'
    },
    {
      id: 2,
      year: '1972',
      title: 'Mini Medical Care Centre',
      description: 'Accessible primary healthcare introduced at the grassroots. Its success proved the need for structured rural health interventions.'
    },
    {
      id: 3,
      year: '1992',
      title: 'HEAL UK',
      description: 'HEAL registered in the UK to mobilise global support. Funds raised enabled structured projects across India.'
    },
    {
      id: 4,
      year: '1993',
      title: 'HEAL India Begins',
      description: 'Dr. Prasad\'s ancestral home transformed into an orphanage. Twenty-six children found safety, care, and education.'
    },
    {
      id: 5,
      year: '1997',
      title: 'HEAL Children\'s Village',
      description: 'Foundation stone laid for a full-scale residential ecosystem. Capacity expanded to support 250 children.'
    },
    {
      id: 6,
      year: '2005',
      title: 'Boys\' Hostel Established',
      description: 'Infrastructure expanded to separate boys\' and girls\' hostels. This improved safety, discipline, and capacity.'
    },
    {
      id: 7,
      year: '2008',
      title: 'Cycle India',
      description: 'Biennial international fundraising initiative launched. Participants came from the UK, India, Kenya, Australia, and the USA.'
    },
    {
      id: 8,
      year: '2009',
      title: 'ZPH School, Kanuru',
      description: 'HEAL begins supporting a government school after multiple founder visits. A step towards strengthening public education.'
    },
    {
      id: 9,
      year: '2009',
      title: 'HEAL School, Bhadrachalam',
      description: 'School started for tribal and rural marginalised children. Over 400 children supported through education and care.'
    },
    {
      id: 10,
      year: '2012',
      title: 'HEAL Paradise',
      description: 'A self-sustaining residential model takes shape. Designed as a replicable blueprint for rural transformation.'
    },
    {
      id: 11,
      year: '2014',
      title: 'HEAL Australia',
      description: 'HEAL Australia registered in Robina, Queensland. Expanded the organisation\'s global footprint.'
    },
    {
      id: 12,
      year: '2014',
      title: 'HEAL School at Paradise',
      description: 'School launched with 57 students. Today, more than 800 children study on the campus.'
    },
    {
      id: 13,
      year: '2015',
      title: 'Institute for the Visually Challenged',
      description: 'Specialised education introduced with Braille and digital tools. Enabled independent living and skill development.'
    },
    {
      id: 14,
      year: '2015',
      title: 'HEAL Artificial Limb Centre',
      description: 'Free lower-limb support for children under 18. Extended to adults in 2020, with over 430 limbs provided.'
    },
    {
      id: 15,
      year: '2016',
      title: 'Escape Poverty Trap Program',
      description: 'Support extended to 15 government schools in Krishna District. Focused on breaking intergenerational poverty.'
    },
    {
      id: 16,
      year: '2017',
      title: 'Sports Project',
      description: 'Professional sports training introduced at HEAL Paradise. Students achieved national-level medals. A Sports Excellence Centre planned.'
    },
    {
      id: 17,
      year: '2018',
      title: 'Silver Jubilee',
      description: '25 years of HEAL celebrated. A commemorative souvenir documented transformed lives.'
    },
    {
      id: 18,
      year: '2019',
      title: 'Acupuncture Training',
      description: 'Medical training launched with BMAS India. Built alternative healthcare capacity among professionals.'
    },
    {
      id: 19,
      year: '2019',
      title: 'NIOS & Skill Development Centre',
      description: 'Affiliation secured to support destitute children. Focus on education, skills, and employability.'
    },
    {
      id: 20,
      year: '2020',
      title: 'Distance Education Faculty',
      description: 'Global educators onboarded during COVID-19. Learning continued without disruption.'
    },
    {
      id: 21,
      year: '2021',
      title: 'Elder Care Program',
      description: 'Elder Care Assistant course launched with a US partner. Created livelihood pathways in healthcare support.'
    },
    {
      id: 22,
      year: '2022',
      title: 'HEAL Canada',
      description: 'Registered as a charity under Canadian law. Strengthened international collaborations.'
    },
    {
      id: 23,
      year: '2022',
      title: 'HEAL Innovation Centre',
      description: 'Innovation-led learning and applied solutions initiated. Focused on technology and impact.'
    },
    {
      id: 24,
      year: '2022',
      title: 'Alekhya AI Centre of Excellence',
      description: 'Artificial Intelligence education institutionalised. Positioned HEAL at the forefront of future skills.'
    },
    {
      id: 25,
      year: '2023',
      title: 'Global Exposure',
      description: 'HEAL students travel to the USA. This marked direct international exposure and confidence building.'
    },
    {
      id: 26,
      year: '2023',
      title: 'Industry Integration',
      description: 'AI students secured placements through active industry collaborations. HEAL Paradise emerged as a working talent hub.'
    },
    {
      id: 27,
      year: '2023',
      title: 'Health Expansion',
      description: 'HEAL Health Centre inaugurated at Panjagutta, Hyderabad. A full-scale urban healthcare facility came into operation.'
    },
    {
      id: 28,
      year: '2024',
      title: 'Administrative Foundation',
      description: 'A state-of-the-art Administrative Centre established at HEAL Paradise. Centralised governance and operations strengthened.'
    },
    {
      id: 29,
      year: '2024',
      title: 'Centres of Excellence',
      description: 'Alekhya AI Centre of Excellence and Sports Excellence Centre formally strengthened. Focus shifted to high-performance outcomes.'
    },
    {
      id: 30,
      year: '2024',
      title: 'Higher Education Vision',
      description: 'Proposal initiated for a Deemed University under a distinct category. A long-term academic roadmap was defined.'
    },
    {
      id: 31,
      year: '2024',
      title: 'National Recognition',
      description: 'Dr. Koneru Satya Prasad honoured at the Sevaa Dharmik Awards. His decades of service received formal recognition.'
    },
    {
      id: 32,
      year: '2025',
      title: 'Global Honour',
      description: 'Dr. Koneru Satya Prasad receives the Roots Health Services Award 2025. International acknowledgement of leadership and impact.'
    },
    {
      id: 33,
      year: '2025',
      title: 'Student Global Leadership',
      description: 'Five HEAL students represented India at the ISF Global Junicorn & AI Summit. Event held at Texas State University, San Marcos, USA, on May 29–30.'
    }
  ];

  // Why Choose Us features
  const features = [
    {
      icon: GraduationCap,
      title: 'World-Class Education',
      description: 'CBSE curriculum with experienced faculty and modern teaching methodologies',
      gradient: 'from-brand-500 to-brand-500'
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
      gradient: 'from-brand-500 to-brand-500'
    },
  ];

  return (
    <main className="min-h-screen bg-white relative z-0 overflow-x-hidden">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24 pb-6 md:pt-28 md:pb-8 z-10 px-4 sm:px-6">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-brand-200/60 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-brand-700 shadow-lg mb-4 md:mb-6 hover:shadow-xl transition-shadow duration-300"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              About Heal School
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 200 }}
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 md:mb-5 px-2 leading-tight"
            >
              <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent drop-shadow-sm">
                Transforming Lives
              </span>
              <br />
              <span className="text-slate-900 drop-shadow-sm">Through Education</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-600 leading-relaxed font-medium text-center italic">
                &ldquo;Education at HEAL is not a service. It is a responsibility.&rdquo;
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mt-4 md:mt-6 text-justify w-full">
                Since its origins in 1968 as Praja Seva Samithi and formally established as HEAL in 1992, 
                the institution has existed for one clear reason: to break the cycle of poverty and abandonment 
                through disciplined, value-based education.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mt-4 md:mt-6 text-justify w-full">
                HEAL works with children who start life at a disadvantage. Orphans. Semi-orphans. Children from 
                severely underprivileged families. Many arrive with emotional trauma, learning gaps, and no stable 
                support system. Education alone is not enough for them. They need structure, care, dignity, and 
                long-term guidance.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mt-4 md:mt-6 text-justify w-full">
                HEAL functions as both parent and institution. It provides schooling, accommodation, nutrition, 
                healthcare, emotional security, and moral grounding under one roof. The goal is not just academic 
                success. The goal is to shape capable, self-reliant, socially responsible human beings.
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 relative z-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon || Users; // Fallback if icon is missing
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.3, delay: index * 0.03, type: "spring", stiffness: 150 }}
              >
                <SpotlightCard
                  className="rounded-2xl md:rounded-3xl border-2 border-brand-300/60 bg-gradient-to-br from-white via-white to-slate-50/80 backdrop-blur-sm p-6 sm:p-7 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full group hover:border-brand-400/80"
                  spotlightColor="#00abd940"
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
        <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>
      </div>

      {/* Mission & Vision Section */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="text-center mb-4 sm:mb-6 md:mb-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/60 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-brand-700 shadow-sm mb-3 sm:mb-4">
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            Our Purpose
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">Mission & Vision</span>
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
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-50 via-white to-brand-50 border-2 border-brand-300/60 p-4 sm:p-5 md:p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all duration-200 md:duration-500 md:hover:scale-[1.02] hover:border-brand-400/80"
          >
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-brand-200/30 to-brand-200/30 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-3 sm:mb-4 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200 md:duration-300">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-4 md:mb-4">
                Our Mission
              </h3>
              
              {/* Main Mission Statement */}
              <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed mb-3 sm:mb-4 md:mb-4 font-medium">
                To provide holistic education and care to orphaned and underprivileged children, enabling them to become educated, employable, and ethically grounded individuals.
              </p>

              {/* Subheading */}
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-3 sm:mb-3 md:mb-4 font-semibold">
                HEAL's mission goes beyond classroom learning. It focuses on building strong foundations through:
              </p>

              {/* Bullet Points */}
              <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4 md:mb-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mt-1.5 sm:mt-2 shadow-sm"></span>
                  <span className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed flex-1">
                    <span className="font-semibold text-brand-700">Quality formal education</span>
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mt-1.5 sm:mt-2 shadow-sm"></span>
                  <span className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed flex-1">
                    <span className="font-semibold text-brand-700">Residential care with discipline and safety</span>
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mt-1.5 sm:mt-2 shadow-sm"></span>
                  <span className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed flex-1">
                    <span className="font-semibold text-brand-700">Physical and mental well-being</span>
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mt-1.5 sm:mt-2 shadow-sm"></span>
                  <span className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed flex-1">
                    <span className="font-semibold text-brand-700">Moral and social values</span>
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 mt-1.5 sm:mt-2 shadow-sm"></span>
                  <span className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed flex-1">
                    <span className="font-semibold text-brand-700">Skill development and career readiness</span>
                  </span>
                </li>
              </ul>

              {/* Closing Statement */}
              <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-medium italic border-l-4 border-brand-500 pl-3 sm:pl-4 md:pl-5 py-1.5 sm:py-2 bg-gradient-to-r from-brand-50/50 to-transparent rounded-r-lg">
                Every child at HEAL is prepared not just to pass exams, but to stand independently in society with confidence and purpose.
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
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-50 via-white to-violet-50 border-2 border-purple-300/60 p-4 sm:p-5 md:p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all duration-200 md:duration-500 md:hover:scale-[1.02] hover:border-purple-400/80"
          >
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-3xl -ml-24 sm:-ml-32 -mt-24 sm:-mt-32"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-3 sm:mb-4 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200 md:duration-300">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-4 md:mb-4">
                Our Vision
              </h3>
              
              {/* Main Vision Statement */}
              <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed mb-3 sm:mb-4 md:mb-4 font-medium">
                To create a society where no child is denied education, dignity, or opportunity due to poverty, disability, or the absence of parental support.
              </p>

              {/* Vision Description */}
              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-3 sm:mb-3 md:mb-4 font-semibold">
                HEAL envisions a future where children from the most disadvantaged backgrounds emerge as professionals, leaders, and contributors to the nation. The long-term vision is self-sufficiency. Children should not remain dependent on charity. They should become capable of shaping their own lives and supporting others in return.
              </p>

              {/* Highlighted Closing Statement */}
              <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-medium italic border-l-4 border-purple-500 pl-3 sm:pl-4 md:pl-5 py-1.5 sm:py-2 bg-gradient-to-r from-purple-50/50 to-transparent rounded-r-lg">
                From dependency to independence, from receiving to giving—that is the HEAL vision.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>
      </div>

      {/* Core Values Section - Banner Style */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px", amount: 0.1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10 md:mb-12 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/60 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm mb-4">
            <Heart className="w-4 h-4" />
            What We Stand For
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">Our Core Values</span>
          </h2>
        </motion.div>

        {/* Core Values Banner - Horizontal Layout */}
              <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px", amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
                  </div>

            {/* Values Grid - 2 per row on mobile, single row on larger screens */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 relative z-10">
              {/* Value 1: Compassion with Accountability */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[3px] border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredValue('cwa')}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  CWA
                  </h3>
                <p className="text-xs sm:text-sm md:text-base text-amber-100 leading-tight">
                  Compassion with Accountability
                  </p>
              </motion.div>

              {/* Value 2: Equality and Inclusion */}
        <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[3px] border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredValue('eai')}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  EAI
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-amber-100 leading-tight">
                  Equality and Inclusion
          </p>
        </motion.div>

              {/* Value 3: Integrity and Transparency */}
          <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[3px] border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredValue('iat')}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  IAT
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-amber-100 leading-tight">
                  Integrity and Transparency
                </p>
              </motion.div>

              {/* Value 4: Excellence through Effort */}
                <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[3px] border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredValue('ete')}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
              </div>
            </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  ETE
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-amber-100 leading-tight">
                  Excellence through Effort
                </p>
          </motion.div>

              {/* Value 5: Service to Society - Centered in its own row on mobile only */}
          <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center text-center group col-span-2 sm:col-span-1 mx-auto max-w-xs sm:max-w-none"
              >
                <div className="relative mb-4 sm:mb-5">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[3px] border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredValue('sts')}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Handshake className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  STS
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-amber-100 leading-tight">
                  Service to Society
                </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

        {/* Core Values Hover Modal */}
        {typeof window !== 'undefined' && createPortal(
          <AnimatePresence>
            {hoveredValue && coreValuesData[hoveredValue] && (
          <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9998] pointer-events-none"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  margin: 0,
                  padding: 0,
                }}
              >
                {/* Backdrop - Dulls the screen */}
            <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-slate-900/50 pointer-events-none"
                />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative flex flex-col rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-2xl overflow-hidden pointer-events-auto"
                    style={{
                      border: '3px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '1.5rem',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                    }}
                    onMouseEnter={() => setHoveredValue(hoveredValue)}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    {/* Outer Card Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-50 pointer-events-none z-0" />
                    
                    {/* Letter Paper Effect */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
                    }} />
                    
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-transparent rounded-br-full pointer-events-none z-0" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-tl-full pointer-events-none z-0" />
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setHoveredValue(null)}
                      className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-white to-amber-50/50 hover:from-white hover:to-amber-100 border-2 border-amber-200/50 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm"
                      aria-label="Close"
                      style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <X className="w-3.5 h-3.5 text-slate-700 transition-colors duration-300" />
                    </button>

                    {/* Content Container - Reduced Padding */}
                    <div className="relative z-10 p-4 sm:p-5 md:p-6">
                      {/* Header */}
                <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-200/50 backdrop-blur-sm text-amber-900 text-xs font-semibold shadow-sm mb-3">
                          <Star className="w-3 h-3" />
                          <span>Core Value</span>
                </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                          {coreValuesData[hoveredValue].acronym}
                        </h3>
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-amber-700 mb-3">
                          {coreValuesData[hoveredValue].title}
                        </h4>
                        <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                          {coreValuesData[hoveredValue].description}
                        </p>
              </div>
            </div>
          </motion.div>
        </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </section>

      {/* Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>
      </div>

      {/* Testimonials Carousel Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px", amount: 0.1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/60 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm mb-4">
            <Star className="w-4 h-4" />
            Heal Journey
        </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">Milestones</span>
          </h2>
        </motion.div>

        {/* TimelineCarousel Component */}
        <TimelineCarousel 
          data={timelineData} 
          cardsPerView={4}
          cardsPerViewMobile={2}
          showPagination={true}
          showArrows={true}
        />
      </section>


      {/* Academic Programs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              transition={{ duration: 0.3 }}
          className="text-center mb-4 md:mb-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/50 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm mb-4">
            <BookOpen className="w-4 h-4" />
            Our Programs
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">
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
              gradient: 'from-brand-500 to-brand-500',
              bg: 'from-brand-50/80 via-white to-brand-50/60',
              border: 'border-2 border-brand-300/60',
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
                viewport={{ once: false, margin: "0px", amount: 0.1 }}
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
                      index === 0 ? 'from-brand-900/80 via-brand-900/40' : 
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
                          viewport={{ once: false, margin: "0px", amount: 0.1 }}
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
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
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
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
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
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed mb-5 sm:mb-6 md:mb-7 px-2 font-medium"
            >
              Be part of a community that's transforming lives through education. 
              Whether you're a student, parent, or supporter, there's a place for you at Heal Paradise.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "0px", amount: 0.1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4"
            >
              <motion.a
                href="https://healcharity.org/"
                target="_blank"
                rel="noopener noreferrer"
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
    </main>
  );
};

export default AboutPage;

