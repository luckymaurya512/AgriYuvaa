import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { fetchPlatformStats, fetchPendingEmployers, verifyEmployer, fetchPendingJobs, reviewJob } from "../../services/adminService.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchPendingEmployers().then(setPendingEmployers).catch(() => {});
    fetchPendingJobs().then(setPendingJobs).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const handleEmployerDecision = async (id, decision) => {
    await verifyEmployer(id, decision);
    loadAll();
  };

  const handleJobDecision = async (id, decision) => {
    await reviewJob(id, decision, decision === "rejected" ? "Did not meet posting guidelines" : undefined);
    loadAll();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-brand-grey">Review employer verifications and job approvals</p>
        </div>

        <Link
          to="/employer/post-job"
          className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4 shadow-sm"
        >
          <PlusCircle size={16} /> Post Direct Job / Hiring Alert
        </Link>
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
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">
            Pending Employer Verifications ({pendingEmployers.length})
          </div>
          <div className="divide-y divide-brand-border">
            {pendingEmployers.length === 0 && <p className="p-5 text-sm text-brand-grey">Nothing pending.</p>}
            {pendingEmployers.map((emp) => (
              <div key={emp._id} className="p-5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{emp.companyName}</p>
                  <p className="text-xs text-brand-grey">{emp.user?.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEmployerDecision(emp._id, "approved")} className="text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded-lg">Approve</button>
                  <button onClick={() => handleEmployerDecision(emp._id, "rejected")} className="text-xs font-semibold bg-brand-black text-white px-3 py-1.5 rounded-lg">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">
            Pending Job Approvals ({pendingJobs.length})
          </div>
          <div className="divide-y divide-brand-border">
            {pendingJobs.length === 0 && <p className="p-5 text-sm text-brand-grey">Nothing pending.</p>}
            {pendingJobs.map((job) => (
              <div key={job._id} className="p-5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-brand-grey">{job.employer?.name} · {job.location}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleJobDecision(job._id, "approved")} className="text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded-lg">Approve</button>
                  <button onClick={() => handleJobDecision(job._id, "rejected")} className="text-xs font-semibold bg-brand-black text-white px-3 py-1.5 rounded-lg">Reject</button>
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
