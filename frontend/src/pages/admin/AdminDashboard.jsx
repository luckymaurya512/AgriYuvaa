import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Star,
  CheckCircle,
  XCircle,
  Landmark,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  Users,
  Download,
  ExternalLink,
  FileText,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Layers,
  Briefcase,
} from "lucide-react";
import {
  fetchPlatformStats,
  fetchPendingEmployers,
  verifyEmployer,
  fetchPendingJobs,
  fetchAllPlatformJobs,
  fetchAllApplications,
  reviewJob,
  toggleJobFeatured,
} from "../../services/adminService.js";
import { deleteJob } from "../../services/jobService.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Platform Applications State
  const [applications, setApplications] = useState([]);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [loadingApps, setLoadingApps] = useState(false);
  const [appViewMode, setAppViewMode] = useState("by_job"); // "by_job" | "all_feed"
  const [expandedJobIds, setExpandedJobIds] = useState(new Set());

  const [actionSuccess, setActionSuccess] = useState("");

  const toggleExpandJob = (jobId) => {
    setExpandedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const toggleExpandAll = (allIds) => {
    if (expandedJobIds.size === allIds.length) {
      setExpandedJobIds(new Set());
    } else {
      setExpandedJobIds(new Set(allIds));
    }
  };

  // Group applications by Job Posting
  const groupedJobs = useMemo(() => {
    const map = new Map();

    // Initialize all existing jobs
    allJobs.forEach((job) => {
      map.set(job._id.toString(), {
        jobId: job._id,
        title: job.title,
        companyName: job.companyName || job.employer?.name || "Hiring Company",
        location: job.location || "Remote / Pan-India",
        category: job.category?.name || "General",
        status: job.status,
        isFeatured: job.isFeatured,
        createdAt: job.createdAt,
        applicants: [],
      });
    });

    // Populate applications under each job
    applications.forEach((app) => {
      const jId = app.job?._id?.toString() || app.job?.toString() || "archived";
      if (!map.has(jId)) {
        map.set(jId, {
          jobId: app.job?._id || jId,
          title: app.job?.title || "Archived / Removed Job",
          companyName: app.job?.companyName || app.job?.employer?.name || "Company",
          location: app.job?.location || "",
          category: "General",
          status: "closed",
          isFeatured: false,
          createdAt: app.createdAt,
          applicants: [],
        });
      }
      map.get(jId).applicants.push(app);
    });

    let list = Array.from(map.values());

    // Search query filtering
    if (appSearch && appSearch.trim()) {
      const q = appSearch.trim().toLowerCase();
      list = list.filter((j) => {
        const matchJob =
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q);
        const matchApplicant = j.applicants.some(
          (a) =>
            a.seeker?.name?.toLowerCase().includes(q) ||
            a.seeker?.email?.toLowerCase().includes(q)
        );
        return matchJob || matchApplicant;
      });
    }

    // Sort by number of applicants descending (jobs with applications on top)
    return list.sort((a, b) => b.applicants.length - a.applicants.length || new Date(b.createdAt) - new Date(a.createdAt));
  }, [allJobs, applications, appSearch]);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchPendingEmployers().then(setPendingEmployers).catch(() => {});
    fetchPendingJobs().then(setPendingJobs).catch(() => {});
    loadPlatformJobs();
    loadPlatformApplications();
  };

  const loadPlatformJobs = () => {
    setLoadingJobs(true);
    fetchAllPlatformJobs({
      status: jobStatusFilter !== "all" ? jobStatusFilter : undefined,
      search: jobSearch.trim() || undefined,
    })
      .then(setAllJobs)
      .catch(() => setAllJobs([]))
      .finally(() => setLoadingJobs(false));
  };

  const loadPlatformApplications = () => {
    setLoadingApps(true);
    fetchAllApplications({
      status: appStatusFilter !== "all" ? appStatusFilter : undefined,
      search: appSearch.trim() || undefined,
    })
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoadingApps(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadPlatformJobs();
  }, [jobStatusFilter]);

  useEffect(() => {
    loadPlatformApplications();
  }, [appStatusFilter]);

  const handleEmployerDecision = async (id, decision) => {
    await verifyEmployer(id, decision);
    loadAll();
  };

  const handleJobDecision = async (id, decision, isFeatured = false) => {
    await reviewJob(
      id,
      decision,
      decision === "rejected" ? "Did not meet posting guidelines" : undefined,
      isFeatured
    );
    loadAll();
  };

  const handleToggleFeatured = async (job) => {
    try {
      const res = await toggleJobFeatured(job._id);
      setActionSuccess(
        res.isFeatured
          ? `⭐ "${job.title}" has been set to FEATURED.`
          : `ℹ️ "${job.title}" has been unfeatured.`
      );
      setTimeout(() => setActionSuccess(""), 4000);
      loadPlatformJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle featured status");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job._id);
      setActionSuccess(`Job "${job.title}" has been removed.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-brand-grey">Review employer verifications, job moderation, and featured promotions</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/govt-jobs"
            className="btn-secondary text-sm flex items-center gap-2 py-2.5 px-4 shadow-2xs"
          >
            <Landmark size={16} /> Manage Govt Vacancies
          </Link>
          <Link
            to="/employer/post-job"
            className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4 shadow-sm"
          >
            <PlusCircle size={16} /> Post Direct Job / Hiring Alert
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <span>{actionSuccess}</span>
        </div>
      )}

      {stats && (
        <div className="grid md:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Jobs" value={stats.totalJobs} />
          <StatCard label="Pending Jobs" value={stats.pendingJobs} />
          <StatCard label="Applications" value={stats.totalApplications} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pending Employers */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">
            Pending Employer Verifications ({pendingEmployers.length})
          </div>
          <div className="divide-y divide-brand-border">
            {pendingEmployers.length === 0 && (
              <p className="p-5 text-sm text-brand-grey">No employers pending verification.</p>
            )}
            {pendingEmployers.map((emp) => (
              <div key={emp._id} className="p-5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{emp.companyName}</p>
                  <p className="text-xs text-brand-grey">{emp.user?.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEmployerDecision(emp._id, "approved")}
                    className="text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleEmployerDecision(emp._id, "rejected")}
                    className="text-xs font-semibold bg-brand-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Job Approvals */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">
            Pending Job Approvals ({pendingJobs.length})
          </div>
          <div className="divide-y divide-brand-border">
            {pendingJobs.length === 0 && (
              <p className="p-5 text-sm text-brand-grey">No jobs pending approval.</p>
            )}
            {pendingJobs.map((job) => (
              <div key={job._id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-brand-black">{job.title}</p>
                      {job.featuredRequested && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          <Star size={10} fill="currentColor" /> Boost Requested
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-grey mt-0.5">
                      {job.companyName || job.employer?.name} · {job.location} · {job.employmentType}
                    </p>
                  </div>
                </div>

                {/* Actions: Approve Standard vs Approve & Feature vs Reject */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => handleJobDecision(job._id, "approved", true)}
                    className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    title="Approve job and pin it with Featured Gold Badge"
                  >
                    <Star size={12} fill="currentColor" /> Approve & Feature
                  </button>

                  <button
                    onClick={() => handleJobDecision(job._id, "approved", false)}
                    className="text-xs font-semibold bg-brand-green hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Approve (Standard)
                  </button>

                  <button
                    onClick={() => handleJobDecision(job._id, "rejected")}
                    className="text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reject
                  </button>

                  <Link
                    to={`/employer/post-job?edit=${job._id}`}
                    className="text-xs font-semibold text-gray-600 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1 ml-auto"
                  >
                    <Edit3 size={13} /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALL PLATFORM JOBS MANAGER (FEATURE TOGGLE, EDIT, DELETE) ── */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2">
              <span>All Platform Job Postings ({allJobs.length})</span>
            </h3>
            <p className="text-xs text-brand-grey mt-0.5">
              Edit any job listing, toggle featured gold boost, or remove closed postings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="input-field text-xs py-2 bg-white w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved / Live</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected</option>
            </select>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadPlatformJobs();
              }}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                placeholder="Search job or company..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="input-field text-xs py-2 w-48 sm:w-56"
              />
              <button type="submit" className="btn-secondary text-xs py-2 px-3 shrink-0">
                <Search size={13} />
              </button>
            </form>
          </div>
        </div>

        {loadingJobs ? (
          <p className="p-6 text-sm text-brand-grey text-center">Loading platform jobs...</p>
        ) : allJobs.length === 0 ? (
          <p className="p-6 text-sm text-brand-grey text-center">No jobs found matching your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                <tr>
                  <th className="text-left px-5 py-3">Job Title & Company</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-center px-5 py-3">Featured Boost</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job) => (
                  <tr key={job._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/jobs/${job._id}`} className="font-semibold text-brand-black hover:text-brand-green-dark hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-xs text-brand-grey mt-0.5">
                        {job.companyName || job.employer?.name || "Company"} · {job.location}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-brand-grey">
                      {job.category?.name || "General"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          job.status === "approved"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            : job.status === "pending"
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(job)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                          job.isFeatured
                            ? "bg-amber-400 text-amber-950 border border-amber-500 hover:bg-amber-300"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
                        }`}
                        title={job.isFeatured ? "Click to Remove Featured status" : "Click to Make Featured"}
                      >
                        <Star size={13} fill={job.isFeatured ? "currentColor" : "none"} />
                        {job.isFeatured ? "Featured ⭐" : "Feature"}
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2">
                      <Link
                        to={`/employer/post-job?edit=${job._id}`}
                        className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                        title="Edit all fields of this job listing"
                      >
                        <Edit3 size={13} /> Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors inline-flex items-center gap-1"
                        title="Delete this job"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ALL PLATFORM APPLICATIONS (GROUPED BY JOB POSTING OR ALL FEED) ── */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2">
                <Users size={18} className="text-brand-green" />
                <span>Job Applications Breakdown</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {applications.length} Total Applicants
              </span>
            </div>
            <p className="text-xs text-brand-grey mt-0.5">
              View how many candidates applied for each specific job posting, and drill down into their resumes and statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: By Job vs Full Feed */}
            <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAppViewMode("by_job")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  appViewMode === "by_job"
                    ? "bg-white text-emerald-900 shadow-2xs font-bold"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Briefcase size={13} /> Group by Job ({groupedJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setAppViewMode("all_feed")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  appViewMode === "all_feed"
                    ? "bg-white text-emerald-900 shadow-2xs font-bold"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Layers size={13} /> Flat Feed ({applications.length})
              </button>
            </div>

            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="input-field text-xs py-2 bg-white w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="viewed">Viewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadPlatformApplications();
              }}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                placeholder="Search job, company, or seeker..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="input-field text-xs py-2 w-44 sm:w-56"
              />
              <button type="submit" className="btn-secondary text-xs py-2 px-3 shrink-0">
                <Search size={13} />
              </button>
            </form>
          </div>
        </div>

        {loadingApps ? (
          <p className="p-8 text-sm text-brand-grey text-center">Loading applications...</p>
        ) : appViewMode === "by_job" ? (
          /* ── VIEW 1: GROUPED BY JOB POSTING (APPLICANTS COUNT & EXPANDABLE LIST) ── */
          <div className="divide-y divide-brand-border">
            <div className="p-4 bg-gray-50 flex items-center justify-between text-xs text-brand-grey">
              <span>
                Showing <strong>{groupedJobs.length}</strong> job postings with candidate breakdown
              </span>
              <button
                onClick={() => toggleExpandAll(groupedJobs.map((j) => j.jobId.toString()))}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
              >
                {expandedJobIds.size === groupedJobs.length ? "Collapse All" : "Expand All Applicants"}
              </button>
            </div>

            {groupedJobs.length === 0 ? (
              <p className="p-8 text-sm text-brand-grey text-center">No job postings found matching your search.</p>
            ) : (
              groupedJobs.map((group) => {
                const isExpanded = expandedJobIds.has(group.jobId.toString());
                const count = group.applicants.length;

                return (
                  <div key={group.jobId} className="transition-colors hover:bg-gray-50/40">
                    {/* Job Summary Row Header */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/jobs/${group.jobId}`}
                            className="font-display font-bold text-base text-brand-black hover:text-brand-green-dark hover:underline flex items-center gap-1.5"
                          >
                            {group.title} <ExternalLink size={13} className="text-brand-grey shrink-0" />
                          </Link>

                          {group.isFeatured && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                              ⭐ Featured
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                              group.status === "approved"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : group.status === "pending"
                                ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {group.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-grey">
                          <span className="font-semibold text-emerald-950 flex items-center gap-1">
                            <Building2 size={13} className="text-emerald-700" /> {group.companyName}
                          </span>
                          {group.location && <span>• {group.location}</span>}
                          <span>• {group.category}</span>
                        </div>
                      </div>

                      {/* Right: Applicants Count Badge + Actions */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
                            count > 0
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          <Users size={14} className={count > 0 ? "text-emerald-700" : "text-gray-400"} />
                          <span>
                            {count} {count === 1 ? "Seeker Applied" : "Seekers Applied"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleExpandJob(group.jobId.toString())}
                          className={`btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 ${
                            isExpanded ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-white"
                          }`}
                        >
                          {isExpanded ? (
                            <>
                              Hide Seekers <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              View Seekers ({count}) <ChevronDown size={14} />
                            </>
                          )}
                        </button>

                        <Link
                          to={`/employer/jobs/${group.jobId}/applicants`}
                          className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-2 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                          title="Open dedicated applicant reviewer"
                        >
                          Manage ↗
                        </Link>
                      </div>
                    </div>

                    {/* Expandable Applicants List */}
                    {isExpanded && (
                      <div className="bg-emerald-50/20 border-t border-brand-border p-4 sm:p-5">
                        {group.applicants.length === 0 ? (
                          <div className="py-6 text-center text-xs text-brand-grey bg-white rounded-xl border border-dashed border-brand-border">
                            No job seekers have applied for this position yet.
                          </div>
                        ) : (
                          <div className="overflow-x-auto bg-white rounded-xl border border-brand-border shadow-2xs">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-50 text-brand-grey font-bold uppercase tracking-wider border-b border-brand-border">
                                <tr>
                                  <th className="text-left px-4 py-3">Applicant</th>
                                  <th className="text-left px-4 py-3">Contact</th>
                                  <th className="text-left px-4 py-3">Applied On</th>
                                  <th className="text-left px-4 py-3">Status</th>
                                  <th className="text-left px-4 py-3">Cover Note</th>
                                  <th className="text-right px-4 py-3">Resume</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-brand-border">
                                {group.applicants.map((app) => {
                                  const backendBase = (
                                    import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
                                  ).replace(/\/api\/?$/, "");

                                  let downloadUrl = app.resumeUrl ? app.resumeUrl.trim() : "";
                                  downloadUrl = downloadUrl.replace(/^https?:\/\/\/+/, "/");

                                  if (downloadUrl.startsWith("/uploads/")) {
                                    downloadUrl = `${backendBase}${downloadUrl}`;
                                  } else if (
                                    !downloadUrl.startsWith("http://") &&
                                    !downloadUrl.startsWith("https://") &&
                                    downloadUrl.length > 0
                                  ) {
                                    downloadUrl = `https://${downloadUrl}`;
                                  } else if (!downloadUrl) {
                                    downloadUrl = `${backendBase}/api/applications/${app._id}/resume`;
                                  }

                                  return (
                                    <tr key={app._id} className="hover:bg-gray-50/70 transition-colors">
                                      <td className="px-4 py-3 font-bold text-brand-black">
                                        {app.seeker?.name || "Applicant"}
                                      </td>
                                      <td className="px-4 py-3 text-brand-grey">
                                        <p>{app.seeker?.email}</p>
                                        {app.seeker?.phone && <p className="text-[11px]">📞 {app.seeker.phone}</p>}
                                      </td>
                                      <td className="px-4 py-3 text-brand-grey whitespace-nowrap">
                                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                            app.status === "shortlisted"
                                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                              : app.status === "hired"
                                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                                              : app.status === "rejected"
                                              ? "bg-red-100 text-red-800 border border-red-200"
                                              : app.status === "viewed"
                                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          ● {app.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate italic">
                                        {app.coverNote || "-"}
                                      </td>
                                      <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <a
                                          href={downloadUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                                        >
                                          <Download size={12} /> Resume
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ── VIEW 2: ALL INDIVIDUAL APPLICATIONS FEED TABLE ── */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                <tr>
                  <th className="text-left px-5 py-3">Candidate</th>
                  <th className="text-left px-5 py-3">Target Company & Role</th>
                  <th className="text-left px-5 py-3">Applied On</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const backendBase = (
                    import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
                  ).replace(/\/api\/?$/, "");

                  let downloadUrl = app.resumeUrl ? app.resumeUrl.trim() : "";
                  downloadUrl = downloadUrl.replace(/^https?:\/\/\/+/, "/");

                  if (downloadUrl.startsWith("/uploads/")) {
                    downloadUrl = `${backendBase}${downloadUrl}`;
                  } else if (
                    !downloadUrl.startsWith("http://") &&
                    !downloadUrl.startsWith("https://") &&
                    downloadUrl.length > 0
                  ) {
                    downloadUrl = `https://${downloadUrl}`;
                  } else if (!downloadUrl) {
                    downloadUrl = `${backendBase}/api/applications/${app._id}/resume`;
                  }

                  const companyName =
                    app.job?.companyName || app.job?.employer?.name || "Hiring Company";

                  return (
                    <tr key={app._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-brand-black">{app.seeker?.name || "Applicant"}</p>
                        <p className="text-xs text-brand-grey mt-0.5">{app.seeker?.email}</p>
                        {app.seeker?.phone && <p className="text-[11px] text-brand-grey">📞 {app.seeker.phone}</p>}
                      </td>

                      <td className="px-5 py-3.5">
                        {app.job ? (
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="font-semibold text-brand-black hover:text-brand-green-dark hover:underline flex items-center gap-1.5"
                          >
                            {app.job.title} <ExternalLink size={11} className="text-brand-grey shrink-0" />
                          </Link>
                        ) : (
                          <p className="font-semibold text-brand-grey">Job closed / removed</p>
                        )}
                        <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 size={13} className="text-emerald-700 shrink-0" />
                          {companyName} {app.job?.location ? `· ${app.job.location}` : ""}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-brand-grey whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-brand-grey shrink-0" />
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                            app.status === "shortlisted"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : app.status === "hired"
                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : app.status === "viewed"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          ● {app.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                        >
                          <Download size={13} /> Resume
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs text-brand-grey uppercase font-semibold">{label}</p>
    <p className="text-3xl font-display font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
