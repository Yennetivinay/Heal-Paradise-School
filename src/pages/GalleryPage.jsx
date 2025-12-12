import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomParallax } from '../components/gallery/ZoomParallax';
import IntroAnimation from '../components/gallery/IntroAnimation';
import GalleryCollections from '../components/gallery/GalleryCollections';
import { Camera, Heart, Star, Award, Users, Calendar, ArrowRight, X } from 'lucide-react';

const images = [
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Modern architecture building", category: "Events", featured: true, type: "image" },
  { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Urban cityscape at sunset", category: "Sports", featured: false, type: "image" },
  { src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Abstract geometric pattern", category: "Academics", featured: true, type: "image" },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Mountain landscape", category: "Events", featured: false, type: "image" },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Minimalist design elements", category: "Academics", featured: false, type: "image" },
  { src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Ocean waves and beach", category: "Sports", featured: true, type: "image" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=1200&fit=crop&auto=format&q=90", alt: "Forest trees and sunlight", category: "Events", featured: false, type: "image" },
  // Sample videos - replace with actual video URLs
  { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", alt: "School event highlights", category: "Events", featured: true, type: "video" },
  { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", alt: "Sports day celebration", category: "Sports", featured: false, type: "video" },
  { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", alt: "Academic achievement ceremony", category: "Academics", featured: true, type: "video" },
  { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", alt: "Annual day function", category: "Events", featured: false, type: "video" },
];

const GalleryPage = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if screen is desktop/web (1024px and above)
  useEffect(() => {
    let timeoutId;
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Debounce resize events to improve performance
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Function to handle modal state changes from child components
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle ESC key to close article modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedArticle) {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedArticle]);

  // Reset image index when article changes
  useEffect(() => {
    if (selectedArticle) {
      setCurrentImageIndex(0);
    }
  }, [selectedArticle]);

  // Auto-play carousel for multiple images
  useEffect(() => {
    if (!selectedArticle) return;
    
    const images = getArticleImages(selectedArticle);
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => {
      clearInterval(interval);
    };
  }, [selectedArticle]);

  // Get images array - support both single image and multiple images
  const getArticleImages = (article) => {
    if (article.images && Array.isArray(article.images) && article.images.length > 0) {
      return article.images;
    }
    return article.image ? [article.image] : [];
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden w-full">
      {/* Global Animated Background for Gallery Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 w-full">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/25 via-sky-100/25 to-blue-100/25 rounded-full blur-3xl" />
      </div>

      {/* Single Container for All Gallery Components */}
      <div className="relative z-10 w-full">
        {/* Intro Animation Section - At Top - Only on Desktop/Web */}
        {isDesktop ? (
          <section className="relative w-full">
            <IntroAnimation />
          </section>
        ) : null}

        {/* hero section */}
        <header className={`relative pb-2 md:pb-3 w-full ${isDesktop ? 'pt-2 md:pt-3' : 'pt-28 sm:pt-32'}`}>
          <div className="mx-auto max-w-7xl w-full px-2 sm:px-3 md:px-3 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 shadow-sm mb-2">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                <span>Photo Gallery</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold mb-2 px-2"
              >
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Our Gallery
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2"
              >
                Capturing moments of excellence, joy, and achievement in our school community
              </motion.p>
            </motion.div>
          </div>
        </header>

        {/* Zoom Parallax Gallery Section */}
        <section className="relative mt-1 md:mt-2 w-full">
          {Array.isArray(images) && images.length > 0 && (
            <ZoomParallax images={images.filter(img => img && (img.type === 'image' || !img.type)).slice(0, 7)} />
          )}
        </section>
        
        {/* Gallery Collections Component - Pass modal handlers if needed */}
        <GalleryCollections 
          images={images}
          onModalOpen={handleModalOpen}
          onModalClose={handleModalClose}
        />

        {/* Special Articles Section - Captured Memories */}
        <section className="relative py-6 sm:py-8 md:py-10 lg:py-12 w-full overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-sky-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-sky-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 border border-blue-200/50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-3"
              >
                <Star className="w-4 h-4" />
                <span>Special Articles</span>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Captured Memories
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                In-depth stories and special moments from our school community
              </p>
            </motion.div>

            {/* Special Articles List */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {[
                {
                  title: "Annual Day Celebration: A Night to Remember",
                  excerpt: "Our annual day celebration brought together students, parents, and faculty for an unforgettable evening of talent, creativity, and joy. From mesmerizing dance performances to soul-stirring musical renditions, the night showcased the incredible diversity of talent within our school community.",
                  fullContent: "Our annual day celebration brought together students, parents, and faculty for an unforgettable evening of talent, creativity, and joy. From mesmerizing dance performances to soul-stirring musical renditions, the night showcased the incredible diversity of talent within our school community.\n\nThe evening began with a warm welcome from our principal, setting the tone for what would become a magical night. Students from all grades took to the stage, displaying their artistic talents through various forms of expression. The dance performances ranged from classical Indian dances to contemporary Western styles, each telling a unique story.\n\nMusical performances were equally captivating, with students showcasing their vocal and instrumental skills. The school choir delivered a powerful rendition that moved the audience, while individual performers demonstrated exceptional talent on various instruments.\n\nThe event also featured dramatic performances, with students bringing to life stories that resonated with themes of friendship, perseverance, and hope. The creativity and dedication shown by our students were truly inspiring.\n\nAs the night drew to a close, the sense of community and celebration was palpable. Parents, teachers, and students came together to celebrate not just the performances, but the spirit of unity and excellence that defines our school.",
                  date: "March 15, 2024",
                  category: "Events",
                  readTime: "5 min read",
                  gradient: "from-blue-500 to-sky-500",
                  image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop&auto=format&q=90",
                  images: [
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop&auto=format&q=90",
                    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&auto=format&q=90"
                  ],
                },
                {
                  title: "Sports Championship: Champions of Excellence",
                  excerpt: "The annual sports championship witnessed fierce competition, outstanding sportsmanship, and moments of pure triumph. Our athletes demonstrated not just physical prowess but also the values of teamwork, perseverance, and fair play that define our school spirit.",
                  fullContent: "The annual sports championship witnessed fierce competition, outstanding sportsmanship, and moments of pure triumph. Our athletes demonstrated not just physical prowess but also the values of teamwork, perseverance, and fair play that define our school spirit.\n\nThe championship spanned three days of intense competition across multiple sports disciplines. Track and field events saw record-breaking performances, with several students setting new school records. The relay races were particularly thrilling, showcasing the importance of teamwork and coordination.\n\nTeam sports like football, basketball, and volleyball brought out the best in our students. The matches were closely contested, with every team giving their all. What stood out most was the sportsmanship displayed by all participants, regardless of the outcome.\n\nIndividual events such as swimming, tennis, and badminton highlighted the personal achievements of our students. Many participants overcame personal challenges to deliver outstanding performances.\n\nThe closing ceremony was a celebration of all participants, not just the winners. Medals and trophies were awarded, but the real victory was in the spirit of competition, friendship, and mutual respect that permeated throughout the event.",
                  date: "February 28, 2024",
                  category: "Sports",
                  readTime: "4 min read",
                  gradient: "from-sky-500 to-blue-500",
                  image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&auto=format&q=90",
                },
                {
                  title: "Science Fair: Innovation Meets Imagination",
                  excerpt: "Young scientists and innovators took center stage at our annual science fair, presenting groundbreaking projects that addressed real-world challenges. From renewable energy solutions to medical innovations, our students proved that age is no barrier to scientific excellence.",
                  fullContent: "Young scientists and innovators took center stage at our annual science fair, presenting groundbreaking projects that addressed real-world challenges. From renewable energy solutions to medical innovations, our students proved that age is no barrier to scientific excellence.\n\nThe fair featured over 50 projects covering various scientific disciplines. Environmental science projects focused on sustainable solutions, including water purification systems and solar-powered devices. These projects demonstrated our students' awareness of global challenges and their commitment to finding solutions.\n\nMedical and health-related projects showcased innovations in healthcare technology. Students developed prototypes for assistive devices and presented research on disease prevention, showing both technical skill and empathy for those in need.\n\nEngineering projects ranged from robotics to structural engineering, with students building functional prototypes that solved practical problems. The creativity and technical expertise on display were remarkable.\n\nJudges from local universities and industries were impressed by the quality of research and presentation. Many projects received recognition for their innovation and potential real-world applications. The fair not only celebrated scientific achievement but also inspired younger students to pursue their own scientific interests.",
                  date: "February 10, 2024",
                  category: "Academics",
                  readTime: "6 min read",
                  gradient: "from-blue-600 to-sky-600",
                  image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop&auto=format&q=90",
                },
                {
                  title: "Cultural Fest: Celebrating Diversity",
                  excerpt: "Our cultural festival was a vibrant tapestry of traditions, languages, and customs from around the world. Students showcased their heritage through dance, music, food, and art, creating an atmosphere of unity in diversity that truly represents our school's inclusive spirit.",
                  fullContent: "Our cultural festival was a vibrant tapestry of traditions, languages, and customs from around the world. Students showcased their heritage through dance, music, food, and art, creating an atmosphere of unity in diversity that truly represents our school's inclusive spirit.\n\nThe festival grounds were transformed into a global village, with each section representing different cultures. Students dressed in traditional attire, sharing stories and customs from their backgrounds. The diversity was not just visible but celebrated with enthusiasm and respect.\n\nFood stalls offered a culinary journey around the world, with students and parents preparing traditional dishes. The aromas and flavors brought people together, creating conversations and connections across cultural boundaries.\n\nArt exhibitions displayed traditional and contemporary works from various cultures. Students created beautiful displays that educated visitors about different artistic traditions and their significance.\n\nPerformances throughout the day included traditional dances, music, and storytelling. Each performance was met with appreciation and applause, showing the community's respect for all cultures. The festival concluded with a grand finale that brought together elements from all represented cultures, symbolizing unity in diversity.",
                  date: "January 22, 2024",
                  category: "Events",
                  readTime: "5 min read",
                  gradient: "from-sky-600 to-blue-600",
                  image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&auto=format&q=90",
                },
                {
                  title: "Graduation Ceremony: New Beginnings",
                  excerpt: "As we bid farewell to our graduating class, we celebrated not just their academic achievements but also their growth as individuals. These young leaders are now ready to make their mark on the world, carrying forward the values and knowledge they've gained during their time with us.",
                  fullContent: "As we bid farewell to our graduating class, we celebrated not just their academic achievements but also their growth as individuals. These young leaders are now ready to make their mark on the world, carrying forward the values and knowledge they've gained during their time with us.\n\nThe ceremony was a momentous occasion, filled with pride, emotion, and hope. Graduates walked across the stage to receive their diplomas, each step representing years of hard work, dedication, and personal growth. The applause from families and friends filled the auditorium with warmth and celebration.\n\nValedictorian speeches reflected on the journey, acknowledging both challenges overcome and friendships formed. Students spoke about the lessons learned beyond textbooks - lessons in resilience, empathy, and leadership.\n\nFaculty members shared memories and words of encouragement, reminding graduates that they carry with them not just knowledge, but also the values of integrity, compassion, and excellence that define our school community.\n\nAs the ceremony concluded, there was a sense of both ending and beginning. While we said goodbye to these students, we also celebrated the start of their next chapter. They leave us as confident, capable individuals ready to contribute meaningfully to society.",
                  date: "May 30, 2024",
                  category: "Academics",
                  readTime: "7 min read",
                  gradient: "from-blue-500 to-sky-500",
                  image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&auto=format&q=90",
                },
                {
                  title: "Community Service: Making a Difference",
                  excerpt: "Our students dedicated their time and energy to various community service initiatives, from environmental cleanups to supporting local charities. These experiences taught valuable lessons about empathy, responsibility, and the power of collective action in creating positive change.",
                  fullContent: "Our students dedicated their time and energy to various community service initiatives, from environmental cleanups to supporting local charities. These experiences taught valuable lessons about empathy, responsibility, and the power of collective action in creating positive change.\n\nThroughout the year, students participated in numerous service projects. Environmental initiatives included beach cleanups, tree planting drives, and awareness campaigns about conservation. These activities not only helped the environment but also instilled a sense of environmental responsibility in our students.\n\nCharity work involved supporting local shelters, organizing food drives, and visiting elderly care facilities. Students learned about the challenges faced by different segments of society and discovered the joy that comes from helping others.\n\nEducational outreach programs saw our students tutoring younger children and organizing workshops in underprivileged areas. These experiences were mutually beneficial, helping both the tutors and those being tutored.\n\nThe impact of these service activities extended beyond the immediate beneficiaries. Students returned with new perspectives, greater empathy, and a deeper understanding of their role in society. The community service program has become an integral part of our educational mission, shaping not just students' academic growth but their character as well.",
                  date: "April 12, 2024",
                  category: "Events",
                  readTime: "5 min read",
                  gradient: "from-sky-500 to-blue-500",
                  image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop&auto=format&q=90",
                },
              ].map((article, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200/60 hover:border-blue-300/60 flex flex-col md:flex md:flex-row"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Article Image */}
                  <div className="relative w-full md:w-1/2 h-40 sm:h-44 md:h-64 overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width="600"
                      height="400"
                      decoding="async"
                      style={{ aspectRatio: '3/2' }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    {/* Article Badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
                      <Star className="w-3.5 h-3.5" />
                      <span>Article</span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                    {/* Article Meta */}
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {article.title}
                    </h3>

                    {/* Article Excerpt */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Read More Link */}
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="mt-auto flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all duration-300 text-left"
                    >
                      <span className="text-sm font-semibold">Read Full Article</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Decorative Accent */}
                  <div className={`absolute right-0 top-0 w-1 h-full bg-gradient-to-b ${article.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action & Share Section */}
        <section className="relative py-6 sm:py-10 md:py-12 lg:py-14 mt-2 md:mt-4 w-full">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-8">
            {/* Statistics & Achievements Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
            >
              {[
                {
                  icon: <Camera className="w-8 h-8 sm:w-10 sm:h-10" />,
                  number: '500+',
                  label: 'Memories Captured',
                  color: 'from-blue-500 to-sky-500',
                },
                {
                  icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
                  number: '1000+',
                  label: 'Happy Students',
                  color: 'from-sky-500 to-blue-500',
                },
                {
                  icon: <Award className="w-8 h-8 sm:w-10 sm:h-10" />,
                  number: '50+',
                  label: 'Events Celebrated',
                  color: 'from-blue-600 to-sky-600',
                },
                {
                  icon: <Heart className="w-8 h-8 sm:w-10 sm:h-10" />,
                  number: '24/7',
                  label: 'Community Support',
                  color: 'from-sky-600 to-blue-600',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative rounded-2xl bg-white p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* Optional: You can add a global modal overlay indicator if needed */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full opacity-75">
            Gallery View
          </div>
        </div>
      )}

      {/* Letter-Style Article Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center px-2 sm:px-4"
              onClick={(e) => {
                // Close modal when clicking on backdrop (not on modal content)
                if (e.target === e.currentTarget) {
                  setSelectedArticle(null);
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Article"
              tabIndex={0}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <motion.div
                className="relative flex w-full max-w-6xl flex-col rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-2xl overflow-hidden h-[90vh] md:h-[85vh]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  maxHeight: '90vh',
                  maxWidth: '95vw',
                  margin: 'auto',
                  cursor: 'default',
                  border: '3px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                {/* Outer Card Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-50 pointer-events-none z-0" />
                
                {/* Letter Paper Effect */}
                <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
                }} />
                
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-br-full pointer-events-none z-0" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-tl-full pointer-events-none z-0" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-gradient-to-br from-white to-amber-50/50 hover:from-white hover:to-amber-100 border-2 border-amber-200/50 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm"
                  aria-label="Close article"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <X className="w-5 h-5 text-slate-700 transition-colors duration-300" />
                </button>

                {/* Scrollable Content Container - Side by Side Layout */}
                <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden min-h-0 relative z-10">
                  {/* Image Section - Top on Mobile, Right on Desktop */}
                  {(() => {
                    const images = getArticleImages(selectedArticle);
                    const hasMultipleImages = images.length > 1;
                    
                    return (
                      <div className="flex-[1.5] md:order-2 relative overflow-hidden border-t-2 md:border-t-0 md:border-l-2 border-amber-200/50" style={{
                        boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.05), 0 -2px 8px rgba(251, 191, 36, 0.1)'
                      }}>
                        <div className="hidden md:block absolute inset-0" style={{
                          borderLeft: '2px solid',
                          borderImage: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.3)) 1',
                          boxShadow: 'inset 4px 0 8px rgba(0, 0, 0, 0.05), -2px 0 8px rgba(251, 191, 36, 0.1)'
                        }} />
                        
                        {/* Image Carousel */}
                        <div className="absolute inset-0">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                              key={currentImageIndex}
                              src={images[currentImageIndex]}
                              alt={`${selectedArticle.title} - Image ${currentImageIndex + 1}`}
                              className="w-full h-full object-cover"
                              loading="eager"
                              width="800"
                              height="1200"
                              decoding="async"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                filter: 'brightness(1.02) contrast(1.05) saturate(1.1)',
                                aspectRatio: '2/3'
                              }}
                            />
                          </AnimatePresence>
                          
                          {/* Multi-layer Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-l from-amber-50/60 via-amber-50/20 to-transparent pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Image Border Glow */}
                          <div className="absolute inset-0 ring-1 ring-amber-200/30 pointer-events-none" />
                        </div>
                        
                        {/* Carousel Indicators - Only show if multiple images */}
                        {hasMultipleImages && (
                          <>
                            {/* Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                              {images.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                  }}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex 
                                      ? 'bg-white w-6 shadow-lg' 
                                      : 'bg-white/50 hover:bg-white/70'
                                  }`}
                                  aria-label={`Go to image ${index + 1}`}
                                />
                              ))}
                            </div>
                            
                            {/* Image Counter */}
                            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {currentImageIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                        
                        {/* Decorative Corner on Image */}
                        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full backdrop-blur-sm pointer-events-none" />
                      </div>
                    );
                  })()}
                  
                  {/* Left Side - Text Content - Inner Card */}
                  <div 
                    className="flex-[2.5] md:order-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 md:p-10 lg:p-12 relative bg-gradient-to-br from-white/80 via-amber-50/30 to-white/80 backdrop-blur-sm" 
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain',
                      touchAction: 'pan-y',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(251, 191, 36, 0.1)'
                    }}
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchMove={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {/* Inner Card Decorative Elements */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-amber-300/30 via-transparent to-transparent" />
                    {/* Letter Header */}
                    <div className="mb-6 pb-4 border-b-2 border-amber-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Special Article</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                        {selectedArticle.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{selectedArticle.date}</span>
                        </div>
                        <span>•</span>
                        <span>{selectedArticle.readTime}</span>
                        <span>•</span>
                        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                          {selectedArticle.category}
                        </span>
                      </div>
                    </div>

                    {/* Letter Body */}
                    <div className="prose prose-lg max-w-none">
                      <div className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                        {selectedArticle.fullContent || selectedArticle.excerpt}
                      </div>
                    </div>

                    {/* Letter Footer */}
                    <div className="mt-8 pt-4 border-t-2 border-amber-300">
                      <p className="text-xs sm:text-sm text-slate-600 italic">
                        Published by Heal Paradise School
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
};

export default GalleryPage;