import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Handle logo click - navigate to landing page or scroll to top if already there
  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already on landing page, scroll to top
    if (location.pathname === "/") {
      // Use Lenis if available for smooth scroll
      if (window.lenis) {
        try {
          window.lenis.scrollTo(0, { 
            immediate: false,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } catch (err) {
          // Fallback if Lenis fails
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      } else {
        // Use native smooth scroll
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      
      // Also set scroll position directly as backup
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollY = 0;
      }, 100);
    } else {
      // Navigate to landing page (ScrollToTop component will handle scrolling)
      navigate("/");
    }
  };

  const quickLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Academics', to: '/academics/programs' },
    { label: 'Admissions', to: '/admission' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  const resources = [
    { label: 'Infrastructure', to: '/infrastructure/library' },
    { label: 'Faculty', to: '/academics/faculty' },
    { label: 'Disclosure', to: '/disclosure' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/HealVillage', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <a 
                href="/"
                onClick={handleLogoClick}
                className="bg-white w-10 h-10 rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:bg-slate-100 transition-colors relative"
              >
                {/* Placeholder logo - renders immediately */}
                {!logoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                      HP
                    </div>
                  </div>
                )}
                {/* Actual logo - fades in when loaded */}
                <img
                  src="/logo.png"
                  alt="Heal Paradise School Logo"
                  className={`h-8 w-auto object-contain transition-opacity duration-300 ${
                    logoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  width="32"
                  height="32"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  onLoad={() => setLogoLoaded(true)}
                  onError={() => setLogoLoaded(true)}
                />
              </a>
              <div>
                <a 
                  href="/"
                  onClick={handleLogoClick}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-lg font-bold text-white">Heal Paradise</h3>
                  <p className="text-xs text-slate-400">School</p>
                </a>
              </div>
            </div>
           
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <GraduationCap className="w-4 h-4 text-brand-400" />
              <span>CBSE Affiliated</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      // If clicking the same page link, scroll to top
                      if (location.pathname === link.to) {
                        e.preventDefault();
                        requestAnimationFrame(() => {
                          if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                            try {
                              window.lenis.scrollTo(0, {
                                duration: 1.5,
                                easing: (t) => 1 - Math.pow(1 - t, 3),
                                immediate: false
                              });
                            } catch (err) {
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            }
                          } else {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: 'smooth'
                            });
                          }
                          document.documentElement.scrollTop = 0;
                          document.body.scrollTop = 0;
                        });
                        setTimeout(() => {
                          if (window.scrollY > 0) {
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            if (window.scrollTo) {
                              window.scrollTo(0, 0);
                            }
                          }
                        }, 100);
                      }
                    }}
                    className="text-slate-300 hover:text-brand-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Resources</h4>
            <ul className="space-y-1.5">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      // If clicking the same page link, scroll to top
                      if (location.pathname === link.to) {
                        e.preventDefault();
                        requestAnimationFrame(() => {
                          if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                            try {
                              window.lenis.scrollTo(0, {
                                duration: 1.5,
                                easing: (t) => 1 - Math.pow(1 - t, 3),
                                immediate: false
                              });
                            } catch (err) {
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            }
                          } else {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: 'smooth'
                            });
                          }
                          document.documentElement.scrollTop = 0;
                          document.body.scrollTop = 0;
                        });
                        setTimeout(() => {
                          if (window.scrollY > 0) {
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            if (window.scrollTo) {
                              window.scrollTo(0, 0);
                            }
                          }
                        }, 100);
                      }
                    }}
                    className="text-slate-300 hover:text-brand-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  Heal Paradise School<br />
                  3-118, Thotapalli Village<br />
                  Agiripalli Madalam, Eluru District<br />
                  PIN Code: 521211
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="hover:text-brand-400 transition-colors">
                  +91 XXXXXXXXXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                <a href="mailto:info@healparadiseschool.edu" className="hover:text-brand-400 transition-colors break-all">
                  info@healparadiseschool.edu
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2 text-slate-400">Follow Us</h5>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('http') ? "_blank" : undefined}
                      rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-brand-500 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-slate-600 hover:border-brand-400"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center md:text-left">
              <p>
                ©  Heal Paradise School {currentYear}. All rights reserved.
              </p>
             
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link 
                to="/disclosure" 
                onClick={(e) => {
                  if (location.pathname === "/disclosure") {
                    e.preventDefault();
                    requestAnimationFrame(() => {
                      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                        try {
                          window.lenis.scrollTo(0, {
                            duration: 1.5,
                            easing: (t) => 1 - Math.pow(1 - t, 3),
                            immediate: false
                          });
                        } catch (err) {
                          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }
                      } else {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                    });
                    setTimeout(() => {
                      if (window.scrollY > 0) {
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                        if (window.scrollTo) {
                          window.scrollTo(0, 0);
                        }
                      }
                    }, 100);
                  }
                }}
                className="text-slate-400 hover:text-brand-400 transition-colors"
              >
                Disclosure
              </Link>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-brand-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-brand-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
     
    </footer>
  );
};

export default Footer;

