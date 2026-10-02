import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, Users, Calendar, Clock, ExternalLink } from "lucide-react";
import { fetchMyJobs, deleteJob } from "../../services/jobService.js";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import SEO from "../../components/SEO.jsx";

const statusColors = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  pending: "bg-amber-100 text-amber-900 border-amber-300",
  approved: "bg-emerald-100 text-emerald-900 border-emerald-300",
  rejected: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-gray-200 text-gray-700 border-gray-300",
  expired: "bg-amber-50 text-amber-800 border-amber-200",
};

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ── Confirmation Modal State ──
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    message: "",
    itemName: "",
    itemType: "",
    confirmText: "Yes, Delete Job",
    cancelText: "Keep Job",
    variant: "danger",
    loading: false,
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false, loading: false }));
  };

  const loadJobs = () => {
    setLoading(true);
    fetchMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDeleteJob = (job) => {
    setConfirmConfig({
      isOpen: true,
      title: "Permanently Delete Job Post?",
      subtitle: "This listing will be permanently removed from candidate job feeds.",
      message: (
        <span>
          Are you sure you want to delete <strong>"{job.title}"</strong>?
          All candidate application history and bookmarks linked to this job will be lost.
        </span>
      ),
      itemName: job.title,
      itemType: "Job Listing",
      confirmText: "Yes, Delete Job",
      cancelText: "Keep Job",
      variant: "danger",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        setDeletingId(job._id);
        try {
          await deleteJob(job._id);
          setJobs((prev) => prev.filter((j) => j._id !== job._id));
          setActionSuccess(`Job "${job.title}" has been deleted successfully.`);
          setTimeout(() => setActionSuccess(""), 4000);
        } catch (err) {
          alert(err.response?.data?.message || "Failed to delete job.");
        } finally {
          setDeletingId(null);
          closeConfirmModal();
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <SEO title="Employer Dashboard" noindex={true} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Employer Dashboard</h1>
          <p className="text-sm text-brand-grey">Manage your job listings, track views, and review candidate applicants.</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Post a Job
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            onClick={() => setActionSuccess("")}
            className="text-emerald-700 hover:text-emerald-950 text-base leading-none"
          >
            ×
          </button>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Total Jobs</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-brand-black">{jobs.length}</p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Live / Approved</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-emerald-700">
            {jobs.filter((j) => j.status === "approved").length}
          </p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Pending Review</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-amber-700">
            {jobs.filter((j) => j.status === "pending").length}
          </p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Total Views</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-blue-700">
            {jobs.reduce((sum, j) => sum + (j.views || 0), 0)}
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm flex items-center justify-between bg-gray-50/50">
          <span className="font-display font-bold text-brand-black">My Job Postings</span>
          <span className="text-xs bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded-full font-bold">
            {jobs.length} Listed
          </span>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-brand-grey">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-brand-black">You haven't posted any jobs yet.</p>
            <p className="text-xs text-brand-grey">Start hiring agriculture talent by publishing your first opportunity.</p>
            <Link to="/employer/post-job" className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-4 mt-2">
              <Plus size={14} /> Post Your First Job
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View (< 768px) */}
            <div className="md:hidden divide-y divide-gray-100">
              {jobs.map((job) => {
                const deadlineDate = job.applicationDeadline || job.expiresAt;
                const isExpired = deadlineDate && new Date(deadlineDate) < new Date();

                return (
                  <div key={job._id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-bold text-sm text-brand-black hover:text-brand-green-dark block leading-snug line-clamp-2"
                        >
                          {job.title}
                        </Link>
                        <span className="text-xs text-brand-grey mt-0.5 inline-block capitalize">
                          {job.category?.name || "Agriculture"} · {job.employmentType?.replace(/-/g, " ")}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${
                          statusColors[job.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-brand-grey">
                      <span>👁️ {job.views || 0} views</span>
                      <span>•</span>
                      {deadlineDate ? (
                        <span className={`flex items-center gap-1 ${isExpired ? "text-amber-800 font-bold" : ""}`}>
                          <Clock size={11} className={isExpired ? "text-amber-700" : "text-gray-400"} />
                          Closes {new Date(deadlineDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">No deadline</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Users size={13} /> Applicants
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/employer/post-job?edit=${job._id}`}
                          className="text-xs font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deletingId === job._id}
                          onClick={() => handleDeleteJob(job)}
                          className="text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2.5 py-1.5 rounded-lg border border-red-200 hover:border-red-600 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-brand-surface text-xs uppercase text-brand-grey border-b border-brand-border">
                  <tr>
                    <th className="text-left px-5 py-3">Title & Category</th>
                    <th className="text-left px-5 py-3">Views</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Deadline</th>
                    <th className="text-left px-5 py-3">Applicants</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {jobs.map((job) => {
                    const deadlineDate = job.applicationDeadline || job.expiresAt;
                    const isExpired = deadlineDate && new Date(deadlineDate) < new Date();

                    return (
                      <tr key={job._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-medium">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-bold text-brand-black hover:text-brand-green-dark hover:underline block"
                          >
                            {job.title}
                          </Link>
                          <span className="text-xs text-brand-grey mt-0.5 inline-block capitalize">
                            {job.category?.name || "Agriculture"} · {job.employmentType?.replace(/-/g, " ")}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-brand-grey font-medium">{job.views || 0}</td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${
                              statusColors[job.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-brand-grey">
                          {deadlineDate ? (
                            <span
                              className={`inline-flex items-center gap-1 font-medium ${
                                isExpired ? "text-amber-800 font-bold" : "text-gray-700"
                              }`}
                            >
                              <Clock size={12} className={isExpired ? "text-amber-700" : "text-gray-400"} />
                              {new Date(deadlineDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              {isExpired && <span className="text-[10px] text-amber-700 font-bold">(Passed)</span>}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">No deadline</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <Link
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Users size={13} /> View Applicants
                          </Link>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/employer/post-job?edit=${job._id}`}
                              className="text-xs font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                              title="Edit Job"
                            >
                              <Edit3 size={13} /> Edit
                            </Link>

                            <button
                              type="button"
                              disabled={deletingId === job._id}
                              onClick={() => handleDeleteJob(job)}
                              className="text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2.5 py-1.5 rounded-lg border border-red-200 hover:border-red-600 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Delete Job"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Critical Action Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        subtitle={confirmConfig.subtitle}
        message={confirmConfig.message}
        itemName={confirmConfig.itemName}
        itemType={confirmConfig.itemType}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        variant={confirmConfig.variant}
        loading={confirmConfig.loading}
        onConfirm={confirmConfig.onConfirm}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default EmployerDashboard;
