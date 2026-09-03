import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Star, CheckCircle, XCircle, Landmark, Edit3, Trash2, Search, Sparkles } from "lucide-react";
import {
  fetchPlatformStats,
  fetchPendingEmployers,
  verifyEmployer,
  fetchPendingJobs,
  fetchAllPlatformJobs,
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
  const [actionSuccess, setActionSuccess] = useState("");

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchPendingEmployers().then(setPendingEmployers).catch(() => {});
    fetchPendingJobs().then(setPendingJobs).catch(() => {});
    loadPlatformJobs();
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

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadPlatformJobs();
  }, [jobStatusFilter]);

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
