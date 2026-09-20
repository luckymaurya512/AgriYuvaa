import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="AgriYuvaa" className="h-7 w-7 object-contain rounded-md" />
            <span className="font-display font-bold text-lg">AgriYuvaa</span>
          </div>
          <p className="text-sm text-white/60">
            Connecting young talent with careers across farming, agri-tech, and allied industries.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">For Job Seekers</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/jobs" className="hover:text-brand-green">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-brand-green">Create Profile</Link></li>
            <li><Link to="/seeker" className="hover:text-brand-green">My Applications</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">For Employers</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/register" className="hover:text-brand-green">Post a Job</Link></li>
            <li><Link to="/employers" className="hover:text-brand-green">Browse Employers</Link></li>
            <li><Link to="/employer" className="hover:text-brand-green">Employer Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">Company</h3>
          <ul className="space-y-2 text-sm text-white/60 mb-4">
            <li><Link to="/about" className="hover:text-brand-green">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-green">Contact</Link></li>
          </ul>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/agriyuvaa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AgriYuvaa on LinkedIn"
              className="text-white/60 hover:text-brand-green transition-colors p-1"
            >
              <Linkedin size={19} />
            </a>
            <a
              href="https://www.instagram.com/agri_yuvaa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AgriYuvaa on Instagram"
              className="text-white/60 hover:text-brand-green transition-colors p-1"
            >
              <Instagram size={19} />
            </a>
            <a
              href="https://www.youtube.com/@agri_yuvaa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AgriYuvaa on YouTube"
              className="text-white/60 hover:text-brand-green transition-colors p-1"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://www.facebook.com/share/1GH5dT8Cuk/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AgriYuvaa on Facebook"
              className="text-white/60 hover:text-brand-green transition-colors p-1"
            >
              <Facebook size={19} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} AgriYuvaa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
