import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="text-brand-green" size={22} />
            <span className="font-display font-bold text-lg">AgriYuvaa</span>
          </div>
          <p className="text-sm text-white/60">
            Connecting young talent with careers across farming, agri-tech, and allied industries.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">For Job Seekers</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/jobs" className="hover:text-brand-green">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-brand-green">Create Profile</Link></li>
            <li><Link to="/seeker" className="hover:text-brand-green">My Applications</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">For Employers</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/register" className="hover:text-brand-green">Post a Job</Link></li>
            <li><Link to="/employers" className="hover:text-brand-green">Browse Employers</Link></li>
            <li><Link to="/employer" className="hover:text-brand-green">Employer Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/80">Company</h4>
          <ul className="space-y-2 text-sm text-white/60 mb-4">
            <li><Link to="/about" className="hover:text-brand-green">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-green">Contact</Link></li>
          </ul>
          <div className="flex gap-3">
            <Facebook size={18} className="text-white/60 hover:text-brand-green cursor-pointer" />
            <Instagram size={18} className="text-white/60 hover:text-brand-green cursor-pointer" />
            <Linkedin size={18} className="text-white/60 hover:text-brand-green cursor-pointer" />
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
