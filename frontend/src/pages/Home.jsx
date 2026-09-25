import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  UserPlus,
  SearchCheck,
  Handshake,
  Calendar,
  Landmark,
  BookOpen,
  Star,
  Sprout,
  FileText,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { fetchJobs, fetchCategories, fetchGovtJobs } from "../services/jobService.js";
import { fetchBlogs, fetchTestimonials } from "../services/landingService.js";
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
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
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
    fetchBlogs({ limit: 3, targetSite: "jobs" })
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]));
    fetchTestimonials({ targetSite: "jobs" })
      .then((data) => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => setTestimonials([]));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div>
            <span className="inline-block bg-brand-green-light text-brand-green-dark text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
              Built for the next generation of agriculture
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight mb-3 sm:mb-5">
              Grow your career in <span className="text-brand-green">agriculture</span>
            </h1>
            <p className="text-brand-grey text-base sm:text-lg mb-6 sm:mb-8 max-w-lg">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold">Browse by Category</h2>
          <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1">
            View all jobs <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((c) => (
            <CategoryCard key={c._id} category={c} />
          ))}
        </div>
      </section>

      {/* Government Agriculture Vacancies Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-lg border border-emerald-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span>🏛️ Central & State Govt Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
              Looking for Government Agriculture Vacancies?
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
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
        <section className="bg-brand-surface border-y border-brand-border py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
            {featuredJobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-display font-bold">Featured Opportunities</h2>
                  <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1">
                    View all <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {featuredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {/* 3 Cards of Government Jobs */}
            {govtJobs.length > 0 && (
              <div className={featuredJobs.length > 0 ? "pt-8 sm:pt-10 border-t border-brand-border" : ""}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2 sm:gap-2.5">
                      <span className="p-1.5 rounded-xl bg-emerald-100/70 text-emerald-800 shrink-0">
                        <Landmark size={18} />
                      </span>
                      <span>Government Agriculture Vacancies</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
                      Live recruitment notifications from ICAR, NABARD, State PSC & PSUs
                    </p>
                  </div>
                  <Link to="/govt-jobs" className="text-xs sm:text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1 shrink-0">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-6 sm:mb-10 text-center">How AgriYuvaa Works</h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand-black text-brand-green flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <step.icon size={22} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">{step.title}</h3>
              <p className="text-xs sm:text-sm text-brand-grey max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resume Builder Advertisement Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-800/40 text-white p-6 sm:p-10 lg:p-12 shadow-xl">
          {/* Subtle background glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-emerald-400/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300">
                <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: "4s" }} />
                <span>Specialized Agriculture Resume Builder • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight leading-tight text-white">
                Build an ATS-Friendly Agriculture Resume That <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Gets You Hired</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Specifically formatted for <strong>B.Sc / M.Sc Agriculture, Agronomy, Horticulture, AgriTech & ICAR</strong> graduates. Highlight your field trials, crop expertise, RAWE/internships, and download a recruiter-ready PDF in 2 minutes.
              </p>

              {/* Benefit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Pre-filled Agronomy & AgriTech keywords</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>100% ATS-compliant recruiter formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Instant 1-Click PDF Download & Print</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Syncs directly to your AgriYuvaa candidate profile</span>
                </div>
              </div>

              {/* CTA Row */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/resume-builder"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg text-sm cursor-pointer group"
                >
                  <FileText size={16} className="text-slate-950" />
                  <span>Build Your Resume Now — Free</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Award size={14} className="text-amber-400 shrink-0" />
                  <span>Trusted by 4,500+ Agri graduates</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl p-5 shadow-2xl border border-white/20 transform sm:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      CV
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 leading-tight">Rahul Sharma</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">B.Sc (Hons) Agriculture • PAU</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ATS Score: 98%
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <p className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Core Expertise</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700">Agronomy</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700">Precision Agri</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700">Crop Advisory</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700">Soil Health</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Experience / RAWE</p>
                    <p className="font-semibold text-gray-800 mt-0.5">Field Agronomy Intern</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Conducted pesticide trials, farmer training workshops & drip irrigation demo.</p>
                  </div>
                </div>

                <Link
                  to="/resume-builder"
                  className="mt-3.5 block text-center text-xs font-bold bg-slate-900 hover:bg-emerald-800 text-white py-2 rounded-xl transition-colors"
                >
                  Use This Template →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog & Career Insights */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-brand-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2 sm:gap-2.5">
                <span className="p-1.5 rounded-xl bg-emerald-100/70 text-emerald-800 shrink-0">
                  <BookOpen size={18} />
                </span>
                <span>Career Advice & Industry Insights</span>
              </h2>
              <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
                Expert tips, agri-business updates, and ICAR exam strategies
              </p>
            </div>
            <Link to="/blog" className="text-xs sm:text-sm font-semibold text-brand-green-dark inline-flex items-center gap-1 shrink-0">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="card overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <div className="aspect-[16/9] bg-emerald-50 overflow-hidden relative">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-50 to-emerald-50/60 text-emerald-800/40"
                    style={{ display: blog.coverImage ? "none" : "flex" }}
                  >
                    <Sprout size={32} />
                    <span className="text-[10px] font-bold tracking-wider text-emerald-900/50 uppercase">AgriYuvaa Insights</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {blog.tags?.[0] && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mb-2 inline-block">
                        {blog.tags[0]}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-base text-brand-black group-hover:text-brand-green-dark transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-brand-grey line-clamp-2 mt-1.5 leading-relaxed">
                      {blog.excerpt || (blog.content ? blog.content.substring(0, 120).replace(/<[^>]+>/g, "").trim() + "..." : "Explore this article for career insights and sector updates.")}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-grey">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : ""}
                    </span>
                    <span className="font-semibold text-brand-green-dark inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials / Community Feedback */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-border">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-display font-bold flex items-center justify-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-amber-100/80 text-amber-700 shrink-0">
                <Star size={20} className="fill-amber-400 text-amber-500" />
              </span>
              <span>Trusted by Candidates & Agri Recruiters</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey mt-1">
              Read how AgriYuvaa helps youth find agriculture jobs and employers hire skilled talent.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div
                key={t._id}
                className="card p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-brand-grey italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-brand-border">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-brand-border"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      {t.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">{t.name}</h4>
                    <p className="text-xs text-brand-grey">{t.role || "Agriculture Professional"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
