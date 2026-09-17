import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, MapPin, X, RotateCcw } from "lucide-react";
import { fetchJobs, fetchCategories } from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";
import SEO from "../components/SEO.jsx";

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "work-from-home", label: "Work From Home" },
  { value: "internship", label: "Internship" },
];
const experienceFilterOptions = [
  { value: "0-1", label: "0-1 Years (Fresher)" },
  { value: "1-2", label: "1-2 Years" },
  { value: "2-3", label: "2-3 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years" },
];

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter values from URL search params
  const currentKeyword = searchParams.get("keyword") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentEmploymentType = searchParams.get("employmentType") || "";
  const currentExperienceLevel = searchParams.get("experienceLevel") || "";

  // Controlled input states for responsive typing & Enter key submit
  const [keywordInput, setKeywordInput] = useState(currentKeyword);
  const [locationInput, setLocationInput] = useState(currentLocation);

  // Sync inputs whenever URL params change
  useEffect(() => {
    setKeywordInput(currentKeyword);
  }, [currentKeyword]);

  useEffect(() => {
    setLocationInput(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchJobs({
      keyword: currentKeyword,
      location: currentLocation,
      category: currentCategory,
      employmentType: currentEmploymentType,
      experienceLevel: currentExperienceLevel,
      page,
    })
      .then((data) => {
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [searchParams, page, currentKeyword, currentLocation, currentCategory, currentEmploymentType, currentExperienceLevel]);

  const applyTextFilters = (e) => {
    if (e) e.preventDefault();
    const next = new URLSearchParams(searchParams);
    
    if (keywordInput.trim()) next.set("keyword", keywordInput.trim());
    else next.delete("keyword");

    if (locationInput.trim()) next.set("location", locationInput.trim());
    else next.delete("location");

    setPage(1);
    setSearchParams(next);
  };

  const updateSelectFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setKeywordInput("");
    setLocationInput("");
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    currentKeyword || currentLocation || currentCategory || currentEmploymentType || currentExperienceLevel
  );

  const pageTitle = currentKeyword
    ? `${currentKeyword} Jobs in Agriculture`
    : currentCategory
    ? `${currentCategory} Jobs in Agriculture`
    : "Browse Agriculture Jobs & Openings";

  const pageDescription = currentKeyword || currentLocation
    ? `Explore open agriculture positions for ${[currentKeyword, currentLocation].filter(Boolean).join(" in ")}. Apply today on AgriYuvaa.`
    : "Browse full-time, part-time, internship, and fresher jobs in Indian agriculture, agritech, farming, and agribusiness.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical="/jobs"
      />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Browse Agriculture Jobs</h1>
          <p className="text-sm text-brand-grey">
            {loading ? "Searching opportunities..." : `${total} opportunities available right now`}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-grey hover:text-red-600 px-3 py-1.5 rounded-lg border border-brand-border hover:border-red-200 transition-colors"
          >
            <RotateCcw size={14} /> Clear all filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="card p-5 h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <SlidersHorizontal size={16} className="text-brand-green" /> Filters
            </div>
          </div>

          <form onSubmit={applyTextFilters} className="space-y-4">
            {/* Keyword Input */}
            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Keyword</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  className="input-field text-sm pr-8"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyTextFilters(e)}
                  placeholder="Job title, crop, skill..."
                />
                {keywordInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeywordInput("");
                      const next = new URLSearchParams(searchParams);
                      next.delete("keyword");
                      setSearchParams(next);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Location</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  className="input-field text-sm pr-8"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyTextFilters(e)}
                  placeholder="City, State, Delhi..."
                />
                {locationInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocationInput("");
                      const next = new URLSearchParams(searchParams);
                      next.delete("location");
                      setSearchParams(next);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full text-xs py-2">
              Apply Search
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="pt-2 border-t border-brand-border">
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Category</label>
            <select
              className="input-field mt-1 text-sm"
              value={currentCategory}
              onChange={(e) => updateSelectFilter("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Dropdown */}
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Employment Type</label>
            <select
              className="input-field mt-1 text-sm"
              value={currentEmploymentType}
              onChange={(e) => updateSelectFilter("employmentType", e.target.value)}
            >
              <option value="">Any type</option>
              {employmentTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Experience Level</label>
            <select
              className="input-field mt-1 text-sm"
              value={currentExperienceLevel}
              onChange={(e) => updateSelectFilter("experienceLevel", e.target.value)}
            >
              <option value="">All experience levels</option>
              {experienceFilterOptions.map((exp) => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="py-24 text-center text-brand-grey flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              <span>Searching jobs...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-24 text-center text-brand-grey card p-8">
              <p className="text-base font-semibold text-brand-black mb-1">No jobs match your search</p>
              <p className="text-sm text-brand-grey mb-4">Try adjusting your keywords or clearing some filters.</p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="btn-secondary text-xs">
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? "bg-brand-black text-white" : "bg-white border border-brand-border text-brand-grey hover:border-brand-black"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
