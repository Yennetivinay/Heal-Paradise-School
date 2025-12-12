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
      description: 'Book a campus tour to experience our facilities and environment'
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
    'Birth Certificate',
    'Previous School Records',
    'Transfer Certificate (if applicable)',
    'Medical Records',
    'Passport Size Photographs',
    'Parent/Guardian ID Proof'
  ];

  const grades = [
    'Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3',
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Admissions Open
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Join Heal Paradise School and embark on a journey of excellence, growth, and success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section - Admission Process Guide */}
      <section ref={videoContainerRef} className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 mb-4">
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
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  controlsList="nodownload"
                  preload="none"
                  loading="lazy"
                  poster="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format&q=75"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {/* Video Overlay Gradient */}
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
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-600" />
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
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Admission Process
                </h3>
                <div className="space-y-4">
                  {admissionProcess.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
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
                  <FileText className="w-5 h-5 text-blue-600" />
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
            <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Apply?
              </h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Click the button below to access our official admission form. The form will open in a new tab for your convenience.
              </p>
              <a
                href="https://forms.google.com/your-form-link-here"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Heal Paradise School?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience excellence in education with our comprehensive programs and dedicated faculty
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Award className="w-8 h-8" />, title: 'CBSE Affiliated', desc: 'Recognized curriculum' },
              { icon: <Users className="w-8 h-8" />, title: 'Expert Faculty', desc: 'Experienced teachers' },
              { icon: <Star className="w-8 h-8" />, title: 'Excellence', desc: 'Award-winning institution' },
              { icon: <GraduationCap className="w-8 h-8" />, title: 'Holistic Development', desc: 'Beyond academics' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionPage;

