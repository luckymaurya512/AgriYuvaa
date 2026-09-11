import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingNavbar from "./components/LandingNavbar.jsx";
import LandingFooter from "./components/LandingFooter.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import About from "./pages/About.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import WorkshopList from "./pages/WorkshopList.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <ScrollToTop />
      <LandingNavbar />
      <main className="flex-1 w-full max-w-full min-w-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/workshops" element={<WorkshopList />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <LandingFooter />
    </div>
  );
}

export default App;
