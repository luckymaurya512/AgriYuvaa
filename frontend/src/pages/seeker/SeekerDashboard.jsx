import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyApplications } from "../../services/jobService.js";

const statusColors = {
  applied: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-brand-green-light text-brand-green-dark",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-green-100 text-green-700",
};

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="text-sm text-brand-grey mb-8">Track your applications and discover new opportunities</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Applications Sent</p>
          <p className="text-3xl font-display font-bold mt-2">{applications.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Shortlisted</p>
          <p className="text-3xl font-display font-bold mt-2">
            {applications.filter((a) => a.status === "shortlisted").length}
          </p>
        </div>
        <Link
          to="/resume-builder"
          className="card p-5 flex flex-col justify-center bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-900 group transition-all"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Resume Builder</p>
          <p className="font-semibold text-sm mt-1 text-emerald-950 group-hover:underline">Build / Print CV 📄</p>
        </Link>
        <Link to="/jobs" className="card p-5 flex flex-col justify-center items-center bg-brand-black text-white hover:bg-black/80">
          <p className="font-semibold text-sm">Browse New Jobs →</p>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">My Applications</div>
        {loading ? (
          <p className="p-5 text-sm text-brand-grey">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="p-5 text-sm text-brand-grey">You haven't applied to any jobs yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
              <tr>
                <th className="text-left px-5 py-3">Job</th>
                <th className="text-left px-5 py-3">Employer</th>
                <th className="text-left px-5 py-3">Applied On</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t border-brand-border">
                  <td className="px-5 py-3">
                    <Link to={`/jobs/${app.job?._id}`} className="font-medium hover:text-brand-green-dark">
                      {app.job?.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-grey">{app.job?.employer?.name}</td>
                  <td className="px-5 py-3 text-brand-grey">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
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

export default SeekerDashboard;
