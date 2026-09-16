import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-card-border shadow-sm">
      <div className="flex justify-between items-center w-full px-6 lg:px-8 max-w-7xl mx-auto h-20">
        {/* Brand Logo Anchor */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="AgriYuvaa Logo"
            className="w-10 h-10 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105 shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-headline-sm font-headline-sm font-bold text-primary tracking-tight leading-tight">
              AgriYuvaa
            </span>
            <span className="text-label-badge font-label-badge text-slate-muted tracking-wider text-[10px]">
              WHERE YOUTH MEETS AGRICULTURE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-label-interactive text-label-interactive transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-slate-muted hover:text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Trailing Primary Action (Job Portal Bridge) */}
        <div className="flex items-center gap-3">
          <a
            href="https://job.agriyuvaa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-surface-container-lowest px-5 py-2.5 rounded-lg font-label-interactive text-label-interactive transition-all duration-200 shadow-sm hover:translate-y-[-1px] active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-lime"></span>
            </span>
            <span>Job Portal</span>
            <span className="material-symbols-outlined text-base">arrow_outward</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-primary hover:bg-mint-surface transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-card-border px-6 py-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`font-label-interactive py-2 text-base transition-colors ${
                isActive(link.path)
                  ? 'text-primary font-bold'
                  : 'text-slate-muted hover:text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/mobile"
            onClick={() => setMobileOpen(false)}
            className="text-secondary font-label-interactive py-2 text-sm flex items-center gap-1 border-t border-card-border pt-3"
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span>Preview Mobile App View</span>
          </Link>
        </div>
      )}
    </header>
  );
}
