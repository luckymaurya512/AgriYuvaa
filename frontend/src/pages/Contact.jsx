import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-display font-bold mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-10">
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
