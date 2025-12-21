import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Award3DCard from '../components/awards/Award3DCard';
import Trophy3D from '../components/awards/Trophy3D';
import AwardShowcase3D from '../components/awards/AwardShowcase3D';
import { CardStack } from '../components/gallery/CardStack';
import { 
  Trophy, 
  Award, 
  Medal, 
  Star, 
  Sparkles,
  TrendingUp,
  GraduationCap,
  Crown
} from 'lucide-react';

const AwardsPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Featured awards for showcase
  const featuredAwards = [
    {
      title: 'Best CBSE School',
      description: 'Recognized for outstanding academic excellence and holistic student development',
      year: '2024',
      icon: Trophy,
    },
    {
      title: 'Excellence in Education',
      description: 'Awarded for innovative teaching methods and exceptional student outcomes',
      year: '2023',
      icon: Award,
    },
    {
      title: 'Social Impact Award',
      description: 'Honored for transforming lives of underprivileged children through education',
      year: '2022',
      icon: Medal,
    },
    {
      title: 'Innovation in Teaching',
      description: 'Recognized for creative curriculum design and modern educational approaches',
      year: '2024',
      icon: Star,
    },
  ];

  // All awards grid
  const allAwards = [
    {
      title: 'Best CBSE School',
      description: 'Recognized for outstanding academic excellence and holistic student development programs.',
      year: '2024',
      category: 'Academic Excellence',
      icon: Trophy,
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      glowColor: 'rgba(251, 191, 36, 0.4)',
    },
    {
      title: 'Excellence in Education',
      description: 'Awarded for innovative teaching methods and exceptional student outcomes across all subjects.',
      year: '2023',
      category: 'Teaching Excellence',
      icon: Award,
      gradient: 'from-brand-400 via-brand-500 to-brand-600',
      glowColor: 'rgba(56, 189, 248, 0.4)',
    },
    {
      title: 'Social Impact Award',
      description: 'Honored for transforming lives of underprivileged children through quality education and care.',
      year: '2022',
      category: 'Social Responsibility',
      icon: Medal,
      gradient: 'from-emerald-400 via-green-500 to-emerald-600',
      glowColor: 'rgba(16, 185, 129, 0.4)',
    },
    {
      title: 'Innovation in Teaching',
      description: 'Recognized for creative curriculum design and modern educational technology integration.',
      year: '2024',
      category: 'Innovation',
      icon: Star,
      gradient: 'from-purple-400 via-violet-500 to-purple-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      title: 'Student Achievement',
      description: 'Celebrating exceptional student performance in national and international competitions.',
      year: '2023',
      category: 'Student Success',
      icon: GraduationCap,
      gradient: 'from-rose-400 via-pink-500 to-rose-600',
      glowColor: 'rgba(244, 63, 94, 0.4)',
    },
    {
      title: 'Community Leadership',
      description: 'Acknowledged for outstanding community engagement and educational outreach programs.',
      year: '2024',
      category: 'Leadership',
      icon: Crown,
      gradient: 'from-brand-400 via-brand-500 to-brand-600',
      glowColor: 'rgba(0, 152, 202, 0.4)',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-brand-200/20 via-brand-200/20 to-brand-200/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-20 lg:pb-28 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-700 shadow-sm mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Our Achievements</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold mb-4 sm:mb-6 px-4"
            >
              <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-600 bg-clip-text text-transparent">
                Awards &
              </span>
              <br />
              <span className="text-slate-900">Recognition</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Celebrating excellence, innovation, and impact in education
            </motion.p>
          </motion.div>

          {/* 3D Trophy Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center mb-16"
          >
            <Trophy3D size={250} glow={true} />
          </motion.div>
        </div>
      </section>

      {/* Featured Awards Showcase */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Featured <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Awards</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Our most prestigious recognitions and achievements
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <AwardShowcase3D awards={featuredAwards} />
        </div>
      </section>

      {/* Card Stack Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Explore Our <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Awards</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Swipe through our collection of achievements and recognitions
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CardStack
            cards={allAwards.map((award, index) => {
              const IconComponent = award.icon;
              return {
                id: `award-${index}`,
                title: award.title,
                description: award.description,
                icon: <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />,
                color: 'rgba(59, 130, 246, 0.1)',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
              };
            })}
            className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px]"
          />
        </div>
      </section>

      {/* All Awards Grid */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              All <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Achievements</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              A comprehensive collection of our awards and recognitions
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {allAwards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="h-[400px] sm:h-[450px] md:h-[500px] perspective-1000"
              >
                <Award3DCard
                  title={award.title}
                  description={award.description}
                  year={award.year}
                  category={award.category}
                  icon={award.icon}
                  gradient={award.gradient}
                  glowColor={award.glowColor}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-white backdrop-blur-xl border border-brand-200/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                { label: 'Total Awards', value: '50+', icon: Trophy },
                { label: 'Years Excellence', value: '10+', icon: Star },
                { label: 'National Recognition', value: '15+', icon: Award },
                { label: 'Student Achievements', value: '200+', icon: TrendingUp },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "0px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-700 text-sm md:text-base font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 md:py-24 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gradient-to-br from-brand-50 via-white to-brand-50/50 backdrop-blur-xl border border-brand-200/50 p-8 md:p-12 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-200/20 via-transparent to-brand-200/20 animate-pulse" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-brand-800 to-slate-900 bg-clip-text text-transparent mb-4">
                Join Our Award-Winning Community
              </h3>
              <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                Be part of an institution recognized for excellence in education
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/admission"
                  className="group rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-brand-700 hover:to-brand-600"
                >
                  Apply Now
                </Link>
                <a
                  href="/contact"
                  className="group rounded-full bg-white/80 backdrop-blur-md border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white hover:border-slate-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add CSS for 3D perspective */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default AwardsPage;

