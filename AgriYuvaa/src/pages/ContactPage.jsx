import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    icon: "verified",
    question: "When will I get my workshop certificate?",
    answer: "All digital verified certificates are issued within 48 hours following completion of the capstone project or final workshop evaluation. You can verify certificates via our online badge portal."
  },
  {
    icon: "work",
    question: "How do I post a job or hire graduates?",
    answer: "Recruiters can list open agri-tech positions directly through job.agriyuvaa.com or contact our university talent team through this form selecting 'Job Portal / Hiring Support'."
  },
  {
    icon: "hub",
    question: "Can our college organize a customized offline drone or IoT camp?",
    answer: "Yes! We organize 2-day to 5-day on-campus bootcamps covering agricultural drone telemetry, automated soil analysis, and hydroponic automation. Select 'College Workshop Partnership' above."
  },
  {
    icon: "payments",
    question: "What are the ambassador stipend and perks?",
    answer: "Ambassadors receive milestone-based stipends, full waivers for all premium workshops, letters of recommendation from industry partners, and direct fast-track interviews with hiring partners."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: '',
    organization: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      category: '',
      organization: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-primary min-h-screen flex flex-col font-body-md text-body-md">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mint-surface/80 via-background to-background py-16 md:py-24 border-b border-card-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-surface border border-secondary-fixed text-primary text-label-badge font-label-badge uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>Partnerships &amp; Community Support</span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-hero font-headline-lg-mobile md:font-headline-hero text-primary tracking-tight text-balance mb-6">
              Get in Touch with AgriYuvaa
            </h1>
            <p className="text-body-lg font-body-lg text-slate-muted text-pretty max-w-2xl">
              Have questions about workshops, campus ambassador programs, or recruitment partnerships? Our team is here to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Core Content Layout */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact & Office Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h2 className="text-headline-md font-headline-md text-primary mb-2">Connect Directly</h2>
              <p className="text-body-md font-body-md text-slate-muted">
                Reach out through our specialized help channels or visit our central technological innovation lab.
              </p>
            </div>

            {/* Contact Detail Cards */}
            <div className="space-y-4">
              {/* Physical Location Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-card-border shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.04)] hover:border-secondary/40 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-fixed/50 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-label-badge font-label-badge uppercase text-secondary tracking-wider block">Headquarters</span>
                    <h3 className="font-headline-sm text-headline-sm text-primary">AgriYuvaa Innovation Hub</h3>
                    <p className="text-body-sm font-body-sm text-slate-muted">South Extension, New Delhi, 110049, India</p>
                  </div>
                </div>
              </div>

              {/* Hotline Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-card-border shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.04)] hover:border-secondary/40 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-fixed/50 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-label-badge font-label-badge uppercase text-secondary tracking-wider block">Direct Support Line</span>
                    <a className="font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors block" href="tel:+919876543210">
                      +91 98765 43210
                    </a>
                    <p className="text-body-sm font-body-sm text-slate-muted">Mon–Sat, 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Email Inquiry Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-card-border shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.04)] hover:border-secondary/40 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-fixed/50 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-label-badge font-label-badge uppercase text-secondary tracking-wider block">Official Inquiries</span>
                    <a className="font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors block" href="mailto:agriyuvaa@gmail.com">
                      agriyuvaa@gmail.com
                    </a>
                    <p className="text-body-sm font-body-sm text-slate-muted">Dedicated student &amp; university triage</p>
                  </div>
                </div>
              </div>

              {/* Campus Ambassador Liaison Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-card-border shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.04)] hover:border-secondary/40 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-fixed/50 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-label-badge font-label-badge uppercase text-secondary tracking-wider block">Campus Ambassador Liaison</span>
                    <h3 className="font-headline-sm text-headline-sm text-primary">University Relations Cell</h3>
                    <p className="text-body-sm font-body-sm text-slate-muted">
                      Direct email: <span className="font-medium text-primary">campus@agriyuvaa.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Response Banner */}
            <div className="p-5 rounded-xl bg-mint-surface border border-secondary-fixed flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-surface-container-lowest flex-shrink-0">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h4 className="font-label-interactive text-label-interactive text-primary">24-Hour Response SLA</h4>
                <p className="text-body-sm font-body-sm text-slate-muted">We respond to all university and student inquiries within 24 hours.</p>
              </div>
            </div>

            {/* Social Media Badges */}
            <div>
              <span className="text-label-badge font-label-badge uppercase tracking-wider text-slate-muted block mb-3">Join Our Professional Ecosystem</span>
              <div className="flex items-center gap-3">
                <a
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://linkedin.com"
                  className="w-11 h-11 rounded-lg bg-surface-container-lowest border border-card-border flex items-center justify-center text-primary hover:bg-mint-surface hover:border-secondary hover:text-secondary transition-all duration-200 shadow-sm"
                >
                  <span className="material-symbols-outlined">hub</span>
                </a>
                <a
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://instagram.com"
                  className="w-11 h-11 rounded-lg bg-surface-container-lowest border border-card-border flex items-center justify-center text-primary hover:bg-mint-surface hover:border-secondary hover:text-secondary transition-all duration-200 shadow-sm"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                </a>
                <a
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://youtube.com"
                  className="w-11 h-11 rounded-lg bg-surface-container-lowest border border-card-border flex items-center justify-center text-primary hover:bg-mint-surface hover:border-secondary hover:text-secondary transition-all duration-200 shadow-sm"
                >
                  <span className="material-symbols-outlined">smart_display</span>
                </a>
                <a
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://facebook.com"
                  className="w-11 h-11 rounded-lg bg-surface-container-lowest border border-card-border flex items-center justify-center text-primary hover:bg-mint-surface hover:border-secondary hover:text-secondary transition-all duration-200 shadow-sm"
                >
                  <span className="material-symbols-outlined">groups</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Send an Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl border border-card-border shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.06)] relative">
              <div className="mb-8">
                <h2 className="text-headline-md font-headline-md text-primary tracking-tight">Send an Inquiry</h2>
                <p className="text-body-md font-body-md text-slate-muted mt-1">
                  Complete the telemetry form below to connect with the respective faculty, workshop, or recruiter coordinator.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-mint-surface border border-secondary text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <div>
                    <strong className="block font-semibold">Message sent successfully!</strong>
                    <span className="text-body-sm text-slate-muted">Our team will get back to you within 24 hours.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="fullName">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Aarav Sharma"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary placeholder:text-slate-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="email">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="aarav@university.edu"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary placeholder:text-slate-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="phone">
                      Phone Number <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 00000"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary placeholder:text-slate-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Inquiry Category Dropdown */}
                  <div>
                    <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="category">
                      Inquiry Category <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select an inquiry area...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Workshop Registration">Workshop Registration</option>
                        <option value="Campus Ambassador Program">Campus Ambassador Program</option>
                        <option value="College Workshop Partnership">College Workshop Partnership</option>
                        <option value="Job Portal / Hiring Support">Job Portal / Hiring Support</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-muted">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* University / Organization Name */}
                <div>
                  <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="organization">
                    University / Organization Name <span className="text-slate-muted font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
                      <span className="material-symbols-outlined text-[20px]">domain</span>
                    </div>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. GB Pant University of Agriculture & Technology"
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary placeholder:text-slate-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Detailed Message */}
                <div>
                  <label className="block font-label-interactive text-label-interactive text-primary mb-2" htmlFor="message">
                    Detailed Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry, requested dates, student cohort size, or specific workshop topic requirements..."
                    className="w-full p-4 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-primary placeholder:text-slate-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-y"
                  />
                </div>

                {/* Submit Button & Security Guarantee */}
                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary-container hover:bg-primary text-surface-container-lowest font-label-interactive text-label-interactive rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>Send Inquiry</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-slate-muted text-body-sm font-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-secondary">lock</span>
                    <span>Secure submission guarantee. Your credentials and inquiries are strictly confidential.</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Campus Ambassador & University Outreach Feature Box */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
        <div className="relative overflow-hidden rounded-xl bg-deep-canopy p-8 md:p-12 text-surface-container-lowest border border-primary-container shadow-xl">
          {/* Glow effect */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-electric-lime/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-electric-lime text-label-badge font-label-badge uppercase tracking-wider mb-4 border border-secondary/30">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span>Student Leadership Track</span>
              </div>
              <h2 className="text-headline-md md:text-headline-lg font-headline-md md:font-headline-lg text-surface-container-lowest tracking-tight">
                Are you a student leader?
              </h2>
              <p className="text-body-lg font-body-lg text-outline-variant mt-2 max-w-xl">
                Bring AgriYuvaa masterclasses to your college and earn leadership certifications and stipends. Join 180+ student ambassadors leading tech shifts across India.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#ambassador"
                className="inline-flex items-center gap-3 bg-electric-lime hover:bg-electric-lime/90 text-deep-canopy font-label-interactive text-label-interactive px-7 py-4 rounded-lg shadow-lg hover:shadow-electric-lime/20 transition-all duration-200 active:scale-95 font-bold"
              >
                <span>Apply as Campus Ambassador</span>
                <span className="material-symbols-outlined text-[20px]">school</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map / Location Preview Card */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
        <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden shadow-[0px_4px_20px_-2px_rgba(6,78,59,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Location details snippet */}
            <div className="lg:col-span-4 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-card-border">
              <div>
                <span className="text-label-badge font-label-badge uppercase tracking-wider text-secondary block mb-2">Campus &amp; HQ Facility</span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">AgriYuvaa Innovation Hub</h3>
                <p className="text-body-md font-body-md text-slate-muted mb-6">
                  Located in the heart of South Extension, New Delhi. Featuring precision telemetry labs, automated greenhouse models, and our nationwide training administration.
                </p>
                <div className="space-y-2 text-body-sm font-body-sm text-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">near_me</span>
                    <span>Metro Access: South Extension Metro (Pink Line)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">local_parking</span>
                    <span>Visitor parking available on-site</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://maps.google.com/?q=South+Extension+New+Delhi"
                  className="inline-flex items-center gap-2 text-primary font-label-interactive text-label-interactive hover:text-secondary transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Stylized Location Card Image */}
            <div className="lg:col-span-8 relative min-h-[300px] lg:min-h-[380px] bg-mint-surface overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1lpWYTnY3ObeHvcixGpdla-JsWLx9XiTYpxpJytwlrM2GY-YMPkWali4X8xtvh-6RS-GEIrwcJrzAbFuMv3lqvsPxHZVEY9UL0Aw-RD_EvBEWLn42lEyQ0_GklGHTy6VNmlYP55XZYMe5XQSkUSLmEZJIdFdG6yfyOgZvbSEk2hGJkWPMBINgFLoP7DfLJHdrqV29tU-eL9mv7OHEtxMy6xxvN8prgznqdliD6-lS9tZEtJEl7vfdAA"
                alt="New Delhi South Extension Cartographic Illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-lg border border-card-border shadow-sm flex items-center gap-2 text-primary font-label-badge text-label-badge">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                <span>28.5729° N, 77.2201° E</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQ Snippet */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-label-badge font-label-badge uppercase tracking-wider text-secondary block mb-2">Instant Clarifications</span>
          <h2 className="text-headline-md font-headline-md text-primary tracking-tight">Frequently Asked Before Inquiring</h2>
          <p className="text-body-md font-body-md text-slate-muted mt-2">Answers to recurring questions regarding credentials, partnerships, and jobs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {FAQS.map((faq, index) => (
            <div key={index} className="bg-surface-container-lowest p-6 rounded-xl border border-card-border">
              <h4 className="font-headline-sm text-headline-sm text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">{faq.icon}</span>
                {faq.question}
              </h4>
              <p className="text-body-sm font-body-sm text-slate-muted">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
