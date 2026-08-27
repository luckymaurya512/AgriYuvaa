import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { fetchJobs, fetchCategories } from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";

const employmentTypes = ["full-time", "part-time", "seasonal", "daily-wage", "contract", "internship"];

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = {
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    employmentType: searchParams.get("employmentType") || "",
  };

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchJobs({ ...filters, page })
      .then((data) => {
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">Browse Agriculture Jobs</h1>
        <p className="text-sm text-brand-grey">{total} opportunities available right now</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="card p-5 h-fit space-y-6">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <SlidersHorizontal size={16} className="text-brand-green" /> Filters
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Keyword</label>
            <input
              className="input-field mt-2 text-sm"
              defaultValue={filters.keyword}
              placeholder="Job title, crop..."
              onBlur={(e) => updateFilter("keyword", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Location</label>
            <input
              className="input-field mt-2 text-sm"
              defaultValue={filters.location}
              placeholder="City or state"
              onBlur={(e) => updateFilter("location", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Category</label>
            <select
              className="input-field mt-2 text-sm"
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Employment Type</label>
            <select
              className="input-field mt-2 text-sm"
              value={filters.employmentType}
              onChange={(e) => updateFilter("employmentType", e.target.value)}
            >
              <option value="">Any type</option>
              {employmentTypes.map((t) => (
                <option key={t} value={t}>{t.replace("-", " ")}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="py-24 text-center text-brand-grey">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="py-24 text-center text-brand-grey">No jobs match your filters yet. Try widening your search.</div>
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
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${
                    p === page ? "bg-brand-black text-white" : "bg-white border border-brand-border text-brand-grey"
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
