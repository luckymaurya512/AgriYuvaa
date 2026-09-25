import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Briefcase,
  TrendingUp,
  Sprout,
  CheckCircle2,
  Users,
} from "lucide-react";
import SEO from "../components/SEO.jsx";

const companyDirectory = [
  {
    id: "dehaat",
    name: "DeHaat",
    tagline: "India's Leading AI-Driven Full-Stack AgriTech Platform",
    sector: "Input Supply & Advisory",
    category: "AgriTech Unicorn",
    hq: "Gurugram & Patna, India",
    established: "2012",
    scale: "Reaching 2.5M+ Farmers",
    website: "https://www.agrevolution.in",
    description:
      "Full-stack agricultural services platform providing customized farmer advisory, direct input supply (seeds, fertilizers, agrochemicals), and post-harvest market linkages through digital micro-entrepreneur centers.",
    tags: ["AI Advisory", "Micro-Warehousing", "Supply Chain", "B2B Agritech"],
    color: "from-emerald-700 to-green-900",
  },
  {
    id: "ninjacart",
    name: "Ninjacart",
    tagline: "Pioneering Agri-Marketing & B2B Fresh Produce Supply Chain",
    sector: "Post-Harvest & Supply Chain",
    category: "Fresh Produce Tech",
    hq: "Bengaluru, Karnataka",
    established: "2015",
    scale: "Moves 1,500+ Tons/Day",
    website: "https://www.ninjacart.in",
    description:
      "Tech-driven supply chain platform connecting fresh fruit and vegetable farmers directly with retailers, supermarkets, and restaurants within 12 hours of harvest using advanced algorithms.",
    tags: ["Logistics Automation", "Cold Chain", "Farm-to-Store", "Demand Forecasting"],
    color: "from-green-800 to-emerald-950",
  },
  {
    id: "agrostar",
    name: "AgroStar",
    tagline: "Helping Farmers Win with Digital Agronomy & Direct Inputs",
    sector: "eCommerce & Farmer Advisory",
    category: "Omnichannel AgriTech",
    hq: "Pune, Maharashtra",
    established: "2013",
    scale: "5M+ App Downloads",
    website: "https://www.agrostar.in",
    description:
      "Direct-to-farmer digital commerce and advisory ecosystem empowering growers with real-time agronomic guidance and high-quality agri-inputs delivered directly to their doorstep.",
    tags: ["Agronomy Advisory", "Agri-Commerce", "Quality Seeds", "Omnichannel"],
    color: "from-amber-600 to-emerald-850",
  },
  {
    id: "cropin",
    name: "CropIn Technology",
    tagline: "Global Cloud Ecosystem for Smart Precision Agriculture",
    sector: "Precision Agri & Satellite GIS",
    category: "Agri-SaaS Enterprise",
    hq: "Bengaluru, Karnataka",
    established: "2010",
    scale: "7M+ Acres Digitized",
    website: "https://www.cropin.com",
    description:
      "Enterprise SaaS and AI platform delivering pixel-level satellite crop intelligence, yield prediction, climate risk modeling, and farm traceability for agribusinesses and financial institutions.",
    tags: ["Satellite Remote Sensing", "AI Yield Prediction", "Climate Resilient", "Traceability"],
    color: "from-teal-700 to-emerald-900",
  },
  {
    id: "itc-maars",
    name: "ITC MAARS (Meta Market for Advanced Agriculture)",
    tagline: "Next-Generation Phygital Agricultural Ecosystem",
    sector: "Corporate Agribusiness",
    category: "Conglomerate AgTech",
    hq: "Kolkata & Hyderabad",
    established: "2021",
    scale: "1,150+ FPOs Onboarded",
    website: "https://www.itcportal.com",
    description:
      "ITC's phygital platform delivering hyper-local weather alerts, precision agronomy, customized farm credit, and direct crop procurement directly integrated with Farmer Producer Organizations (FPOs).",
    tags: ["FPO Integration", "Direct Procurement", "Agri-Fintech", "Crop Insurance"],
    color: "from-emerald-850 to-stone-900",
  },
  {
    id: "coromandel",
    name: "Coromandel International",
    tagline: "Pioneering Crop Nutrition & Agricultural Drone Solutions",
    sector: "Crop Nutrition & Seeds",
    category: "Agri Conglomerate",
    hq: "Hyderabad, Telangana",
    established: "1961",
    scale: "₹25,000+ Cr Turnover",
    website: "https://www.coromandel.biz",
    description:
      "India's leading agri-solutions provider in phosphatic fertilizers, specialty nutrients, organic bio-fertilizers, crop protection, and custom drone spraying services via Gromor Drive.",
    tags: ["Fertilizers", "Gromor Drones", "Specialty Nutrients", "Agri-Retail"],
    color: "from-green-700 to-emerald-900",
  },
  {
    id: "bharatagri",
    name: "BharatAgri",
    tagline: "Algorithm-Based Precision Farming & Crop Calendar Platform",
    sector: "Precision Agri & Drones",
    category: "AgriTech Startup",
    hq: "Pune & Bengaluru",
    established: "2017",
    scale: "1M+ Active Farmers",
    website: "https://bharatagri.com",
    description:
      "Algorithmic dynamic crop advisory platform optimizing irrigation and fertilization schedules per farm soil condition, weather forecasts, and satellite moisture readings.",
    tags: ["Crop Calendars", "Satellite Monitoring", "Soil Advisory", "Farm Inputs"],
    color: "from-emerald-700 to-green-950",
  },
  {
    id: "godrej-agrovet",
    name: "Godrej Agrovet Ltd",
    tagline: "Diversified Agri-Business in Animal Feed, Oil Palm & Crop Protection",
    sector: "Animal Feed & Oil Palm",
    category: "Public Agribusiness",
    hq: "Mumbai, Maharashtra",
    established: "1991",
    scale: "PAN India Presence",
    website: "https://www.godrejagrovet.com",
    description:
      "R&D-driven agribusiness leader across animal feed formulations, sustainable oil palm plantation development, hybrid seeds, and astec lifesciences crop protection chemistry.",
    tags: ["Animal Feed", "Oil Palm", "Biostimulants", "Crop Science"],
    color: "from-stone-800 to-emerald-900",
  },
];

const companySectors = [
  "All Sectors",
  "Input Supply & Advisory",
  "Post-Harvest & Supply Chain",
  "eCommerce & Farmer Advisory",
  "Precision Agri & Satellite GIS",
  "Crop Nutrition & Seeds",
  "Animal Feed & Oil Palm",
];

const Companies = () => {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");

  const filteredCompanies = companyDirectory.filter((c) => {
    const matchesSector =
      selectedSector === "All Sectors" || c.sector === selectedSector;
    const matchesSearch =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <SEO
        title="Top AgriTech & Agribusiness Companies in India"
        description="Explore top Indian agriculture and agritech companies hiring youth: DeHaat, Ninjacart, AgroStar, CropIn, UPL, Godrej Agrovet, and more."
        canonical="/companies"
      />
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-900 via-green-950 to-emerald-900 text-white p-5 sm:p-12 mb-6 sm:mb-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Sprout size={14} /> Ecosystem Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
            Top AgriTech Companies & Agribusinesses
          </h1>
          <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed">
            Explore leading agricultural enterprises, innovative AgriTech unicorns, and agribusiness conglomerates hiring agricultural talent on AgriYuvaa.
          </p>
        </div>

        {/* Decorative background */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <Building2 size={280} />
        </div>
      </div>

      {/* Search & Sector Filters */}
      <div className="card p-4 sm:p-5 mb-6 sm:mb-8 space-y-4 shadow-sm border border-brand-border">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-brand-grey" />
          <input
            type="text"
            placeholder="Search companies by name, technology, or tag (e.g. DeHaat, Drones, GIS, Ninjacart)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-border">
          <span className="text-xs font-bold uppercase text-brand-grey mr-2 flex items-center gap-1">
            <Filter size={13} /> Sector:
          </span>
          {companySectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedSector === sector
                  ? "bg-emerald-800 text-white font-bold shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            className="card p-4 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow border border-brand-border space-y-4"
          >
            <div className="space-y-3">
              {/* Header: Name, Category, HQ */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {comp.category}
                  </span>
                  <h2 className="text-xl font-display font-bold text-brand-black mt-1">
                    {comp.name}
                  </h2>
                  <p className="text-xs font-medium text-brand-grey">{comp.tagline}</p>
                </div>

                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-display font-extrabold text-lg shrink-0 border border-emerald-200">
                  {comp.name[0]}
                </div>
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-brand-grey pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-brand-green" /> {comp.hq}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={13} className="text-brand-green" /> {comp.scale}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-700 leading-relaxed">{comp.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {comp.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action Links */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
              <a
                href={comp.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-grey hover:text-brand-black flex items-center gap-1"
              >
                Official Site <ExternalLink size={12} />
              </a>

              <Link
                to={`/jobs?search=${encodeURIComponent(comp.name)}`}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-2xs"
              >
                <Briefcase size={13} /> View Jobs on AgriYuvaa
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
