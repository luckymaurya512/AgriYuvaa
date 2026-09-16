import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface antialiased">
      {/* Hero / Story Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-mint-surface/40 border-b border-card-border">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-body-sm font-body-sm text-slate-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-medium">About Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-card-border mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="font-label-badge text-label-badge text-primary uppercase">Our Story &amp; Vision</span>
              </div>
              <h1 className="font-headline-hero-mobile lg:font-headline-hero text-headline-hero-mobile lg:text-headline-hero text-primary mb-6">
                Empowering India's Agri-Youth to Lead the{' '}
                <span className="text-secondary underline decoration-electric-lime decoration-4 underline-offset-8">
                  Tech-Driven
                </span>{' '}
                Green Revolution
              </h1>
              <p className="font-body-lg text-body-lg text-slate-muted max-w-3xl leading-relaxed mb-8">
                AgriYuvaa bridges the structural chasm between 50,000+ annual university graduates with theoretical degrees and India's fastest-growing precision agtech startups, drone telemetry fleets, and bio-agriculture labs.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  className="inline-flex items-center gap-2 bg-primary text-surface-container-lowest font-label-interactive text-label-interactive px-6 py-3 rounded-lg hover:bg-primary-container transition-all shadow-sm active:scale-95"
                  href="#mission"
                >
                  <span>Explore Our Mission</span>
                  <span className="material-symbols-outlined text-lg">arrow_downward</span>
                </a>
                <a
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-mint-surface font-label-interactive text-label-interactive px-6 py-3 rounded-lg transition-colors"
                  href="#pillars"
                >
                  The 4 Core Pillars
                </a>
              </div>
            </div>

            {/* Metric Telemetry Block */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-card-border shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-card-border pb-4">
                  <span className="text-label-badge font-label-badge text-slate-muted uppercase tracking-wider">
                    NETWORK STATUS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-label-badge font-bold bg-mint-surface text-primary border border-secondary/20">
                    LIVE DATA
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <div>
                    <p className="text-headline-sm font-headline-sm text-primary font-bold">50,000+</p>
                    <p className="text-body-sm font-body-sm text-slate-muted">Annual B.Sc &amp; M.Sc Graduates Targeted</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
                  </div>
                  <div>
                    <p className="text-headline-sm font-headline-sm text-primary font-bold">120+ Hrs</p>
                    <p className="text-body-sm font-body-sm text-slate-muted">Hands-On Precision Drone Telemetry</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-mint-surface flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">handshake</span>
                  </div>
                  <div>
                    <p className="text-headline-sm font-headline-sm text-primary font-bold">500+ Agritech</p>
                    <p className="text-body-sm font-body-sm text-slate-muted">Enterprise Hiring Alliances</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8" id="mission">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Mission Card */}
          <div className="lg:col-span-6 bg-deep-canopy rounded-xl p-8 lg:p-12 text-surface-container-lowest flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-electric-lime border border-electric-lime/30 text-label-badge font-label-badge uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">target</span>
                Our Mission
              </div>
              <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg mb-6 leading-tight">
                Bridge the gap between 50,000+ annual agriculture graduates and cutting-edge agtech industries.
              </h2>
              <p className="font-body-md text-body-md text-outline-variant leading-relaxed mb-8">
                Traditional curricula often pause at basic field trials. We introduce real-world industrial biotechnology, multispectral imaging, remote automated irrigation arrays, and corporate agri-business leadership so students step straight into high-value careers.
              </p>
            </div>
            <div className="pt-6 border-t border-primary-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-electric-lime text-2xl">verified_user</span>
                <span className="text-body-sm font-body-sm text-surface-container-lowest font-medium">
                  Industry-Verified Skill Credentials
                </span>
              </div>
              <span className="text-electric-lime font-label-metric text-label-interactive font-bold">100% Practical</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 lg:p-12 border border-card-border flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-surface text-primary border border-secondary/20 text-label-badge font-label-badge uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">visibility</span>
                Our 2030 Vision
              </div>
              <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mb-6 leading-tight">
                To build India's premier youth-led bio-intelligence &amp; digital agronomy talent pipeline.
              </h2>
              <p className="font-body-md text-body-md text-slate-muted leading-relaxed mb-8">
                We envision every rural and urban agri-university campus operating as an active incubator where students build drone services, carbon auditing startups, and climate-resilient organic supply networks that power global food security.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-card-border">
              <div className="bg-mint-surface p-4 rounded-lg border border-secondary-container">
                <p className="font-label-metric text-label-metric text-primary font-bold">100,000</p>
                <p className="text-[12px] font-label-badge uppercase text-slate-muted mt-1">Certified Technicians by 2028</p>
              </div>
              <div className="bg-mint-surface p-4 rounded-lg border border-secondary-container">
                <p className="font-label-metric text-label-metric text-secondary font-bold">1,000+</p>
                <p className="text-[12px] font-label-badge uppercase text-slate-muted mt-1">Campus Chapters Planned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars of Impact */}
      <section className="py-16 lg:py-24 bg-surface-container-low/60 border-y border-card-border" id="pillars">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary border border-card-border text-label-badge font-label-badge uppercase tracking-wider mb-4">
              Framework of Change
            </div>
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mb-4">
              The 4 Core Pillars of Impact
            </h2>
            <p className="text-body-md text-body-md text-slate-muted">
              Our integrated matrix solves the structural disconnects between university labs, field practice, and commercial agribusiness hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Pillar 1 */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 border border-card-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-mint-surface border border-secondary/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <span className="text-label-badge font-label-badge text-secondary uppercase tracking-wider">Pillar 01</span>
                <h3 className="font-headline-md text-headline-md text-primary mt-2 mb-3">Youth Empowerment &amp; Leadership</h3>
                <p className="font-body-md text-body-md text-slate-muted leading-relaxed mb-6">
                  Cultivating leadership mindsets, financial independence, and rural entrepreneurship. We mentor graduates to evolve from passive job-seekers into founders of localized farm-tech consultancies and input distribution models.
                </p>
              </div>
              <div className="pt-4 border-t border-card-border flex items-center gap-2 text-primary font-medium text-body-sm">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <span>Incubated 80+ Student Agritech Enterprises</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 border border-card-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-mint-surface border border-secondary/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
                </div>
                <span className="text-label-badge font-label-badge text-secondary uppercase tracking-wider">Pillar 02</span>
                <h3 className="font-headline-md text-headline-md text-primary mt-2 mb-3">Practical Skill Development</h3>
                <p className="font-body-md text-body-md text-slate-muted leading-relaxed mb-6">
                  Intensive, field-grade bootcamps covering DGCA Drone Piloting, Commercial Hydroponics &amp; Nutrient Dosing, Commercial Beekeeping, Biofloc Aquaculture arrays, and Satellite Precision Farming telemetry.
                </p>
              </div>
              <div className="pt-4 border-t border-card-border flex items-center gap-2 text-primary font-medium text-body-sm">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <span>Over 250+ Hands-On Lab Hours Completed</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 border border-card-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-mint-surface border border-secondary/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">work</span>
                </div>
                <span className="text-label-badge font-label-badge text-secondary uppercase tracking-wider">Pillar 03</span>
                <h3 className="font-headline-md text-headline-md text-primary mt-2 mb-3">Direct Career Linkages</h3>
                <p className="font-body-md text-body-md text-slate-muted leading-relaxed mb-6">
                  Strategic partnerships with 500+ top agribusiness conglomerates, seed biotechnology research centers, and venture-funded agtech startups orchestrated through our dedicated real-time Job Portal.
                </p>
              </div>
              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-medium text-body-sm">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span>1,200+ Verified Placements</span>
                </div>
                <a
                  className="text-label-badge font-label-badge text-secondary flex items-center gap-1 hover:underline"
                  href="https://job.agriyuvaa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JOB.AGRIYUVAA.COM
                  <span className="material-symbols-outlined text-sm">north_east</span>
                </a>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 border border-card-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-mint-surface border border-secondary/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <span className="text-label-badge font-label-badge text-secondary uppercase tracking-wider">Pillar 04</span>
                <h3 className="font-headline-md text-headline-md text-primary mt-2 mb-3">Collaborative Agri Community</h3>
                <p className="font-body-md text-body-md text-slate-muted leading-relaxed mb-6">
                  Over 18,000+ active student innovators connected via state university campus chapters and national ICAR (Indian Council of Agricultural Research) institute academic networks for peer research and knowledge exchange.
                </p>
              </div>
              <div className="pt-4 border-t border-card-border flex items-center gap-2 text-primary font-medium text-body-sm">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <span>Active Chapters Across 42 Campuses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Advisory Council */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary border border-card-border text-label-badge font-label-badge uppercase tracking-wider mb-4">
              Mentorship &amp; Guidance
            </div>
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
              Leadership &amp; Advisory Council
            </h2>
          </div>
          <p className="font-body-md text-body-md text-slate-muted max-w-md">
            Guided by industry stalwarts, veteran agricultural scientists, and drone robotics pioneers who share our commitment to youth upliftment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mentor 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-card-border shadow-sm flex flex-col justify-between group hover:border-secondary transition-all">
            <div>
              <div className="aspect-square w-full rounded-lg bg-surface-container overflow-hidden mb-6 relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Dr. Ramesh Kumar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChPHeOcdfVMq9soqMfAziKIjGh4f6aISwGvL4zbmvIhDTMnYqrHyZVm7tSLh7ujJPWwtjyIea1EbZB0nRXSIMgX57XmAZ64wZ8DhFFqJ_Os2KBnqU6dlCcCIbDR7dswCLLSbJRfMvdXXkzcv86Ceq9RpzZ01HWujvFpHbQsLSW9Ytlg-ImkADZB5iK6TlxC2t4WhCOozJA5aVSL79j9zYVs15bOkGPAb3sk3gWXXm9qRcereM62o9RcA"
                />
                <div className="absolute bottom-3 left-3 bg-deep-canopy/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-label-badge text-surface-container-lowest uppercase tracking-wider">
                  ICAR Advisor
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Dr. Ramesh Kumar</h3>
              <p className="font-body-sm text-body-sm text-secondary font-medium mb-3">
                Senior Entomologist &amp; Bio-Protection Lead
              </p>
              <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed mb-4">
                Former research director with 28+ years leading biological pest management programs and guiding ICAR postgraduate scholars.
              </p>
            </div>
            <div className="pt-4 border-t border-card-border flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-muted text-lg">domain</span>
              <span className="text-[12px] font-label-badge text-slate-muted">Ex-State Agri University Dean</span>
            </div>
          </div>

          {/* Mentor 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-card-border shadow-sm flex flex-col justify-between group hover:border-secondary transition-all">
            <div>
              <div className="aspect-square w-full rounded-lg bg-surface-container overflow-hidden mb-6 relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Er. Priya Patel"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrlwunEh6UT6ysly2SgatH5f_NljLbFGky7wf_v682iDNvLRFhPDtXP2m6Uc0-LjTREUjgMZSu_QD5AUUmC-t3bERCM8_shlxJ_Wd0FR_E53D5iiYUGPzAOy3s8OJuWgsANUWiUjSuut5MW1qaBPrXY-M3XHVfifc6YrgnbJixAHJDx105CUFG0SMRj5Ia_LJ5MpzKbcZ8omrmeI4YNVFSISaZvnm9j4oP4e7cEZKlEsqP0JdLZELlNQ"
                />
                <div className="absolute bottom-3 left-3 bg-deep-canopy/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-label-badge text-surface-container-lowest uppercase tracking-wider">
                  Drone Architect
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Er. Priya Patel</h3>
              <p className="font-body-sm text-body-sm text-secondary font-medium mb-3">
                Drone Telemetry &amp; Robotics Specialist
              </p>
              <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed mb-4">
                Pioneered multispectral agricultural drone systems with over 1,500 flight hours across automated spraying and crop health indexing.
              </p>
            </div>
            <div className="pt-4 border-t border-card-border flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-muted text-lg">flight</span>
              <span className="text-[12px] font-label-badge text-slate-muted">DGCA Certified Master Trainer</span>
            </div>
          </div>

          {/* Mentor 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-card-border shadow-sm flex flex-col justify-between group hover:border-secondary transition-all">
            <div>
              <div className="aspect-square w-full rounded-lg bg-surface-container overflow-hidden mb-6 relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Swati Raj"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD81S_4YzR2xYslDAtaHKrYUvVdLu_9vmxlTmz4Ml_2bujBRJ9W284Uj85yn6CIpolTd6EaSrPRRJ1XK5oL8d1IaZtb_zZ9QJUii9D0tCojd5OC5w2IsVfecKxQvpCwNApwfUmRNvfcSpNUQ1CK1u6ve_xWthp4ege_PetBbXaD81bP9v_ELiGnkOgsfHao-x7gxHZKMuciSKGoLwYesKr43pmrDhvZXOfoNapj1zs-RPmh7EzYUsnh_g"
                />
                <div className="absolute bottom-3 left-3 bg-deep-canopy/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-label-badge text-surface-container-lowest uppercase tracking-wider">
                  Curriculum Lead
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Swati Raj</h3>
              <p className="font-body-sm text-body-sm text-secondary font-medium mb-3">
                Head of Learning &amp; Campus Partnerships
              </p>
              <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed mb-4">
                Architect of AgriYuvaa's accelerated bootcamp pedagogies; bridging corporate hiring rubrics with university semester frameworks.
              </p>
            </div>
            <div className="pt-4 border-t border-card-border flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-muted text-lg">school</span>
              <span className="text-[12px] font-label-badge text-slate-muted">IIM Ahmedabad Agri-Business Alum</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-deep-canopy rounded-2xl p-8 lg:p-16 text-surface-container-lowest relative overflow-hidden shadow-xl border border-primary-container">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-electric-lime border border-electric-lime/30 text-label-badge font-label-badge uppercase tracking-wider mb-6">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Take the Next Step
            </div>
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-surface-container-lowest mb-6">
              Ready to accelerate your agricultural career?
            </h2>
            <p className="font-body-lg text-body-lg text-outline-variant mb-8 leading-relaxed">
              Join thousands of agricultural students and graduates mastering precision drones, smart greenhouses, and bio-protection techniques or connect directly with 500+ hiring partners.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 bg-secondary text-surface-container-lowest font-label-interactive text-label-interactive px-7 py-3.5 rounded-lg hover:bg-secondary-fixed-dim hover:text-deep-canopy transition-all shadow-md active:scale-95"
              >
                <span>Browse Workshops</span>
                <span className="material-symbols-outlined text-lg">school</span>
              </Link>
              <a
                href="https://job.agriyuvaa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary hover:bg-electric-lime font-label-interactive text-label-interactive px-7 py-3.5 rounded-lg transition-all shadow-md active:scale-95 font-bold"
              >
                <span>Explore Job Portal</span>
                <span className="material-symbols-outlined text-lg">arrow_outward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
