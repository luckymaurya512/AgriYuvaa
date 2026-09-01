import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, FileSpreadsheet, ArrowLeft, ExternalLink, Mail, Phone, Calendar } from "lucide-react";
import { fetchApplicationsForJob, updateApplicationStatus, fetchJobById } from "../../services/jobService.js";

const statusOptions = ["applied", "viewed", "shortlisted", "rejected", "hired"];

const statusBadgeStyles = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  viewed: "bg-yellow-50 text-yellow-800 border-yellow-200",
  shortlisted: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
  rejected: "bg-red-50 text-red-700 border-red-200",
  hired: "bg-green-50 text-green-800 border-green-300 font-bold",
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const load = async () => {
    try {
      const [jobData, apps] = await Promise.all([
        fetchJobById(jobId).catch(() => null),
        fetchApplicationsForJob(jobId).catch(() => []),
      ]);
      setJob(jobData);
      setApplications(apps || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      if (["shortlisted", "hired", "rejected"].includes(status)) {
        setToastMessage(`Status updated to ${status}. Email notification sent to candidate! ✉️`);
        setTimeout(() => setToastMessage(""), 4000);
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (!applications || applications.length === 0) {
      alert("No applicants to export.");
      return;
    }

    const headers = [
      "Applicant Name",
      "Email Address",
      "Phone Number",
      "Applied Date",
      "Application Status",
      "Resume URL",
      "Cover Note",
    ];

    const rows = applications.map((app) => [
      `"${(app.seeker?.name || "N/A").replace(/"/g, '""')}"`,
      `"${(app.seeker?.email || "N/A").replace(/"/g, '""')}"`,
      `"${(app.seeker?.phone || "N/A").replace(/"/g, '""')}"`,
      `"${new Date(app.createdAt).toLocaleDateString("en-IN")}"`,
      `"${app.status || "applied"}"`,
      `"${(app.resumeUrl || "N/A").replace(/"/g, '""')}"`,
      `"${(app.coverNote || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = (job?.title || "Job").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.setAttribute("href", url);
    link.setAttribute("download", `applicants_${safeTitle}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-grey hover:text-brand-black mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">
            Applicants for {job?.title || "Job Posting"}
          </h1>
          <p className="text-sm text-brand-grey">
            {applications.length} candidate{applications.length === 1 ? "" : "s"} applied
          </p>
        </div>

        {applications.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 shadow-xs"
            title="Download all applicants as an Excel CSV sheet"
          >
            <FileSpreadsheet size={16} className="text-brand-green" /> Export to CSV / Excel
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {toastMessage}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-brand-grey">Loading candidates...</p>
      ) : applications.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <p className="text-sm font-medium text-brand-black">No applications yet for this job.</p>
          <p className="text-xs text-brand-grey">Candidates who apply will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="card p-6 flex flex-wrap md:flex-nowrap items-start justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-bold text-base text-brand-black">
                    {app.seeker?.name || "Candidate"}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border capitalize ${
                      statusBadgeStyles[app.status] || "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-brand-grey">
                  {app.seeker?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-brand-green" /> {app.seeker.email}
                    </span>
                  )}
                  {app.seeker?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-brand-green" /> {app.seeker.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-brand-green" /> Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>

                {app.coverNote && (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-100">
                    <span className="font-semibold text-gray-900 block mb-1">Cover Note:</span>
                    {app.coverNote}
                  </div>
                )}

                {app.resumeUrl ? (
                  (() => {
                    const raw = app.resumeUrl.trim();
                    const isValidWebUrl = raw.includes(".") && raw.length >= 6;
                    const fullUrl = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

                    if (!isValidWebUrl) {
                      return (
                        <div className="flex items-center gap-2 pt-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                          <span>⚠️ Test link/text submitted: <strong>"{raw}"</strong></span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3 pt-1">
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Download size={13} /> View / Download Resume <ExternalLink size={11} />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fullUrl);
                            alert("Resume link copied to clipboard!");
                          }}
                          className="text-xs text-brand-grey hover:text-brand-black underline"
                        >
                          Copy Link
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-xs text-brand-grey italic">No resume link provided</span>
                )}
              </div>

              {/* Status Updater */}
              <div className="w-full md:w-auto shrink-0 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brand-grey block">
                  Update Status
                </label>
                <select
                  disabled={updatingId === app._id}
                  className="input-field text-xs font-semibold w-full md:w-44 bg-white"
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-brand-grey block">
                  Shortlist/Reject sends email alert
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
