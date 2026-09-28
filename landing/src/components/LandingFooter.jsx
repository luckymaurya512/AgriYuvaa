import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";

const LandingFooter = () => {
  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="AgriYuvaa" className="h-8 w-8 object-contain rounded-lg" />
              <span className="font-bold text-xl">
                Agri<span className="text-emerald-500">Yuvaa</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Best platform for agriculture students, committed to inspiring and empowering the next generation of agricultural leaders.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#25D366] text-white/50 hover:text-white flex items-center justify-center transition-all" aria-label="WhatsApp Community" title="Join WhatsApp Community">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.787-1.676-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.24-.244-.589-.493-.509-.678-.518-.175-.009-.376-.009-.577-.009-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.2 2.124 3.244 5.145 4.549.719.31 1.28.496 1.718.635.722.23 1.379.197 1.899.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.075-.125-.276-.2-.577-.35z"/><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.054 22l4.982-1.308A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167a8.136 8.136 0 01-4.148-1.135l-.297-.176-3.08.808.822-3.002-.193-.307A8.137 8.137 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/agriyuvaa/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600 text-white/50 hover:text-white flex items-center justify-center transition-all" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.instagram.com/agri_yuvaa/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-pink-600 text-white/50 hover:text-white flex items-center justify-center transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.youtube.com/@agri_yuvaa" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-600 text-white/50 hover:text-white flex items-center justify-center transition-all" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1GH5dT8Cuk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600 text-white/50 hover:text-white flex items-center justify-center transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-white/50 hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-white/50 hover:text-emerald-400 transition-colors">Blogs</Link></li>
              <li><Link to="/workshops" className="text-white/50 hover:text-emerald-400 transition-colors">Workshops</Link></li>
              <li><Link to="/contact" className="text-white/50 hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Workshops */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Our Workshops</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/50">🐝 Beekeeping Farming</span></li>
              <li><span className="text-white/50">🐟 Biofloc Fish Farming</span></li>
              <li><span className="text-white/50">🚁 Drone Technology</span></li>
              <li><span className="text-white/50">🌱 Hydroponics</span></li>
              <li><span className="text-white/50">🍄 Mushroom Farming</span></li>
            </ul>
          </div>

          {/* Job Portal CTA */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Job Portal</h4>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Find verified agriculture jobs, build your resume, and connect with top agri-employers across India.
            </p>
            <a
              href="https://job.agriyuvaa.com"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              Explore Jobs <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} AgriYuvaa. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Where Youth Meets Agriculture 🌾
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
