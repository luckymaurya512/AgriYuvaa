import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28" id="home">
        {/* Atmospheric Glows */}
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-electric-lime/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Headline Cluster */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-mint-surface border border-secondary-container mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-badge text-label-badge uppercase tracking-wider text-primary">
                  Next-Gen Agri Careers • 2025
                </span>
              </div>
              <h1 className="text-headline-hero-mobile lg:text-headline-hero font-headline-hero text-primary tracking-tight mb-6">
                Where Agricultural Youth Meets{' '}
                <span className="text-secondary underline decoration-secondary-fixed-dim decoration-4 underline-offset-8">
                  Modern Technology
                </span>{' '}
                &amp; Careers
              </h1>
              <p className="text-body-lg font-body-lg text-slate-muted mb-8 max-w-2xl leading-relaxed">
                Empowering India's agriculture students and young professionals with next-gen skills in Drone Tech, Hydroponics, and Precision Farming, connected directly to verified industry careers.
              </p>
              {/* Dual Prominent CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <a
                  className="inline-flex justify-center items-center gap-2 bg-secondary hover:bg-primary text-surface-container-lowest font-label-interactive text-label-interactive px-7 py-3.5 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  href="https://job.agriyuvaa.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Explore Verified Jobs</span>
                  <span className="material-symbols-outlined text-lg">north_east</span>
                </a>
                <Link
                  className="inline-flex justify-center items-center gap-2 bg-surface-container-lowest border-2 border-primary text-primary hover:bg-mint-surface font-label-interactive text-label-interactive px-7 py-3.5 rounded-lg transition-all duration-200 active:scale-95"
                  to="/workshops"
                >
                  <span className="material-symbols-outlined text-lg">school</span>
                  <span>Browse Skill Workshops</span>
                </Link>
              </div>
              {/* Trust Sub-badge */}
              <div className="flex items-center gap-4 text-slate-muted">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-surface-dim flex items-center justify-center font-bold text-xs text-primary">
                    AP
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-primary-fixed flex items-center justify-center font-bold text-xs text-primary">
                    RK
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-secondary-fixed flex items-center justify-center font-bold text-xs text-primary">
                    VS
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-tertiary-fixed flex items-center justify-center font-bold text-xs text-primary">
                    +18k
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-slate-muted">
                  Joined by top state agri-universities &amp; ICAR institutes
                </p>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-card-border bg-surface-container-lowest shadow-lg">
                  <img
                    className="w-full h-[400px] object-cover"
                    alt="Agricultural student operating drone"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_7GE3F94zrDW82JWkuJv1fZ0i4j9pgh_uj43YJamSDdMrbUORSAv3a8uOzfkgNrv-YQR3bH0lkQ4eswqwpdFQDZlcLMcocNjyDCw-tf2b9FwPUZVtCLr0KN09j87XuYaZ_s70Cd3_q39qyzGsn8g_DugBLBVV4rrAI8JZ8vfjfS4XaF4CQt4rJgLnRgRE5u_oDvLfWd7YHSpxgG3R0xBCXAFTA7fTa5FoMexvV04iH7TeZFso6a5adg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-surface-container-lowest">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-electric-lime text-base">sensors</span>
                      <span className="font-label-badge text-label-badge text-electric-lime uppercase">
                        Telemetry Active
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest leading-snug">
                      Precision Drone Piloting &amp; Sensor Analysis
                    </h3>
                  </div>
                </div>

                {/* Floating Interactive Stat Card */}
                <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-xl border border-card-border shadow-md flex items-center gap-3 hidden sm:flex">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      workspace_premium
                    </span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-primary">DGCA &amp; Skill India</p>
                    <p className="font-body-sm text-body-sm text-slate-muted">Aligned certification curriculum</p>
                  </div>
                </div>

                {/* Floating Live Status Chip */}
                <div className="absolute -top-4 -right-4 bg-deep-canopy text-surface-container-lowest px-4 py-2 rounded-xl shadow-md flex items-center gap-2 border border-primary-container">
                  <span className="w-2 h-2 rounded-full bg-electric-lime animate-ping"></span>
                  <span className="font-label-badge text-label-badge text-electric-lime tracking-wide">
                    ACTIVE HIRING NOW
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="mt-16 pt-10 border-t border-card-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm flex flex-col justify-center">
                <span className="font-label-metric text-label-metric text-primary">5,000+</span>
                <span className="font-label-badge text-label-badge text-slate-muted uppercase tracking-wider mt-1">
                  Youth Empowered
                </span>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm flex flex-col justify-center">
                <span className="font-label-metric text-label-metric text-secondary">50+</span>
                <span className="font-label-badge text-label-badge text-slate-muted uppercase tracking-wider mt-1">
                  Practical Workshops
                </span>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm flex flex-col justify-center">
                <span className="font-label-metric text-label-metric text-primary">25+</span>
                <span className="font-label-badge text-label-badge text-slate-muted uppercase tracking-wider mt-1">
                  States Across India
                </span>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-card-border shadow-sm flex flex-col justify-center">
                <span className="font-label-metric text-label-metric text-secondary">18,000+</span>
                <span className="font-label-badge text-label-badge text-slate-muted uppercase tracking-wider mt-1">
                  Happy Learners
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & 4 Core Pillars Section */}
      <section className="py-20 bg-mint-surface/40 border-y border-card-border" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-card-border text-secondary font-label-badge text-label-badge uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">deployed_code</span>
              Our Foundation
            </div>
            <h2 className="text-headline-lg-mobile lg:text-headline-lg font-headline-lg text-primary tracking-tight mb-4">
              Bridging Classroom Theory to Modern High-Paying Agri Careers
            </h2>
            <p className="text-body-md font-body-md text-slate-muted leading-relaxed">
              Indian agriculture is evolving at breakneck speed. AgriYuvaa gives university students and graduates the real-world operational execution skills required by high-growth agritech enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest p-7 rounded-xl border border-card-border hover:border-secondary/30 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-container flex items-center justify-center text-primary mb-5">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-3">Youth Empowerment</h3>
                <p className="text-body-sm font-body-sm text-slate-muted leading-relaxed">
                  Igniting passion and financial independence for agricultural graduates through micro-entrepreneurship and leadership training.
                </p>
              </div>
              <Link to="/about" className="mt-6 pt-4 border-t border-card-border flex items-center text-secondary font-label-interactive text-label-interactive text-xs hover:underline">
                <span>Learn Roadmap</span>
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest p-7 rounded-xl border border-card-border hover:border-secondary/30 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-container flex items-center justify-center text-primary mb-5">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    neurology
                  </span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-3">Skill Development</h3>
                <p className="text-body-sm font-body-sm text-slate-muted leading-relaxed">
                  Industry-standard hands-on training in Drones, Hydroponics, Biofloc systems, Beekeeping, and scientific Mushroom cultivation.
                </p>
              </div>
              <Link to="/workshops" className="mt-6 pt-4 border-t border-card-border flex items-center text-secondary font-label-interactive text-label-interactive text-xs hover:underline">
                <span>Explore Modules</span>
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest p-7 rounded-xl border border-card-border hover:border-secondary/30 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-container flex items-center justify-center text-primary mb-5">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    work
                  </span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-3">Career Opportunities</h3>
                <p className="text-body-sm font-body-sm text-slate-muted leading-relaxed">
                  Direct recruitment pipeline and campus walk-in connections with verified agribusiness, seed tech, and drone enterprises.
                </p>
              </div>
              <a href="https://job.agriyuvaa.com" target="_blank" rel="noopener noreferrer" className="mt-6 pt-4 border-t border-card-border flex items-center text-secondary font-label-interactive text-label-interactive text-xs hover:underline">
                <span>Recruiter Network</span>
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </a>
            </div>

            {/* Pillar 4 */}
            <div className="bg-surface-container-lowest p-7 rounded-xl border border-card-border hover:border-secondary/30 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface border border-secondary-container flex items-center justify-center text-primary mb-5">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-3">Agriculture Community</h3>
                <p className="text-body-sm font-body-sm text-slate-muted leading-relaxed">
                  18k+ strong active collaborative network of agri-innovators, state university mentors, student leaders, and scientists.
                </p>
              </div>
              <Link to="/about" className="mt-6 pt-4 border-t border-card-border flex items-center text-secondary font-label-interactive text-label-interactive text-xs hover:underline">
                <span>Join Network</span>
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workshops Showcase */}
      <section className="py-20" id="workshops">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-surface border border-secondary-container text-secondary font-label-badge text-label-badge uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-sm">psychology</span>
                Industry-Led Masterclasses
              </div>
              <h2 className="text-headline-lg-mobile lg:text-headline-lg font-headline-lg text-primary tracking-tight">
                Featured Workshops &amp; Certifications
              </h2>
            </div>
            <Link to="/workshops" className="text-secondary font-label-interactive flex items-center gap-1 hover:text-primary transition-colors mt-4 md:mt-0">
              <span>View All 6 Workshops</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Workshop Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden hover:border-secondary/40 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col">
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Agricultural Drone Workshop"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkkc5sVbkRUR9r9-btB4QhUtgkzEqe12f3J9i12TwgYsuK_uDJwNZvQ7lrXPKvYo1oT8D2XLsVy867Y-TxvTeSu4Npsj2haeuiMy1V8KhuFq6jfsJa1YuYg8lL8-U2xh2jYYNEDYaUAtyUTTba3UcimHqkAPC9WCAvS5LQe7u9kVljVFh4BC_ymX7sc1TIBqCtIeZNc4KCoR-Q-44cUtAPDqfFoutfyZ-WwU7xiVL6P1--eSZGBpaT5w"
                />
                <span className="absolute top-3 left-3 bg-deep-canopy text-electric-lime font-label-badge text-label-badge uppercase px-3 py-1 rounded-full">
                  Fast Filling
                </span>
                <span className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-interactive text-xs px-2.5 py-1 rounded-md">
                  1 Week Cohort
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-muted text-xs">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span className="font-body-sm">Er. Priya Patel</span>
                    <span>•</span>
                    <span className="font-body-sm">Drone Pilot Specialist</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-3">
                    Agricultural Drone Technology &amp; Piloting
                  </h3>
                  <p className="text-body-sm font-body-sm text-slate-muted line-clamp-2 mb-4">
                    Hands-on DGCA guidelines, spray nozzle calibration, multispectral crop health mapping, and field telemetry logs.
                  </p>
                </div>
                <div className="pt-4 border-t border-card-border flex items-center justify-between">
                  <div>
                    <span className="text-label-badge font-label-badge text-slate-muted block text-[11px] uppercase">
                      Enrolment Fee
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary">₹2,499</span>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-surface-container-lowest px-4 py-2 rounded-lg font-label-interactive text-label-interactive transition-colors"
                  >
                    <span>Register Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Workshop Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden hover:border-secondary/40 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col">
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Beekeeping Masterclass"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6_7AJ_kduz4c4sXGjVyPq3wzr3QyQSdG1gURqS0c_goKh5Xt30qdUQoDMzImTwB-xwzKOmcVGJAoBWtbTs3LTtvFFEwGeSUaZ92T3lBZJVjDhIlSZouXDvbOBCIU_3MSv5PaOYpWIoTRnOyVS3JG8OO0-MYwvYeyZ6rViBtbNNpp4bIEPz8ujOo9YYcrdMge1kpybCZAnvcgBzE9wuhzOdPQoTjxyVZ2tQ2V6mJJ6Zjzm7C_XW8N4dg"
                />
                <span className="absolute top-3 left-3 bg-sun-amber text-surface-container-lowest font-label-badge text-label-badge uppercase px-3 py-1 rounded-full">
                  Popular
                </span>
                <span className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-interactive text-xs px-2.5 py-1 rounded-md">
                  2 Days (Weekend)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-muted text-xs">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span className="font-body-sm">Dr. Ramesh Kumar</span>
                    <span>•</span>
                    <span className="font-body-sm">Entomology Senior Fellow</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-3">
                    Commercial Beekeeping Farming Masterclass
                  </h3>
                  <p className="text-body-sm font-body-sm text-slate-muted line-clamp-2 mb-4">
                    Seasonal queen bee management, extraction purity protocol, FSSAI compliance, and direct B2B honey buyer linkage.
                  </p>
                </div>
                <div className="pt-4 border-t border-card-border flex items-center justify-between">
                  <div>
                    <span className="text-label-badge font-label-badge text-slate-muted block text-[11px] uppercase">
                      Enrolment Fee
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary">₹999</span>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-surface-container-lowest px-4 py-2 rounded-lg font-label-interactive text-label-interactive transition-colors"
                  >
                    <span>Register Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Workshop Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden hover:border-secondary/40 transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col">
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Hydroponics Farming"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqzmDc3GQmhkPFxdGC6b2SBUAOLiluXcIWGp7oV-ps2u6KhBREs2H197rS9hEmHG7M97wADpbPBeABIwUwcKPrbvckFYcELnggcIM6idefPY7MBQpl8Y2j8LfQyzxSz5iKmSH7f2Bc46oBxNfgGGcXmCNOVQIAMKuSja9bchFvwckc1tQkW-kProLFCcldjx6YliabUz0bVTQZrkqe7AaSkqJHhGEbmkEDAfBCUwst4l7Zp8jrWbi1tA"
                />
                <span className="absolute top-3 left-3 bg-secondary text-surface-container-lowest font-label-badge text-label-badge uppercase px-3 py-1 rounded-full">
                  Certificate Included
                </span>
                <span className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-interactive text-xs px-2.5 py-1 rounded-md">
                  3 Days
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-muted text-xs">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span className="font-body-sm">Dr. Amit Sharma</span>
                    <span>•</span>
                    <span className="font-body-sm">Hydroponic Architect</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-primary mb-3">
                    Commercial Hydroponics &amp; Soil-less Farming
                  </h3>
                  <p className="text-body-sm font-body-sm text-slate-muted line-clamp-2 mb-4">
                    NFT channel setup, EC/pH automated dosing, plant nutrient mixing formulas, and Capex-to-profit project modeling.
                  </p>
                </div>
                <div className="pt-4 border-t border-card-border flex items-center justify-between">
                  <div>
                    <span className="text-label-badge font-label-badge text-slate-muted block text-[11px] uppercase">
                      Enrolment Fee
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary">₹1,499</span>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-surface-container-lowest px-4 py-2 rounded-lg font-label-interactive text-label-interactive transition-colors"
                  >
                    <span>Register Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Testimonials */}
      <section className="py-20 bg-surface-container-low/60 border-y border-card-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-surface border border-secondary-container text-secondary font-label-badge text-label-badge uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">verified</span>
              Real Alumni Impact
            </div>
            <h2 className="text-headline-lg-mobile lg:text-headline-lg font-headline-lg text-primary tracking-tight mb-4">
              Empowered Graduates Leading the Field
            </h2>
            <p className="text-body-md font-body-md text-slate-muted">
              Read how AgriYuvaa practical training and direct recruiter linkage transformed careers of students across India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-sun-amber mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-body-md font-body-md text-on-surface mb-6 italic leading-relaxed">
                  "AgriYuvaa workshops gave me practical hands-on skills in hydroponics that our college labs never covered. It directly helped me secure an agri-tech specialist role!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-card-border">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-primary">
                  AD
                </div>
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-primary text-base">Amit Deshmukh</h4>
                  <p className="text-body-sm font-body-sm text-slate-muted">B.Sc Agriculture Graduate, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-sun-amber mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-body-md font-body-md text-on-surface mb-6 italic leading-relaxed">
                  "Secured DGCA drone certification prep and immediately landed contracts with local farmer FPOs. The instructors are verified industry operators who guide you beyond the syllabus."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-card-border">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-primary">
                  NP
                </div>
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-primary text-base">Neha Patel</h4>
                  <p className="text-body-sm font-body-sm text-slate-muted">Agri-Drone Pilot &amp; Entrepreneur, Gujarat</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-sun-amber mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-body-md font-body-md text-on-surface mb-6 italic leading-relaxed">
                  "The job portal connected me with top agronomy firms within 2 weeks of workshop completion. Clean profile matching and direct interviews without bureaucratic hassle."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-card-border">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">
                  VS
                </div>
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-primary text-base">Vikram Singh</h4>
                  <p className="text-body-sm font-body-sm text-slate-muted">M.Sc Agronomy, Punjab</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Employment Portal Bridge */}
      <section className="py-20 bg-deep-canopy relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-electric-lime/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container border border-on-primary-container/30 text-electric-lime font-label-badge text-label-badge uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-electric-lime animate-pulse"></span>
              Direct Employment Portal
            </div>
            <h2 className="text-headline-lg-mobile lg:text-headline-lg font-headline-lg text-surface-container-lowest tracking-tight mb-4">
              India's Dedicated Agriculture &amp; AgTech Career Network
            </h2>
            <p className="text-body-lg font-body-lg text-on-primary-container">
              Whether you are a certified graduate stepping into the sector or an enterprise seeking vetted talent, our specialized portal connects you instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Students */}
            <div className="bg-primary-container/60 border border-on-primary-container/25 rounded-2xl p-8 backdrop-blur-sm flex flex-col justify-between hover:border-electric-lime/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-deep-canopy border border-on-primary-container/30 flex items-center justify-center text-electric-lime mb-6">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <span className="font-label-badge text-label-badge text-electric-lime uppercase tracking-wider block mb-2">
                  FOR GRADUATES &amp; JOB SEEKERS
                </span>
                <h3 className="text-headline-md font-headline-md text-surface-container-lowest mb-3">
                  Looking for Verified Agriculture Jobs?
                </h3>
                <p className="text-body-sm font-body-sm text-on-primary-container mb-8 leading-relaxed">
                  Build your digital agriculture resume, showcase your workshop certifications, and apply to 500+ verified positions at leading seed, drone, and farm-tech organizations.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center gap-2 bg-electric-lime hover:bg-tertiary-fixed text-primary font-label-interactive text-label-interactive px-6 py-3.5 rounded-lg transition-all duration-200 shadow-sm font-bold active:scale-95"
                href="https://job.agriyuvaa.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Browse 500+ Jobs</span>
                <span className="material-symbols-outlined text-base">arrow_outward</span>
              </a>
            </div>

            {/* For Employers */}
            <div className="bg-primary-container/60 border border-on-primary-container/25 rounded-2xl p-8 backdrop-blur-sm flex flex-col justify-between hover:border-electric-lime/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-deep-canopy border border-on-primary-container/30 flex items-center justify-center text-secondary-fixed mb-6">
                  <span className="material-symbols-outlined text-2xl">apartment</span>
                </div>
                <span className="font-label-badge text-label-badge text-secondary-fixed uppercase tracking-wider block mb-2">
                  FOR AGRIBUSINESS EMPLOYERS
                </span>
                <h3 className="text-headline-md font-headline-md text-surface-container-lowest mb-3">
                  Hiring Skilled Agri Talent?
                </h3>
                <p className="text-body-sm font-body-sm text-on-primary-container mb-8 leading-relaxed">
                  Post job vacancies, screen pre-assessed candidates with practical drone &amp; precision cultivation badges, and reduce your recruitment cycle by over 60%.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-interactive text-label-interactive px-6 py-3.5 rounded-lg transition-all duration-200 font-bold active:scale-95"
                href="https://job.agriyuvaa.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Post a Job / Register as Employer</span>
                <span className="material-symbols-outlined text-base">arrow_outward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
