import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Star, CheckCircle, XCircle, Landmark } from "lucide-react";
import {
  fetchPlatformStats,
  fetchPendingEmployers,
  verifyEmployer,
  fetchPendingJobs,
  reviewJob,
} from "../../services/adminService.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchPendingEmployers().then(setPendingEmployers).catch(() => {});
    fetchPendingJobs().then(setPendingJobs).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-brand-grey">Review employer verifications and job approvals</p>
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

      {stats && (
        <div className="grid md:grid-cols-4 gap-5 mb-10">
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
                </div>
              </div>
            ))}
          </div>
        </div>
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
