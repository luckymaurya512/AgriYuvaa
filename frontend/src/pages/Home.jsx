import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, UserPlus, SearchCheck, Handshake } from "lucide-react";
import { fetchJobs, fetchCategories } from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";

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
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs({ limit: 6, sort: "-isFeatured -createdAt" })
      .then((data) => setFeaturedJobs(data.jobs || []))
      .catch(() => setFeaturedJobs([]));
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

  return (
    <div>
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

            <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-md border border-brand-border flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-brand-grey shrink-0" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, crop, or keyword"
                  className="w-full py-2 focus:outline-none text-sm"
                />
              </div>
              <div className="hidden sm:block w-px bg-brand-border" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-brand-grey shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full py-2 focus:outline-none text-sm"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
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

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="bg-brand-surface border-y border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
