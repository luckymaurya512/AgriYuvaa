import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function WorkshopsPage() {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('popular');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'all', label: 'All Workshops' },
    { id: 'drone', label: 'Agricultural Drone Tech' },
    { id: 'hydroponics', label: 'Commercial Hydroponics' },
    { id: 'beekeeping', label: 'Beekeeping Masterclass' },
    { id: 'aquaculture', label: 'Biofloc & Aquaculture' },
    { id: 'mushroom', label: 'Mushroom Cultivation' },
    { id: 'iot', label: 'Precision Sensors & IoT' },
  ];

  const workshops = [
    {
      id: 1,
      category: 'drone',
      popularity: 98,
      price: 2499,
      title: 'Agricultural Drone Technology & Precision Spraying',
      instructor: 'Er. Priya Patel',
      role: 'DGCA Certified Pilot',
      badge: 'Fast Filling',
      duration: '1 Week Cohort',
      desc: 'DGCA flight compliance protocols, automated waypoint mission execution, multispectral crop health mapping, and field nozzle calibration.',
      features: ['Flight Simulator & Field Hands-on', 'Multispectral NDRE/NDVI Analytics'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgx9rGsKp_XWbX81OZDSiy974HwfX4Y8RVgepd65OTTbalgY4cyOnEUBIadxa2EIg-HxS_QsLQxgeYCZOkTkaZnX9eRoAC7vERIBdNNrFBtuKgP4J11Q-FZWHMEKcsQT9mXsM-RjzWozqw3o7r_IOQiObh0a1lQoAT6AOR63_ZLUyk_pNZm44pMJCojC4tTp6MSnrebNIwL5zkheRMaDFWXOhNK4IpNR9VkpA_R-u4T44p2e6GLeGCGA',
    },
    {
      id: 2,
      category: 'beekeeping',
      popularity: 95,
      price: 999,
      title: 'Commercial Beekeeping & Honey Farming Masterclass',
      instructor: 'Dr. Ramesh Kumar',
      role: 'ICAR Apiary Fellow',
      badge: 'Popular',
      badgeColor: 'bg-sun-amber text-deep-canopy',
      duration: '2 Days Weekend',
      desc: 'Complete blueprint for establishing commercial apiaries, royal jelly extraction, queen bee rearing, and FSSAI honey export compliance.',
      features: ['Live Brood & Box Inspection', 'FSSAI & Agmark Certification Guide'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCBeTtOxLmWDbsDI0H9UDu9GOfNGPnNdi8pRr5K6bsiCmivOBw8ygYKlsVCuoZhvE4hb8T3o8HlHt11wLlSp0bqI0qsPeelTOZzusYI1MpzY5ZF541nGEO65SKajZ40TxODXhKk33C4t5SYQxGxAuiyUI4pjC79IsIgdcPjPW1v6mLSnjNjcttat6irihrGIjsiHbifYzeDg5U7IfyoA0NNkhrz0btt5sRFXJfuo9IU2aiHjdHJ3Rlc4A',
    },
    {
      id: 3,
      category: 'hydroponics',
      popularity: 92,
      price: 1499,
      title: 'Commercial Hydroponics & Soil-less Farming Automation',
      instructor: 'Dr. Amit Sharma',
      role: 'Controlled Environment Specialist',
      badge: 'Certificate Included',
      badgeColor: 'bg-mint-surface text-primary border border-primary/20',
      duration: '3 Days Practical',
      desc: 'Designing NFT and Dutch Bucket commercial setups, automated EC/pH dosing, fertigation formulas, and greenhouse CAPEX/OPEX viability models.',
      features: ['Automated Dosing System Assembly', 'Greenhouse ROI & Subsidy Financials'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDj4Nc27r2qgHOV3bPDTblHq6x6hUT25lPRwVJJ4SCHfqUTCJGd8xJ4wkEw0-B_pIrDCgu8AAY4pU6Ea3cBJxjoEpmh3xWROLnzpdQdP5a5ZfMoy6aIeOGlFbJGrKcBGn_qIHvjap8P6R9-B86ZqAxhuAyiVcDATfFOaeTJY1bi-MuID1GJDHPpXfCFkCrB4wSL_XFQ4jpLempEoicecb0LFZGsY2LjDYBHAoSxaEvRi5ZuUD7KrlCvKA',
    },
    {
      id: 4,
      category: 'aquaculture',
      popularity: 88,
      price: 1299,
      title: 'Biofloc Fish Farming & Recirculatory Aquaculture',
      instructor: 'Er. Rajesh Nair',
      role: 'Aquaculture Bioengineer',
      badge: 'High ROI',
      badgeColor: 'bg-secondary-fixed text-deep-canopy',
      duration: '2 Days Intensive',
      desc: 'Mastering microbial floc balance, C:N carbon dosing equations, dissolved oxygen control, and disease mitigation in zero-water exchange systems.',
      features: ['Floc Volume Inhoff Cone Testing', 'Commercial Harvest Economics'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCijRNfCmPzsGZG2wWCkYD9-jVvjvh5M9LBiNqzyLbQmpljLRJeqq8FGiBXEC2jZFSpOXlIWcC6qaDC_Y1ZWLtvthvG5PCivSueyR_YxRSlvnA8uvE0JIH736ZyK0GFOQsxzEDmTuCxVm2Sgk7SHqIDAefxtxrIGvRyp5_YfGOmZjAIyjGaN00lKLJiPZp8ZWH-QdIF1BjqAFa2Ae1tdpVv2um6ndupIHAwN-Lu4-g7BJjlYbwLKddghg',
    },
    {
      id: 5,
      category: 'mushroom',
      popularity: 86,
      price: 899,
      title: 'Commercial Button & Oyster Mushroom Cultivation',
      instructor: 'Dr. Sunita Varma',
      role: 'Mycology Specialist',
      badge: 'Zero Land Needed',
      badgeColor: 'bg-mint-surface text-primary border border-primary/20',
      duration: 'Weekend Workshop',
      desc: 'Substrate preparation, sterile spore inoculation, climate-controlled fruiting rooms, pasteurization protocols, and packaging for supermarkets.',
      features: ['Spawn Production & Casing Techniques', 'Dehydration & Value-Added Products'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBC8Whj6V94JKM48jsAJbE9P0BrxJ_AVhv5W56S3B9kGzkZX645IJMU0VKfcrXI4Ol0jTMdJFm1r9qHNv_5dD_mwdLEQVNk6djAyiNsxPOdZU8oI_05egYCkVfe_ZPwIcnVZH_ZAsvZg-1Y2wv8cUV8i6EXUBecr9-GOlJOr70fh8SM0z2q1uyYIdYbcTYfAlR1mj7DE8WfaJvUWantOzuLSmDD33KSfWWS441tat3oMGGsMqamJk0RnQ',
    },
    {
      id: 6,
      category: 'iot',
      popularity: 91,
      price: 1999,
      title: 'Precision Agriculture & IoT Soil Sensor Telemetry',
      instructor: 'Swati Raj',
      role: 'IoT Systems Architect',
      badge: 'High Demand Tech',
      duration: '4 Days',
      desc: 'LoRaWAN wireless sensor field deployment, soil NPK/moisture telemetry calibration, satellite Sentinel imagery integration, and valve automation.',
      features: ['Node Hardware Wiring & Microcontroller Flash', 'Cloud Dashboard & Alert Triggers Setup'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAZWYK_8EBjUjPup8gqpCOHq3TWk1gnVTKEcSNutVHxAg03bkF0XzpfI3hOIgKGwy8ioWX_mCY4YQsZMAiWT2Ba1E0G27DCtAzD1ujYGyh1HHfW8bKXC8skYcgFxYPaKIMd7SlR5uU8ectVMAHTHj1KuBBdv-0HIJBQtOr2IJOufzyajnTRKB4zrFbkXb9d4LhZhbJcQ4HqrnmYUWEauKA7NCOAHWzKGdcc7o6vNLjHk0N3ePcgtGF_wQ',
    },
  ];

  const faqs = [
    {
      q: 'Are workshops conducted in-person or online?',
      a: 'We operate in a hybrid immersion format. Theoretical blueprints, nutrient formulations, and software configuration modules take place live online with recording access. Hands-on flight maneuvers, tank testing, and harvesting happen during weekend on-site bootcamps at our partner research farms across Maharashtra, Karnataka, Telangana, and Punjab.',
    },
    {
      q: 'What hardware or materials are provided during the program?',
      a: 'All heavy technical equipment—including agricultural drones, simulator rigs, EC/TDS meters, water testing reagents, biofloc sampling kits, and mushroom spawn starters—is fully provided for practical sessions. You only need a standard laptop for telemetry logging and GIS software exercises.',
    },
    {
      q: 'How does the certificate integrate with job.agriyuvaa.com?',
      a: 'Upon successfully passing the final cohort project assessment, your AgriYuvaa candidate profile receives an automated cryptographic certification badge. Partner agtech enterprises and corporate recruiters filtering candidate databases on job.agriyuvaa.com see your verified status at the top of hiring queues.',
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer a full 100% refund up to 72 hours prior to the cohort orientation date, no questions asked. If you face academic exam conflicts or personal emergencies after that window, you can freely defer your enrollment to any future cohort cycle within 6 months at zero penalty.',
    },
  ];

  // Filtering & Sorting
  const filteredWorkshops = workshops
    .filter((w) => {
      const matchesCategory = currentCategory === 'all' || w.category === currentCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.desc.toLowerCase().includes(query) ||
        w.instructor.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortMode === 'price-low') return a.price - b.price;
      if (sortMode === 'popular') return b.popularity - a.popularity;
      return a.title.localeCompare(b.title);
    });

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mint-surface border-b border-card-border py-16 md:py-24">
        <div className="absolute -top-36 -right-36 w-96 h-96 bg-secondary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-12 w-80 h-80 bg-electric-lime/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-card-border shadow-sm mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="font-label-badge text-label-badge text-primary uppercase">DGCA &amp; ICAR Aligned Curricula</span>
              <span className="text-outline-variant">|</span>
              <span className="font-label-badge text-label-badge text-slate-muted uppercase">Spring 2025 Cohorts</span>
            </div>
            <h1 className="font-headline-hero text-headline-hero-mobile md:text-headline-hero text-primary tracking-tight mb-6">
              Industry-Grade AgTech Workshops &amp; Certifications
            </h1>
            <p className="font-body-lg text-body-lg text-slate-muted mb-8 leading-relaxed">
              Gain verified, hands-on experiential mastery led by active agronomists, drone flight instructors, and bio-systems engineers. Build field-tested technical expertise built specifically to land high-impact careers in modern Indian agriculture.
            </p>

            {/* Search Input Container */}
            <div className="bg-surface-container-lowest rounded-xl border border-card-border p-2 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-2">
              <div className="flex items-center gap-3 px-3 w-full">
                <span className="material-symbols-outlined text-slate-muted">search</span>
                <input
                  type="text"
                  placeholder="Search by tech stack, topic, or instructor (e.g. Drone, Hydroponics)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline-variant bg-transparent outline-none"
                />
              </div>
              <button className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-surface-container-lowest font-label-interactive text-label-interactive hover:bg-primary-container transition-colors whitespace-nowrap active:scale-95">
                Filter Results
              </button>
            </div>

            {/* Micro-Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-slate-muted font-label-badge text-label-badge">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span>Direct Practical Farm Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                <span>Blockchain-Verified Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">rocket_launch</span>
                <span>Auto-Sync to Job.AgriYuvaa.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory / Filter & Workshop Grid */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Filter Bar & Sorting Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-card-border mb-10">
          {/* Interactive Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrentCategory(c.id)}
                className={`px-4 py-2 rounded-full font-label-badge text-label-badge transition-all duration-150 whitespace-nowrap ${
                  currentCategory === c.id
                    ? 'bg-primary text-surface-container-lowest shadow-sm'
                    : 'bg-surface-container-lowest text-slate-muted border border-card-border hover:border-secondary hover:text-primary'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
            <label className="font-label-badge text-label-badge text-slate-muted uppercase" htmlFor="sortSelector">
              Sort By:
            </label>
            <select
              id="sortSelector"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="rounded-lg border border-card-border bg-surface-container-lowest text-on-surface font-label-interactive text-body-sm py-2 pl-3 pr-8 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((w) => (
            <div
              key={w.id}
              className="group bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-deep-canopy">
                <img
                  src={w.image}
                  alt={w.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-badge font-label-badge uppercase ${
                      w.badgeColor || 'bg-primary-container text-surface-container-lowest border border-secondary-fixed/40'
                    }`}
                  >
                    {w.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-deep-canopy/80 backdrop-blur-md px-2.5 py-1 rounded-md text-surface-container-lowest font-label-badge text-label-badge">
                  {w.duration}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2 text-slate-muted font-label-badge text-label-badge">
                  <span className="material-symbols-outlined text-[16px] text-secondary">account_circle</span>
                  <span>{w.instructor}</span>
                  <span className="text-outline-variant">•</span>
                  <span>{w.role}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors mb-2">
                  {w.title}
                </h3>
                <p className="font-body-sm text-body-sm text-slate-muted mb-4 line-clamp-2 leading-relaxed">
                  {w.desc}
                </p>

                <div className="space-y-2 py-3 my-auto border-t border-card-border text-body-sm font-body-sm text-on-surface">
                  {w.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-card-border flex items-center justify-between">
                  <div>
                    <span className="text-label-badge font-label-badge text-slate-muted block uppercase text-[11px]">
                      Program Fee
                    </span>
                    <span className="text-headline-sm font-headline-sm font-bold text-primary">₹{w.price.toLocaleString()}</span>
                  </div>
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 rounded-lg bg-primary text-surface-container-lowest font-label-interactive text-label-interactive hover:bg-primary-container transition-all active:scale-95"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition / Advantages */}
      <section className="py-16 md:py-24 bg-mint-surface/50 border-y border-card-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block mb-2 font-bold">
              The AgriYuvaa Advantage
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              Engineered to Propel Your Agri-Career
            </h2>
            <p className="text-body-md text-body-md text-slate-muted mt-3">
              Every training session combines empirical technical depth with verified credentials directly linked to modern employment pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">nature_people</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Hands-on Field Training</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">
                  No superficial presentations. Work on real acres, calibrate active drone sprayers, operate automated dosing pumps, and harvest live cultures.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-card-border font-label-badge text-label-badge text-secondary uppercase font-semibold">
                100% Practical Exposure
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">military_tech</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Recognized Certification</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">
                  Earn cryptographically verifiable certifications co-endorsed by industry consortia and AgriYuvaa's technical research foundation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-card-border font-label-badge text-label-badge text-secondary uppercase font-semibold">
                Blockchain Verified
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">work</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Direct Job.AgriYuvaa Sync</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">
                  Completed workshops automatically add verified skill badges to your profile on{' '}
                  <span className="font-semibold text-primary">job.agriyuvaa.com</span>, prioritizing you for hiring partners.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-card-border font-label-badge text-label-badge text-secondary uppercase font-semibold">
                Priority Recruiter Index
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-card-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-lg bg-mint-surface text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">hub</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Alumni Founder Network</h3>
                <p className="font-body-sm text-body-sm text-slate-muted leading-relaxed">
                  Lifetime access to private regional WhatsApp groups, Discord dev channels, and monthly technical webinars with enterprise mentors.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-card-border font-label-badge text-label-badge text-secondary uppercase font-semibold">
                5,000+ Active Alumni
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block mb-2 font-bold">
            Clear Answers
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body-md text-body-md text-slate-muted mt-2">
            Everything you need to know about formats, materials, locations, and credentials.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-headline-sm text-headline-sm text-primary hover:text-secondary focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`material-symbols-outlined transition-transform duration-200 text-slate-muted ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-muted font-body-md text-body-md border-t border-card-border leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Campus Partnership Banner */}
      <section className="py-16 md:py-20 bg-deep-canopy text-surface-container-lowest relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-electric-lime/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="bg-primary-container/40 rounded-2xl border border-secondary/30 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-sm">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-canopy border border-electric-lime/30 text-electric-lime font-label-badge text-label-badge mb-4">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>ICAR &amp; State University Outreach</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-surface-container-lowest tracking-tight mb-3">
                Want to Host an AgriYuvaa Workshop on Your Campus?
              </h2>
              <p className="font-body-md text-body-md text-surface-variant leading-relaxed">
                We partner directly with State Agricultural Universities, KVKs, and engineering colleges to bring on-campus drone flight training rigs, automated NFT units, and certification programs to your students.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
              <a
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-lg bg-electric-lime text-deep-canopy font-bold font-label-interactive text-label-interactive hover:brightness-105 transition-all shadow-md active:scale-95"
                href="mailto:campus@agriyuvaa.com"
              >
                Request Campus Partnership
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-lg border border-secondary-fixed/50 text-surface-container-lowest font-label-interactive text-label-interactive hover:bg-white/5 transition-colors"
              >
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
