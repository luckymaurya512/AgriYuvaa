import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchMyJobs } from "../../services/jobService.js";

const statusColors = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-brand-green-light text-brand-green-dark",
  rejected: "bg-red-100 text-red-700",
  closed: "bg-gray-200 text-gray-600",
  expired: "bg-gray-200 text-gray-600",
};

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs().then(setJobs).catch(() => setJobs([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Employer Dashboard</h1>
          <p className="text-sm text-brand-grey">Manage your job listings and applicants</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary">
          <Plus size={16} /> Post a Job
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Total Jobs</p>
          <p className="text-3xl font-display font-bold mt-2">{jobs.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Approved</p>
          <p className="text-3xl font-display font-bold mt-2">{jobs.filter((j) => j.status === "approved").length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Pending Review</p>
          <p className="text-3xl font-display font-bold mt-2">{jobs.filter((j) => j.status === "pending").length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Total Views</p>
          <p className="text-3xl font-display font-bold mt-2">{jobs.reduce((sum, j) => sum + (j.views || 0), 0)}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">My Job Listings</div>
        {loading ? (
          <p className="p-5 text-sm text-brand-grey">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="p-5 text-sm text-brand-grey">You haven't posted any jobs yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Views</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Applicants</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium">
                    <Link to={`/jobs/${job._id}`} className="hover:text-brand-green-dark hover:underline">
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-grey">{job.category?.name}</td>
                  <td className="px-5 py-3 text-brand-grey">{job.views}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link to={`/employer/jobs/${job._id}/applicants`} className="text-brand-green-dark font-semibold hover:underline">
                      View
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/employer/post-job?edit=${job._id}`}
                      className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                    >
                      ✏️ Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
