import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function MobileLandingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex justify-center selection:bg-secondary-container selection:text-primary py-4 sm:py-8">
      {/* Mobile Screen Container (390px Viewport Frame constraint) */}
      <div className="w-full max-w-[390px] bg-surface-container-lowest min-h-screen flex flex-col shadow-2xl relative overflow-x-hidden border-x border-card-border rounded-2xl">
        {/* 1. MOBILE HEADER */}
        <header className="sticky top-0 z-50 bg-surface-container-lowest/85 backdrop-blur-md shadow-sm border-b border-card-border px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="AgriYuvaa" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight leading-tight">AgriYuvaa</span>
              <span className="text-[9px] uppercase tracking-wider font-label-badge text-slate-muted -mt-0.5">Youth • Tech • Agri</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="inline-flex items-center gap-1 bg-mint-surface border border-secondary/30 text-primary px-2.5 py-1 rounded-full text-label-badge font-label-badge hover:bg-secondary-container transition-colors duration-200"
              href="https://job.agriyuvaa.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Jobs</span>
              <span className="material-symbols-outlined text-[15px] text-secondary">arrow_outward</span>
            </a>
            <button
              aria-label="Toggle navigation"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-primary hover:bg-mint-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>
        </header>

        {/* Mobile Drawer Overlay Menu */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-deep-canopy/60 z-50 backdrop-blur-sm transition-opacity duration-300 flex"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="w-4/5 max-w-[300px] h-full bg-surface-container-lowest p-6 flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-card-border">
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="AgriYuvaa" className="w-8 h-8 object-contain" />
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">AgriYuvaa</span>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-1 text-slate-muted hover:text-primary">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <nav className="mt-6 flex flex-col gap-4">
                  <Link
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                    className="text-primary font-bold border-b-2 border-primary pb-1 font-label-interactive text-label-interactive flex items-center justify-between"
                  >
                    <span>Home</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-muted font-label-interactive text-label-interactive hover:text-secondary flex items-center justify-between"
                  >
                    <span>About</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                  <Link
                    to="/workshops"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-muted font-label-interactive text-label-interactive hover:text-secondary flex items-center justify-between"
                  >
                    <span>Workshops</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-muted font-label-interactive text-label-interactive hover:text-secondary flex items-center justify-between"
                  >
                    <span>Blog</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-muted font-label-interactive text-label-interactive hover:text-secondary flex items-center justify-between"
                  >
                    <span>Contact</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                </nav>
              </div>
              <div className="pt-6 border-t border-card-border">
                <a
                  className="w-full bg-primary text-surface-container-lowest font-label-interactive text-label-interactive py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                  href="https://job.agriyuvaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Job Portal</span>
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 flex flex-col">
          {/* 2. MOBILE HERO */}
          <section className="relative px-4 pt-7 pb-8 overflow-hidden bg-gradient-to-b from-mint-surface/80 via-surface-container-lowest to-surface-container-lowest">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col">
              <div className="inline-flex items-center gap-2 self-start bg-surface-container-lowest border border-card-border px-3 py-1 rounded-full shadow-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                <span className="font-label-badge text-label-badge text-primary-container tracking-wider uppercase">India's #1 Agri-Youth &amp; Tech Platform</span>
              </div>
              <h1 className="font-headline-hero-mobile text-headline-hero-mobile text-primary tracking-tight mb-3">
                Where Agricultural Youth Meets <span className="text-secondary underline decoration-electric-lime decoration-4 underline-offset-4">Modern Careers</span>
              </h1>
              <p className="font-body-md text-body-md text-slate-muted mb-6 leading-relaxed">
                Bridging academic agriculture graduates and tech enthusiasts with high-growth careers, hands-on drone pilot trainings, and smart-farming industries across India.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                <a
                  className="w-full bg-primary hover:bg-deep-canopy active:scale-95 text-surface-container-lowest font-label-interactive text-label-interactive py-3.5 px-6 rounded-lg text-center flex items-center justify-center gap-2 shadow-md transition-all"
                  href="https://job.agriyuvaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Explore Jobs</span>
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </a>
                <Link
                  className="w-full bg-surface-container-lowest hover:bg-mint-surface active:scale-95 text-primary-container border-2 border-primary-container font-label-interactive text-label-interactive py-3 px-6 rounded-lg text-center flex items-center justify-center gap-2 transition-all"
                  to="/workshops"
                >
                  <span>Browse Workshops</span>
                  <span className="material-symbols-outlined text-sm">school</span>
                </Link>
              </div>
              {/* 2x2 Metric Tiles Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-mint-surface p-3.5 rounded-xl border border-secondary-fixed/60 flex flex-col justify-between">
                  <span className="font-label-metric text-label-metric text-primary leading-none mb-1">5,000+</span>
                  <span className="font-label-badge text-label-badge text-slate-muted uppercase">Youth Empowered</span>
                </div>
                <div className="bg-mint-surface p-3.5 rounded-xl border border-secondary-fixed/60 flex flex-col justify-between">
                  <span className="font-label-metric text-label-metric text-primary leading-none mb-1">50+</span>
                  <span className="font-label-badge text-label-badge text-slate-muted uppercase">Workshops Held</span>
                </div>
                <div className="bg-mint-surface p-3.5 rounded-xl border border-secondary-fixed/60 flex flex-col justify-between">
                  <span className="font-label-metric text-label-metric text-primary leading-none mb-1">25+</span>
                  <span className="font-label-badge text-label-badge text-slate-muted uppercase">States Active</span>
                </div>
                <div className="bg-mint-surface p-3.5 rounded-xl border border-secondary-fixed/60 flex flex-col justify-between">
                  <span className="font-label-metric text-label-metric text-primary leading-none mb-1">18,000+</span>
                  <span className="font-label-badge text-label-badge text-slate-muted uppercase">Active Learners</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CORE MISSION PILLARS */}
          <section className="px-4 py-8 bg-surface-bright border-y border-card-border">
            <div className="mb-4">
              <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider font-bold">Pillars of Impact</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-1">Transforming Agri Careers</h2>
            </div>
            {/* Horizontal scroll compact stack */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory">
              <div className="snap-start shrink-0 w-[260px] bg-surface-container-lowest p-4 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Youth Empowerment</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">Inspiring agri-graduates to step into leadership, modern research, and rural entrepreneurship.</p>
              </div>

              <div className="snap-start shrink-0 w-[260px] bg-surface-container-lowest p-4 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Skill Training</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">Industry-grade practical certifications in agri-drone piloting, soil IoT sensors, and GIS mapping.</p>
              </div>

              <div className="snap-start shrink-0 w-[260px] bg-surface-container-lowest p-4 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Verified Jobs</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">Direct placements with vetted agritech firms, seed bio-enterprises, and sustainable farm collectives.</p>
              </div>

              <div className="snap-start shrink-0 w-[260px] bg-surface-container-lowest p-4 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Community</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">Join a peer ecosystem across 25+ states exchanging localized agronomy data and venture ideas.</p>
              </div>
            </div>
          </section>

          {/* 4. FEATURED WORKSHOPS */}
          <section className="px-4 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="font-label-badge text-label-badge text-secondary uppercase font-bold tracking-wider">Hands-on Upskilling</span>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5">Featured Workshops</h2>
              </div>
              <Link to="/workshops" className="text-secondary font-label-interactive text-body-sm font-semibold flex items-center">
                View All
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden shadow-sm flex flex-col">
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEHeD3hIPGCOqr8mMFM8pusxs8oJTik8GiP69KdOuNe8DgoADbSyDUXY0XjKo50Z0wezjJbjDrBbVAce1a97_-AkCetpkE_xIRq4k_fkQ2VGowo7nXOAl513IG3JzR9ZOjPdqbjTpWO8Ew103TTPQVVHxL6Q60GNJi3p5h097k6WvpN58upXxmlRZrfIo9r6D2WqrBRLY-IXs9cQWJLsqiElREhEqgEhaGh2IT4Xyz7oTgnvpxSkRAgw"
                    alt="Agricultural Drone Piloting"
                  />
                  <span className="absolute top-3 left-3 bg-mint-surface/90 backdrop-blur-sm border border-secondary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-badge text-label-badge uppercase font-bold">
                    Drone Tech
                  </span>
                  <span className="absolute bottom-3 right-3 bg-deep-canopy/80 backdrop-blur-md text-surface-container-lowest px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span> 3 Days Bootcamp
                  </span>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1.5 leading-snug">Agricultural Drone Piloting &amp; Spray Ops</h3>
                    <p className="font-body-sm text-body-sm text-slate-muted mb-3">DGCA guidelines, precision multispectral telemetry mapping, and automated field calibration.</p>
                  </div>
                  <div className="pt-3 border-t border-card-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-muted block font-body-sm">Registration Fee</span>
                      <span className="font-label-metric text-headline-sm text-primary font-bold leading-none">₹2,499</span>
                    </div>
                    <Link to="/contact" className="bg-primary hover:bg-deep-canopy active:scale-95 text-surface-container-lowest px-4 py-2 rounded-lg font-label-interactive text-body-sm flex items-center gap-1 transition-transform">
                      <span>Register</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden shadow-sm flex flex-col">
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCopCNI0oq0sD78KXe55tlFyfA4YVZzZg_7MxhBPxYk0P2zS9e8mga53j0Ty2IApFdcLRAeDuFen74WakGwfx8cS4OzKeBdwHac6Ct-EYmQcKxh1wGRWbaTqsSNE-nOx2-89qFoZCaU0k3NAgFAixd6lGjHcl3ctPpMkVna9Si7I1wCk1GPAtPFniifs2PflbwicAsVbtc9z_E_eX1CTRfMWl8fvHoPc6q-1hLfLGhphRyOuWPV8hShpQ"
                    alt="Commercial Hydroponics"
                  />
                  <span className="absolute top-3 left-3 bg-mint-surface/90 backdrop-blur-sm border border-secondary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-badge text-label-badge uppercase font-bold">
                    Hydroponics
                  </span>
                  <span className="absolute bottom-3 right-3 bg-deep-canopy/80 backdrop-blur-md text-surface-container-lowest px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span> 2 Days Practical
                  </span>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1.5 leading-snug">Commercial Hydroponics &amp; Automation</h3>
                    <p className="font-body-sm text-body-sm text-slate-muted mb-3">NFT system blueprinting, EC/pH bio-nutrient management, and greenhouse yield economics.</p>
                  </div>
                  <div className="pt-3 border-t border-card-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-muted block font-body-sm">Registration Fee</span>
                      <span className="font-label-metric text-headline-sm text-primary font-bold leading-none">₹1,499</span>
                    </div>
                    <Link to="/contact" className="bg-primary hover:bg-deep-canopy active:scale-95 text-surface-container-lowest px-4 py-2 rounded-lg font-label-interactive text-body-sm flex items-center gap-1 transition-transform">
                      <span>Register</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. TESTIMONIAL HIGHLIGHT */}
          <section className="px-4 py-8 bg-mint-surface border-y border-card-border relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sun-amber text-lg">workspace_premium</span>
              <span className="font-label-badge text-label-badge uppercase text-secondary font-bold">Alumni Spotlight</span>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-secondary-fixed shadow-sm">
              <div className="flex items-center gap-1 text-sun-amber mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <blockquote className="font-body-md text-body-md text-primary font-medium italic mb-4 leading-relaxed">
                "AgriYuvaa completely reshaped my career trajectory. The Drone Piloting certification helped me transition from a confused B.Sc graduate to an Agro-Telemetry Specialist within 60 days."
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-card-border">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary shrink-0 bg-slate-200">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeyWX5bPbPDCaC9p1jAXdBfjfFKkDH5pakf94ktHgZ65Jz2ADgbkUzSnGvZEUHdxmlLZbT0ejEIEHHSy-rUSkexViBbU6CBzltJCInvus776l3tQ_9LdS6caTLy1TmvXNNmhr113fKzV0sVJy4X_ALifeayw1ka4z9jaqEZ2UtU5N-CFXlrHd5wUyqPQBSeV9S70warbYKwPW6FPn8nmtgGi1594yG67YuQinGims3MbVtfzQxRzQS2w"
                    alt="Amit Deshmukh portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-body-md font-bold text-primary">Amit Deshmukh</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <span className="font-body-sm text-[12px] text-slate-muted">B.Sc Agriculture Graduate • Maharashtra</span>
                </div>
              </div>
            </div>
          </section>

          {/* 6. LATEST BLOG POST */}
          <section className="px-4 py-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-label-badge text-label-badge text-secondary uppercase font-bold tracking-wider">Insights &amp; Trends</span>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5">Agri Career Brief</h2>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden shadow-sm">
              <div className="h-36 w-full relative bg-slate-100">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqbzzCNbuglBNuCHClqV-xQnsGItc5AMIYAqzCznEg9EDkHXM54CL1rgG_Ja8tT4LaIZSSzRF04d3zp8kUmjSmrYf2ZL3JnKWxoPq4gWjSVc60RHAT4kciIeMcAb7MPSwpmwA2WBwPp_zNS2RpiNX6FM6cMJm08uJrFf7pwfEN6jXJlTF9LsqekxJ19sY1UqIF3shnEKNfugcWr9-lzQvwDP7TZkdLZLP4s4JJVNgRfW7TfsSv_xFlfg"
                  alt="High tech digital agriculture laboratory"
                />
                <span className="absolute top-3 left-3 bg-deep-canopy/90 text-electric-lime px-2.5 py-0.5 rounded-full font-label-badge text-[11px] font-bold">
                  Career Guide
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2 leading-snug">
                  Top High-Paying Skills in Modern Agriculture for 2026
                </h3>
                <p className="font-body-sm text-body-sm text-slate-muted mb-4 leading-relaxed line-clamp-2">
                  From IoT agronomists to precision supply chain managers, discover the emerging specializations that command 3x entry-level compensations.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-card-border">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-muted text-sm">edit_note</span>
                    <span className="font-label-badge text-slate-muted text-[12px]">AgriYuvaa Editorial</span>
                  </div>
                  <Link to="/blog" className="text-primary font-label-interactive text-body-sm font-semibold flex items-center gap-1 hover:text-secondary">
                    <span>Read Story</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 7. JOB PORTAL BANNER */}
          <section className="px-4 py-4">
            <div className="relative bg-deep-canopy rounded-2xl p-6 text-surface-container-lowest overflow-hidden shadow-lg border border-primary-container">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-secondary/30 blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col">
                <div className="inline-flex items-center gap-1.5 self-start bg-surface-container-lowest/10 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-lime"></span>
                  <span className="font-label-badge text-[11px] text-electric-lime uppercase tracking-wider font-bold">job.agriyuvaa.com</span>
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-surface-container-lowest mb-2 leading-tight">
                  India's Dedicated Agri Talent Network
                </h2>
                <p className="font-body-sm text-body-sm text-outline-variant mb-5 leading-relaxed">
                  Skip traditional generic boards. Apply directly to verified agronomy jobs, seed bio-tech labs, and agritech startups.
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    className="w-full bg-electric-lime hover:bg-tertiary-fixed text-primary font-label-interactive text-label-interactive py-3 rounded-lg text-center font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                    href="https://job.agriyuvaa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Browse Jobs</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                  <a
                    className="w-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 border border-surface-container-lowest/20 text-surface-container-lowest font-label-interactive text-body-sm py-2.5 rounded-lg text-center flex items-center justify-center gap-2 transition-all"
                    href="https://job.agriyuvaa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Post a Job (Recruiters)</span>
                    <span className="material-symbols-outlined text-sm">post_add</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 8. QUICK CONTACT */}
          <section className="px-4 py-8 bg-surface-bright border-t border-card-border">
            <span className="font-label-badge text-label-badge text-secondary uppercase font-bold tracking-wider">Get in Touch</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5 mb-4">Connect With AgriYuvaa</h2>
            <div className="flex flex-col gap-2.5 mb-6">
              <a className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm active:bg-mint-surface transition-colors" href="mailto:connect@agriyuvaa.com">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-muted font-body-sm">Drop us an inquiry</span>
                  <span className="font-label-interactive text-body-md text-primary font-semibold">connect@agriyuvaa.com</span>
                </div>
              </a>
              <a className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm active:bg-mint-surface transition-colors" href="tel:+919876543210">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-muted font-body-sm">Helpline Support</span>
                  <span className="font-label-interactive text-body-md text-primary font-semibold">+91 98765 43210</span>
                </div>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-mint-surface text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-muted font-body-sm">HQ Innovation Center</span>
                  <span className="font-label-interactive text-body-md text-primary font-semibold">New Delhi, India</span>
                </div>
              </div>
            </div>
            {/* Socials */}
            <div>
              <span className="text-xs text-slate-muted font-body-sm block mb-2.5 uppercase font-medium tracking-wide">Follow Our Channels</span>
              <div className="grid grid-cols-3 gap-2.5">
                <a
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface-container-lowest border border-card-border rounded-lg text-primary text-body-sm font-semibold hover:bg-mint-surface transition-colors shadow-sm"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">share</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface-container-lowest border border-card-border rounded-lg text-primary text-body-sm font-semibold hover:bg-mint-surface transition-colors shadow-sm"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
                  <span>Instagram</span>
                </a>
                <a
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface-container-lowest border border-card-border rounded-lg text-primary text-body-sm font-semibold hover:bg-mint-surface transition-colors shadow-sm"
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">smart_display</span>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* 9. MOBILE FOOTER */}
        <footer className="bg-deep-canopy text-surface-container-lowest px-4 py-8 border-t border-primary-container flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-md p-0.5 flex items-center justify-center">
                <img src={logo} alt="AgriYuvaa" className="w-full h-full object-contain" />
              </div>
              <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest">AgriYuvaa</span>
            </div>
            <p className="text-outline-variant font-body-sm text-body-sm leading-relaxed">
              Empowering India's next generation of agriculture leaders, agritech founders, and telemetry specialists.
            </p>
          </div>
          <div className="flex flex-wrap gap-y-2.5 gap-x-4 border-y border-primary-container/80 py-4 font-label-badge text-label-badge text-outline-variant">
            <a className="hover:text-electric-lime transition-colors" href="#privacy">Privacy Policy</a>
            <span className="text-primary-container">•</span>
            <a className="hover:text-electric-lime transition-colors" href="#terms">Terms of Service</a>
            <span className="text-primary-container">•</span>
            <a className="hover:text-electric-lime transition-colors" href="#ambassador">Campus Ambassador</a>
            <span className="text-primary-container">•</span>
            <a className="text-electric-lime font-bold hover:underline" href="https://job.agriyuvaa.com">Job Portal</a>
            <span className="text-primary-container">•</span>
            <Link className="hover:text-electric-lime transition-colors" to="/contact">Contact Support</Link>
          </div>
          <div className="flex flex-col gap-1 text-[11px] text-outline-variant font-body-sm">
            <p>© 2025 AgriYuvaa. Empowering the next generation of agriculture leaders. All rights reserved.</p>
            <span className="text-electric-lime font-label-badge tracking-wider uppercase text-[10px] mt-1">Made with ♥ for Indian Agri-Youth</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
