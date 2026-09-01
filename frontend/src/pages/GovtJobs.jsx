import React, { useEffect, useState } from "react";
import {
  Landmark,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  FileText,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  IndianRupee,
  AlertCircle,
  Bell,
} from "lucide-react";
import api from "../services/api.js";

const categories = [
  "All",
  "Banking & NABARD",
  "State Govt",
  "Central Govt",
  "Research & ICAR",
  "PSU & Corporations",
];

const qualifications = [
  "All",
  "B.Sc Agriculture",
  "M.Sc / Ph.D",
  "Diploma in Agriculture",
  "B.Tech Agri Engg",
  "Any Graduate",
];

const GovtJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedQual, setSelectedQual] = useState("All");

  const loadGovtJobs = () => {
    setLoading(true);
    api
      .get("/govt-jobs", {
        params: {
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          qualification: selectedQual !== "All" ? selectedQual : undefined,
          search: search.trim() || undefined,
        },
      })
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGovtJobs();
  }, [selectedCategory, selectedQual]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadGovtJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-950 text-white p-8 sm:p-12 mb-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Landmark size={14} /> Official Government & ICAR Vacancies
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Government Agriculture Jobs & Exam Alerts
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Direct recruitment notices for IBPS AFO, State ADO / Agriculture Officers, NABARD, ICAR & IARI Scientists, KVK SMS, and National Seeds Corporation.
          </p>
        </div>

        {/* Decorative background badge */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <Landmark size={300} />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-5 mb-8 space-y-4 shadow-sm border border-brand-border">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3 text-brand-grey" />
            <input
              type="text"
              placeholder="Search by job title, organization, or state (e.g. IBPS, UPPSC, ICAR, AFO)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary text-sm px-6 py-2.5 shrink-0">
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-border">
          <span className="text-xs font-bold uppercase text-brand-grey mr-2 flex items-center gap-1">
            <Filter size={13} /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-800 text-white font-bold shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Qualification Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold uppercase text-brand-grey mr-2 flex items-center gap-1">
            <GraduationCap size={13} /> Eligibility:
          </span>
          {qualifications.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQual(q)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedQual === q
                  ? "bg-brand-black text-white font-bold shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-brand-grey">
          Showing <span className="text-brand-black font-bold">{jobs.length}</span> Government Opportunities
        </p>
        <div className="flex items-center gap-2 text-xs text-brand-grey">
          <Bell size={14} className="text-amber-600" /> Notifications are verified from official government gazettes
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-brand-grey">Loading government notifications...</div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Landmark size={36} className="mx-auto text-gray-400" />
          <h3 className="font-display font-bold text-base text-gray-900">No matching government jobs found</h3>
          <p className="text-xs text-brand-grey">Try adjusting your search terms or clearing selected category filters.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card p-6 sm:p-7 hover:shadow-md transition-shadow space-y-4 border border-brand-border relative"
            >
              {/* Top Row: Organization & Status Badge */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    {job.organization}
                  </span>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-brand-black mt-1.5">
                    {job.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      job.status === "Active"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : job.status === "Closing Soon"
                        ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    ● {job.status}
                  </span>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50/70 rounded-2xl text-xs border border-gray-100">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-brand-grey font-medium">Total Vacancies</p>
                    <p className="font-bold text-brand-black">{job.vacancies}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-brand-grey font-medium">Pay Scale / Salary</p>
                    <p className="font-bold text-brand-black truncate">{job.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-brand-grey font-medium">Eligibility</p>
                    <p className="font-bold text-brand-black">{job.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-brand-grey font-medium">Location / State</p>
                    <p className="font-bold text-brand-black">{job.state}</p>
                  </div>
                </div>
              </div>

              {/* Description & Details */}
              <p className="text-xs text-gray-700 leading-relaxed">{job.description}</p>

              {/* Footer Meta & Action Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-brand-border">
                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-grey">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-700" />
                    <strong>Last Date:</strong> {job.applicationDeadline}
                  </span>
                  {job.examDate && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-700" />
                      <strong>Exam:</strong> {job.examDate}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={job.notificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <FileText size={14} /> Official Notification PDF <ExternalLink size={11} />
                  </a>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
                  >
                    Apply on Govt Portal <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GovtJobs;
