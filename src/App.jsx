import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants, pageTransition } from './utils/animations'

// Navbar loads immediately for instant display (critical for navigation)
import AppleNavbar from './components/layout/Navbar.jsx'
// Footer can be lazy loaded
const Footer = lazy(() => import('./components/layout/Footer.jsx'))
// ScrollToTop should load immediately to prevent scroll issues
import ScrollToTop from './components/layout/ScrollToTop.jsx'
// Error boundary for route-level error handling
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
// Structured data for SEO
import StructuredData from './components/common/StructuredData.jsx'

// Lazy load pages for code splitting with optimized loading
const AboutPage = lazy(() => import('./pages/AboutPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AwardsPage = lazy(() => import('./pages/AwardsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const AdmissionPage = lazy(() => import('./pages/AdmissionPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const WorkInProgressPage = lazy(() => import('./pages/WorkInProgressPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Minimal loading fallback - empty to avoid showing loading text
const LoadingFallback = () => null

const App = () => {
  const location = useLocation();
  
  // Define valid routes that should show navbar and footer
  const validRoutes = [
    '/',
    '/about',
    '/gallery',
    '/admission',
    '/contact',
  ];
  
  const isValidRoute = validRoutes.includes(location.pathname);
  
  // Disable browser scroll restoration on mount
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Intelligent preloading: preload critical pages immediately
  React.useEffect(() => {
    // Preload admission page immediately if on that route (no delay for critical content)
    if (location.pathname === '/' || location.pathname === '/admission') {
      import('./pages/AdmissionPage').catch(() => {});
    }
  }, [location.pathname]);
  
  // Preload admission page on mount for instant loading
  React.useEffect(() => {
    import('./pages/AdmissionPage').catch(() => {});
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground border-border outline-ring/50 bg-gradient-to-b from-neutral-50 to-white overflow-x-hidden">
      <StructuredData />
      <ScrollToTop />
      {isValidRoute && <AppleNavbar/>}
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white"></div>
        }>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen w-full"
            >
              <Routes location={location}>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/gallery' element={<GalleryPage/>}/>
                <Route path='/admission' element={<AdmissionPage/>}/>
                <Route path='/contact' element={<ContactPage/>}/>
                <Route path='/careers' element={<WorkInProgressPage/>}/>
                <Route path='/disclosure' element={<WorkInProgressPage/>}/>
                <Route path='/infrastructure/library' element={<WorkInProgressPage/>}/>
                <Route path='/infrastructure/labs' element={<WorkInProgressPage/>}/>
                <Route path='/infrastructure/sports-complex' element={<WorkInProgressPage/>}/>
                <Route path='/infrastructure/cafeteria' element={<WorkInProgressPage/>}/>
                <Route path='/academics/programs' element={<WorkInProgressPage/>}/>
                <Route path='/academics/faculty' element={<WorkInProgressPage/>}/>
                <Route path='/academics/curriculum' element={<WorkInProgressPage/>}/>
                {/* Catch-all route for any undefined routes */}
                <Route path='*' element={<NotFoundPage/>}/>
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
      {isValidRoute && (
        <Suspense fallback={null}>
          <Footer/>
        </Suspense>
      )}
    </div>
  )
}

export default App;
