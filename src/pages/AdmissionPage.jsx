import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Users,
  BookOpen,
  Star,
  Play,
  ExternalLink,
  Info
} from 'lucide-react';

const AdmissionPage = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    previousSchool: '',
    message: ''
  });

  const [isVideoVisible, setIsVideoVisible] = useState(true); // Set to true immediately for instant display
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Video lazy loading - only load video when section is visible, but show content immediately
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Only load video source when visible, but content is already shown
            const video = videoRef.current;
            if (video.readyState === 0) {
              video.load();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your interest! We will contact you soon.');
    // Reset form
    setFormData({
      studentName: '',
      parentName: '',
      email: '',
      phone: '',
      grade: '',
      previousSchool: '',
      message: ''
    });
  };

  const admissionProcess = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Submit Application',
      description: 'Fill out the online application form with all required details'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Schedule Visit',
      description: 'Our team will call you and schedule a Campus Visit for Assessment'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Assessment',
      description: 'Complete the entrance assessment and interview process'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Admission Decision',
      description: 'Receive admission confirmation and complete enrollment'
    }
  ];

  const requirements = [
    'Death Certificate(s) of parent(s), wherever applicable',
    'Income Certificate',
    'White Ration Card',
    'Aadhar Card of Student and Parent/Guardian',
    'Passport Size Photos of Student and Parent/Guardian',
    'Previous school academic records / marks sheets',
    'Transfer Certificate (if applicable)',
    'Any false or incorrect information submitted will lead to cancellation of admission at any stage'
  ];

  const grades = [
    'Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3',
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white pt-24 pb-20 md:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 mt-4 md:mt-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2">
              Admissions Open
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-2">
              Join Heal Paradise School and embark on a journey of excellence, growth, and success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section - Admission Process Guide */}
      <section ref={videoContainerRef} className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Guide Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-500 mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Admission Process Video Guide
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Watch our step-by-step guide to understand how to fill out the admission application form
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-6xl mx-auto mb-12"
          >
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/m0tyxgFoI2g?rel=0&modestbranding=1"
                  title="Admission Process Video Guide"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Instructions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-brand-300/60 hover:border-brand-400/80 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                  <Info className="w-6 h-6 text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Important Instructions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">
                        Please watch the complete video guide before proceeding to fill out the application form.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">
                        Ensure you have all required documents ready before starting the application process.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">
                        Fill out all mandatory fields marked with an asterisk (*) in the application form.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">
                        Double-check all information before submitting to avoid any delays in processing.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">
                        After submission, you will receive a confirmation email with further instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admission Process and Required Documents - Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admission Process */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  Admission Process
                </h3>
                <div className="space-y-4">
                  {admissionProcess.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Required Documents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* External Form Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="max-w-6xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 rounded-2xl shadow-2xl p-8 md:p-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Apply?
              </h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Click the button below to access our official admission form. The form will open in a new tab for your convenience.
              </p>
              <a
                href="https://heal.myclassboard.com/OnlineEnquiryForm_New/9A1FEF0D-66E5-4CF8-9CE4-061A80455A5F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>Open Admission Form</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-sm text-white/80 mt-4">
                The form will open in a new window
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
                Heal School
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-brand-600 font-semibold max-w-3xl mx-auto leading-relaxed">
              "<span className="italic">Symbol</span>" of <span className="text-brand-500">Excellence</span> in Education with Our Comprehensive Programs and Dedicated Faculty
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Award className="w-10 h-10" />, title: 'CBSE Affiliated', desc: 'Recognized curriculum', gradient: 'from-amber-400 to-orange-500' },
              { icon: <Users className="w-10 h-10" />, title: 'Expert Faculty', desc: 'Experienced teachers', gradient: 'from-blue-400 to-indigo-500' },
              { icon: <Star className="w-10 h-10" />, title: 'Excellence', desc: 'Award-winning institution', gradient: 'from-purple-400 to-pink-500' },
              { icon: <GraduationCap className="w-10 h-10" />, title: 'Holistic Development', desc: 'Beyond academics', gradient: 'from-emerald-400 to-teal-500' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 * index, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-xl text-center overflow-hidden border-2 border-transparent hover:border-brand-300 transition-all duration-500"
              >
                {/* Decorative background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-brand-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand-200/40 to-brand-300/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-brand-300/30 to-brand-200/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700"></div>

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-brand-500 to-transparent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-brand-500 to-transparent rounded-full transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-brand-500 to-transparent rounded-full transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                <div className="absolute bottom-0 right-0 w-1 h-20 bg-gradient-to-t from-brand-500 to-transparent rounded-full transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100"></div>

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                {/* Icon with gradient background */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                    {feature.icon}
                  </div>

                  {/* Glowing ring around icon on hover */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -mt-3`}></div>
                </div>

                <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors duration-300">{feature.title}</h3>
                <p className="relative z-10 text-base text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{feature.desc}</p>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400 rounded-full group-hover:w-3/4 transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionPage;

