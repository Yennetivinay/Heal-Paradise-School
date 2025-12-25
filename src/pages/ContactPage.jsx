import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    // API endpoint - auto-detect network IP for local network access
    const getApiUrl = () => {
      // Use environment variable if set
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }

      // In development, try to detect the server IP
      if (import.meta.env.DEV) {
        // Get the current hostname (works for both localhost and network IP)
        const hostname = window.location.hostname;
        // If accessing from network IP, use that; otherwise use localhost
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          return `http://${hostname}:3001`;
        }
        // Fallback for localhost
        return 'http://localhost:3001';
      }

      // Default fallback (Production) - use relative path to let Nginx proxy handle it
      return '';
    };

    const API_URL = getApiUrl();

    let timeoutId;
    try {
      // Use AbortController for timeout (10 seconds max)
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          subject: formData.subject,
          message: formData.message,
        }),
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);
      const data = await response.json();

      if (data.success) {
        // Success - show popup immediately
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you for contacting us! We will get back to you soon.');
        setShowModal(true);
        setIsSubmitting(false); // Hide loading state immediately
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // API returned error - show popup
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        setShowModal(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('API Error:', error);
      setSubmitStatus('error');
      if (error.name === 'AbortError') {
        setSubmitMessage('Request timed out. Please check your connection and try again.');
      } else {
        setSubmitMessage('Sorry, there was an error sending your message. Please make sure the server is running or contact us directly.');
      }
      setShowModal(true);
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/HealVillage/', label: 'Facebook', color: 'from-brand-600 to-brand-700' },
    { icon: Twitter, href: 'https://x.com/Heal_Paradise', label: 'Twitter', color: 'from-brand-500 to-brand-600' },
    { icon: Instagram, href: 'https://www.instagram.com/heal_paradise/', label: 'Instagram', color: 'from-pink-500 to-rose-600' },
    { icon: Youtube, href: 'https://www.youtube.com/@Heal_Paradise', label: 'YouTube', color: 'from-red-600 to-red-700' },
    { icon: Linkedin, href: 'https://in.linkedin.com/company/heal-paradise', label: 'LinkedIn', color: 'from-brand-700 to-brand-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white pt-24 pb-16 md:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/20 animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 mt-4 md:mt-0">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-2">
              We're here to help and answer any questions you may have. Reach out to us and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "0px" }}
              transition={{ duration: 0.6 }}
              className="lg:order-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:scale-105'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "0px" }}
              transition={{ duration: 0.6 }}
              className="lg:order-1 space-y-6"
            >
              {/* Contact Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-50 border-2 border-brand-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-brand-400/80"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Visit Us</h3>
                      <a
                        href="https://maps.app.goo.gl/LCqzYAUXTDHkaz8U7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 leading-relaxed hover:text-brand-600 transition-colors cursor-pointer block"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-emerald-400/80"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <a href="tel:+919100024438" className="hover:text-brand-600 transition-colors font-medium">+91 9100024438</a>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-400/80"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <a href="mailto:info@healschool.org" className="hover:text-brand-600 transition-colors break-all font-medium">info@healschool.org</a><br />
                        <a href="mailto:healschool@healparadise.org" className="hover:text-brand-600 transition-colors break-all font-medium">healschool@healparadise.org</a>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "0px" }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-400/80"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Office Hours</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 9:00 AM - 1:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "0px" }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-600" />
                  Follow Us
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "0px" }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-md hover:shadow-xl transition-all duration-300`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Google Maps Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "0px" }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="relative rounded-2xl overflow-hidden border-2 border-brand-300/60 hover:border-brand-400/80 shadow-lg w-full transition-colors"
                style={{ height: '400px', maxHeight: '100%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-50 flex items-center justify-center z-0">
                  <MapPin className="w-16 h-16 sm:w-20 sm:h-20 text-brand-300 animate-pulse" />
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
                <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-white/5 via-transparent to-transparent rounded-2xl"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success/Error Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${submitStatus === 'success'
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
              }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors z-10"
            >
              <X className={`w-5 h-5 ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${submitStatus === 'success'
                  ? 'bg-green-100'
                  : 'bg-red-100'
                  }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-600" />
                )}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl font-bold mb-3 ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
              >
                {submitStatus === 'success' ? 'Message Sent Successfully!' : 'Oops! Something Went Wrong'}
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-base mb-6 leading-relaxed ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
              >
                {submitMessage}
              </motion.p>

              {/* Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowModal(false)}
                className={`px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${submitStatus === 'success'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                  }`}
              >
                {submitStatus === 'success' ? 'Got it!' : 'Try Again'}
              </motion.button>
            </div>

            {/* Decorative Elements */}
            {submitStatus === 'success' && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
              </>
            )}
            {submitStatus === 'error' && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200/30 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
