import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-deep-canopy text-outline-variant border-t border-primary-container">
      <div className="w-full px-6 lg:px-8 py-16 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Narrative Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center p-1 shadow-sm">
                <img src={logo} alt="AgriYuvaa" className="w-full h-full object-contain" />
              </div>
              <span className="text-headline-md font-headline-md font-bold text-surface-container-lowest">
                AgriYuvaa
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-outline-variant max-w-sm mb-6 leading-relaxed">
              Empowering the next generation of agriculture leaders with modern tech capabilities, practical workshops, and direct bridges to high-growth agribusiness careers.
            </p>
            <div className="flex items-center gap-2 text-electric-lime font-label-badge text-label-badge">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Where Youth Meets Agriculture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-headline-sm font-headline-sm text-surface-container-lowest text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-body-sm font-body-sm">
              <li>
                <Link to="/" className="hover:text-electric-lime transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-electric-lime transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-electric-lime transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-electric-lime transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop Tracks */}
          <div>
            <h4 className="text-headline-sm font-headline-sm text-surface-container-lowest text-sm uppercase tracking-wider mb-4">
              Focus Tracks
            </h4>
            <ul className="space-y-2.5 text-body-sm font-body-sm">
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Drone Piloting
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Hydroponics NFT
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Apiculture Mastery
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Biofloc Systems
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-electric-lime transition-colors duration-200">
                  Precision Sensors
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-headline-sm font-headline-sm text-surface-container-lowest text-sm uppercase tracking-wider mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-body-sm font-body-sm">
              <li>
                <a
                  href="https://job.agriyuvaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-electric-lime transition-colors duration-200 flex items-center gap-1 text-electric-lime font-medium"
                >
                  Job Portal <span className="material-symbols-outlined text-xs">north_east</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-electric-lime transition-colors duration-200">
                  Campus Ambassador
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-electric-lime transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/mobile" className="hover:text-electric-lime transition-colors duration-200">
                  Mobile View Preview
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Separator & Copyright */}
        <div className="pt-8 border-t border-primary-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body-sm text-outline-variant">
          <p>© 2025 AgriYuvaa. Empowering the next generation of agriculture leaders. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-electric-lime transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-electric-lime transition-colors">
              Campus Ambassador
            </Link>
            <a
              href="https://job.agriyuvaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-lime transition-colors"
            >
              Job Portal
            </a>
            <Link to="/contact" className="hover:text-electric-lime transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
