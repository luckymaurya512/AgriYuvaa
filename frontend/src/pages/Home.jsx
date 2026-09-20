import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, UserPlus, SearchCheck, Handshake } from "lucide-react";
import { fetchJobs, fetchCategories, fetchGovtJobs } from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";
import GovtJobCard from "../components/GovtJobCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import SEO from "../components/SEO.jsx";

const stats = [
  { label: "Active Jobs", value: "5,000+" },
  { label: "Employers", value: "1,200+" },
  { label: "Regions Covered", value: "30+" },
  { label: "Youth Hired", value: "18,000+" },
];

const steps = [
  { icon: UserPlus, title: "Create Your Profile", desc: "Add your skills, education, and preferred agri sectors in minutes." },
  { icon: SearchCheck, title: "Search & Apply", desc: "Filter jobs by crop, category, location, and employment type." },
  { icon: Handshake, title: "Get Hired", desc: "Track your applications and connect directly with employers." },
];

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [govtJobs, setGovtJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs({ limit: 6, sort: "-isFeatured -createdAt" })
      .then((data) => setFeaturedJobs(data.jobs || []))
      .catch(() => setFeaturedJobs([]));
    fetchGovtJobs()
      .then((data) => setGovtJobs(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setGovtJobs([]));
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgriYuvaa Jobs",
    url: "https://job.agriyuvaa.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://job.agriyuvaa.com/jobs?keyword={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div>
      <SEO
        title="Agriculture Jobs in India — Farming, AgriTech, Agribusiness"
        description="Search & apply for 5,000+ agricultural jobs in India. Verified openings in agronomy, drone piloting, farm management, agrochemical, and research."
        canonical="/"
        jsonLd={websiteSchema}
      />
      {/* Hero */}
      <section className="bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-brand-green-light text-brand-green-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Built for the next generation of agriculture
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight mb-5">
              Grow your career in <span className="text-brand-green">agriculture</span>
            </h1>
            <p className="text-brand-grey text-lg mb-8 max-w-lg">
              AgriYuvaa connects young talent with real opportunities in farming, agri-tech,
              livestock, food processing, and agri-business — across India.
            </p>

            <form onSubmit={handleSearch} className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-md border border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-xl lg:max-w-2xl">
              <div className="flex items-center gap-2 flex-1 min-w-0 sm:min-w-[220px] px-3 py-1">
                <Search size={18} className="text-brand-grey shrink-0" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, crop, or keyword"
                  className="w-full py-1.5 focus:outline-none text-sm min-w-0"
                />
              </div>
              <div className="hidden sm:block w-px h-6 bg-brand-border self-center" />
              <div className="flex items-center gap-2 flex-1 min-w-0 sm:min-w-[180px] px-3 py-1">
                <MapPin size={18} className="text-brand-grey shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full py-1.5 focus:outline-none text-sm min-w-0"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0 px-6 py-2.5">
                Search Jobs
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <div className="text-2xl font-display font-extrabold text-brand-black">{s.value}</div>
                <div className="text-xs text-brand-grey mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Browse by Category</h2>
          <Link to="/jobs" className="text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1">
            View all jobs <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c._id} category={c} />
          ))}
        </div>
      </section>

      {/* Government Agriculture Vacancies Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span>🏛️ Central & State Govt Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
              Looking for Government Agriculture Vacancies?
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Track live official notifications, eligibility criteria, and application links for <strong>NABARD, IBPS AFO, ICAR, State PSC Agriculture Officers (ADO)</strong>, and PSU recruitments.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg border border-white/10">Banking & NABARD</span>
              <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg border border-white/10">State PSC / ADO</span>
              <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg border border-white/10">ICAR & Research</span>
              <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg border border-white/10">IFFCO & PSUs</span>
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              to="/govt-jobs"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-black font-bold px-6 py-3.5 rounded-xl hover:bg-amber-300 transition-all shadow-md text-sm w-full sm:w-auto whitespace-nowrap"
            >
              Explore Govt Vacancies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs & Government Vacancies */}
      {(featuredJobs.length > 0 || govtJobs.length > 0) && (
        <section className="bg-brand-surface border-y border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {featuredJobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">Featured Opportunities</h2>
                  <Link to="/jobs" className="text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1">
                    View all <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {featuredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {/* 3 Cards of Government Jobs */}
            {govtJobs.length > 0 && (
              <div className={featuredJobs.length > 0 ? "pt-10 border-t border-brand-border" : ""}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                      <span>🏛️</span> Government Agriculture Vacancies
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
                      Live recruitment notifications from ICAR, NABARD, State PSC & PSUs
                    </p>
                  </div>
                  <Link to="/govt-jobs" className="text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1 shrink-0">
                    View all govt vacancies <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {govtJobs.map((job) => (
                    <GovtJobCard key={job._id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-display font-bold mb-10 text-center">How AgriYuvaa Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-brand-black text-brand-green flex items-center justify-center mx-auto mb-4">
                <step.icon size={26} />
              </div>
              <h3 className="font-display font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-brand-grey max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-brand-black rounded-2xl px-8 py-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Hiring for your farm or agri-business?
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Post a job on AgriYuvaa and reach thousands of motivated young candidates across the country.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-colors">
            Post a Job <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
