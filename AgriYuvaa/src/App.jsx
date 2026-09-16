import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import WorkshopsPage from './pages/WorkshopsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import MobileLandingPage from './pages/MobileLandingPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isMobilePreview = location.pathname === '/mobile';

  if (isMobilePreview) {
    return (
      <>
        <ScrollToTop />
        <MobileLandingPage />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased font-body-md selection:bg-secondary-container selection:text-primary">
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
