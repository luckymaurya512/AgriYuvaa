import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import SEO from "../components/SEO.jsx";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <SEO
        title="Contact Us"
        description="Contact AgriYuvaa support for employer job posting inquiries, recruiter partnerships, or candidate help."
        canonical="/contact"
      />
      <h1 className="text-2xl sm:text-3xl font-display font-bold mb-6 sm:mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="text-brand-green mt-1" size={18} />
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-sm text-brand-grey">support@agriyuvaa.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-brand-green mt-1" size={18} />
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-sm text-brand-grey">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-green mt-1" size={18} />
              <div>
                <p className="font-semibold text-sm">Office</p>
                <p className="text-sm text-brand-grey">New Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-grey mb-3">
              Connect on Social Media
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/agriyuvaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 flex items-center justify-center transition-colors shadow-2xs"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/agri_yuvaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-colors shadow-2xs"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@agri_yuvaa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 flex items-center justify-center transition-colors shadow-2xs"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1GH5dT8Cuk/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center justify-center transition-colors shadow-2xs"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="card p-6 text-sm text-brand-green-dark font-semibold">
            Thanks for reaching out — we'll get back to you shortly.
          </div>
        ) : (
          <form
            className="card p-6 space-y-4"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <input required placeholder="Your name" className="input-field text-sm" />
            <input required type="email" placeholder="Your email" className="input-field text-sm" />
            <textarea required placeholder="Message" rows={4} className="input-field text-sm" />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
