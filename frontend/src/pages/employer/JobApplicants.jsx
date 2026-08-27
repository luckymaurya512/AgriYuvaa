import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchApplicationsForJob, updateApplicationStatus } from "../../services/jobService.js";

const statusOptions = ["applied", "viewed", "shortlisted", "rejected", "hired"];

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchApplicationsForJob(jobId).then(setApplications).catch(() => setApplications([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [jobId]);

  const handleStatusChange = async (id, status) => {
    await updateApplicationStatus(id, status);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Applicants</h1>
      <p className="text-sm text-brand-grey mb-8">Review and manage candidates for this role</p>

      {loading ? (
        <p className="text-sm text-brand-grey">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-brand-grey">No applications yet for this job.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{app.seeker?.name}</p>
                <p className="text-xs text-brand-grey">{app.seeker?.email} · {app.seeker?.phone}</p>
                {app.coverNote && <p className="text-sm text-brand-grey mt-2 max-w-md">{app.coverNote}</p>}
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-green-dark font-semibold mt-2 inline-block hover:underline">
                  View Resume
                </a>
              </div>
              <select
                className="input-field text-sm w-40"
                value={app.status}
                onChange={(e) => handleStatusChange(app._id, e.target.value)}
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
