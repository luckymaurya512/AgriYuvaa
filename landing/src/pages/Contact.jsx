import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, Send } from "lucide-react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            ⭐ Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Get In <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-base">
            Have queries about workshops, training partnerships, or agricultural initiatives? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Connect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Whether you are an aspiring agri-entrepreneur, a student looking to upskill, or an institution seeking workshop collaborations, our team is here to assist.
            </p>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Email</h4>
                  <p className="text-gray-500 text-sm">agriyuvaa@gmail.com</p>
                  <p className="text-xs text-gray-400 mt-1">We respond within 24 hours.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Phone</h4>
                  <p className="text-gray-500 text-sm">+91 98765 43210</p>
                  <p className="text-xs text-gray-400 mt-1">Mon - Sat, 9:00 AM to 6:00 PM</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Headquarters</h4>
                  <p className="text-gray-500 text-sm">New Delhi, India</p>
                  <p className="text-xs text-gray-400 mt-1">Serving agri-youth across 25+ states</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Follow Us On Social Media
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/agriyuvaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 flex items-center justify-center transition-colors text-sm font-bold"
                  aria-label="LinkedIn"
                >
                  in
                </a>
                <a
                  href="https://www.instagram.com/agri_yuvaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-colors text-sm font-bold"
                  aria-label="Instagram"
                >
                  ig
                </a>
                <a
                  href="https://www.youtube.com/@agri_yuvaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 flex items-center justify-center transition-colors text-sm font-bold"
                  aria-label="YouTube"
                >
                  yt
                </a>
                <a
                  href="https://www.facebook.com/share/1GH5dT8Cuk/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 flex items-center justify-center transition-colors text-sm font-bold"
                  aria-label="Facebook"
                >
                  fb
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4"
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">Send Us a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    placeholder="e.g. Workshop Registration Enquiry"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you need help with..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
