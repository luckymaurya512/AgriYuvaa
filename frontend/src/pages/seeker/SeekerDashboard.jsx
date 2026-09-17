import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Briefcase,
  MapPin,
  Trash2,
  ArrowRight,
  Building2,
  Bell,
  ExternalLink,
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Calendar,
  Edit3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyApplications } from "../../services/jobService.js";
import { fetchSeekerProfile, toggleSaveJob, uploadSeekerResume } from "../../services/userService.js";
import { toggleFollowEmployer } from "../../services/notificationService.js";
import JobCard from "../../components/JobCard.jsx";
import SEO from "../../components/SEO.jsx";

const statusColors = {
  applied: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-emerald-100 text-emerald-800 font-bold",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-green-100 text-green-700 font-bold",
};

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "saved" | "following" | "resume"
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [followedEmployers, setFollowedEmployers] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, profile] = await Promise.all([
        fetchMyApplications().catch(() => []),
        fetchSeekerProfile().catch(() => null),
      ]);
      setApplications(apps || []);
      setSavedJobs(profile?.savedJobs || []);
      setFollowedEmployers(profile?.followedEmployers || []);
      setResumeUrl(profile?.resumeUrl || "");
      setResumeData(profile?.resumeData || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  const processResumeFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB. Please choose a smaller PDF or document.");
      return;
    }
    setUploadingResume(true);
    try {
      const res = await uploadSeekerResume(file);
      setResumeUrl(res.url);
      alert("✅ Resume uploaded and saved to your profile successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    processResumeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    processResumeFile(file);
  };

  const handleUnfollow = async (empId) => {
    try {
      await toggleFollowEmployer(empId);
      setFollowedEmployers((prev) =>
        prev.filter((e) => {
          const eId = (e._id || e)?.toString();
          const eUserId = (e.user?._id || e.user)?.toString();
          const target = empId.toString();
          return eId !== target && (!eUserId || eUserId !== target);
        })
      );
    } catch (err) {
      console.error("Failed to unfollow employer:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full min-w-0">
      <SEO title="Job Seeker Dashboard" noindex={true} />
      <h1 className="text-2xl font-display font-bold mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-sm text-brand-grey mb-8">
        Track your job applications, saved postings, followed employers, and resume.
      </p>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Applications Sent</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-brand-black">{applications.length}</p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold">Shortlisted</p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-emerald-700">
            {applications.filter((a) => a.status === "shortlisted").length}
          </p>
        </div>
        <div
          onClick={() => setActiveTab("saved")}
          className="card p-4 sm:p-5 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold flex items-center gap-1">
            <Bookmark size={13} className="text-emerald-700" /> Saved Jobs
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-brand-black">{savedJobs.length}</p>
        </div>
        <div
          onClick={() => setActiveTab("following")}
          className="card p-4 sm:p-5 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <p className="text-[11px] sm:text-xs text-brand-grey uppercase font-semibold flex items-center gap-1 truncate">
            <Bell size={13} className="text-emerald-700 shrink-0" /> Followed Companies
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold mt-1.5 text-brand-black">{followedEmployers.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-brand-border mb-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth pb-0.5">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "applications"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          My Applications
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "saved"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          Saved Jobs
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {savedJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "following"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          Followed Companies
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {followedEmployers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("resume")}
          className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "resume"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          My Resume 📄
        </button>
      </div>

      {/* TAB 1: MY APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="card overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn-primary text-xs inline-flex py-2 px-4">
                Explore Agriculture Jobs
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card List View (Visible on screens < 768px) */}
              <div className="md:hidden divide-y divide-gray-100">
                {applications.map((app) => (
                  <div key={app._id} className="p-4 space-y-2.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="font-bold text-sm text-brand-black hover:text-brand-green-dark block leading-snug line-clamp-2"
                        >
                          {app.job?.title || "Position"}
                        </Link>
                        <p className="text-xs text-brand-grey font-medium mt-0.5">
                          {app.job?.companyName || app.job?.employer?.name || "Hiring Company"}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize shrink-0 ${
                          statusColors[app.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 text-brand-grey">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} className="text-brand-green shrink-0" />
                        Applied on {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-xs font-bold text-brand-green-dark hover:underline inline-flex items-center gap-0.5"
                      >
                        View Job →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Visible on screens >= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[650px]">
                  <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                    <tr>
                      <th className="text-left px-5 py-3.5">Job Title</th>
                      <th className="text-left px-5 py-3.5">Company</th>
                      <th className="text-left px-5 py-3.5">Applied On</th>
                      <th className="text-left px-5 py-3.5">Status</th>
                      <th className="text-right px-5 py-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-t border-brand-border hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-medium">
                          <Link
                            to={`/jobs/${app.job?._id}`}
                            className="hover:text-brand-green-dark font-semibold"
                          >
                            {app.job?.title || "Position"}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-brand-grey">
                          {app.job?.companyName || app.job?.employer?.name || "Hiring Company"}
                        </td>
                        <td className="px-5 py-3.5 text-brand-grey">
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                              statusColors[app.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/jobs/${app.job?._id}`}
                            className="text-xs font-bold text-brand-green-dark hover:underline"
                          >
                            View Job →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: SAVED JOBS */}
      {activeTab === "saved" && (
        <div>
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading saved jobs...</p>
          ) : savedJobs.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <Bookmark size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">No bookmarked jobs yet.</p>
              <p className="text-xs text-brand-grey">
                Click the bookmark icon on any job card to save it for later.
              </p>
              <Link to="/jobs" className="btn-primary text-xs inline-flex py-2 px-4 mt-2">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <div key={job._id} className="relative">
                  <JobCard
                    job={job}
                    isSavedInitial={true}
                    onBookmarkChange={(jobId, isNowSaved) => {
                      if (!isNowSaved) {
                        setSavedJobs((prev) => prev.filter((j) => (j._id || j) !== jobId));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FOLLOWED COMPANIES */}
      {activeTab === "following" && (
        <div>
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading followed companies...</p>
          ) : followedEmployers.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <Building2 size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">You are not following any employers yet.</p>
              <p className="text-xs text-brand-grey">
                Follow your favorite farms & agri-businesses on the Employers page or Job Details page to get instant push & email alerts whenever they post jobs!
              </p>
              <Link to="/employers" className="btn-primary text-xs inline-flex py-2 px-4 mt-2">
                Discover Employers
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedEmployers.map((emp) => (
                <div key={emp._id} className="card p-5 flex flex-col justify-between border border-brand-border space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                      {emp.companyName ? emp.companyName[0] : "E"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-brand-black truncate">{emp.companyName}</h3>
                      <p className="text-xs text-brand-grey">{emp.sector || "Agriculture"}</p>
                      {emp.location && (
                        <p className="text-xs text-brand-grey flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-brand-green" /> {emp.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleUnfollow(emp._id)}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium"
                    >
                      Unfollow
                    </button>
                    <Link
                      to={`/jobs?keyword=${encodeURIComponent(emp.companyName)}`}
                      className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1"
                    >
                      View Jobs →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY RESUME */}
      {activeTab === "resume" && (
        <div className="card p-4 sm:p-6 md:p-8 space-y-6 w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
            <div>
              <h2 className="text-lg font-bold font-display text-brand-black">Your Agriculture Resume</h2>
              <p className="text-xs text-brand-grey mt-0.5">
                Upload your master CV or design one using our Agriculture Resume Builder.
              </p>
            </div>
            <Link
              to="/resume-builder"
              className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 shrink-0"
            >
              Launch Resume Builder 📄
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
            {/* Upload Box */}
            <div className="space-y-3 w-full min-w-0">
              <label className="text-xs font-bold text-brand-grey uppercase tracking-wide">
                Upload / Update PDF Resume
              </label>

              <label
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all w-full min-w-0 overflow-hidden ${
                  isDragging
                    ? "border-emerald-600 bg-emerald-100/70 scale-[1.02] shadow-sm"
                    : "border-gray-300 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/30"
                }`}
              >
                {uploadingResume ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 py-4">
                    <Loader2 size={20} className="animate-spin text-emerald-600" /> Uploading resume...
                  </div>
                ) : isDragging ? (
                  <div className="flex flex-col items-center gap-1 text-emerald-800 py-3 animate-bounce">
                    <UploadCloud size={32} className="text-emerald-600" />
                    <p className="text-sm font-bold">Drop resume file here to upload</p>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-bold text-brand-black text-center">
                      Click to upload or drag & drop resume
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      PDF, DOCX, or DOC (Max 10MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  disabled={uploadingResume}
                  onChange={handleResumeUpload}
                />
              </label>
            </div>

            {/* Current Resume Preview / Status */}
            <div className="space-y-3 flex flex-col justify-between w-full min-w-0">
              <label className="text-xs font-bold text-brand-grey uppercase tracking-wide">
                Active Resume on Profile
              </label>

              {resumeData || resumeUrl ? (
                <div className="space-y-3 flex-1 flex flex-col justify-between w-full min-w-0">
                  {/* Case 1: Created with Resume Builder */}
                  {resumeData && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-4 flex-1 flex flex-col justify-between w-full min-w-0 overflow-hidden shadow-2xs">
                      <div className="flex items-start gap-3 min-w-0 w-full">
                        <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-bold text-emerald-950 truncate">
                              {resumeData.fullName || user?.name || "Agriculture Resume"}
                            </p>
                            <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                              Builder Resume
                            </span>
                          </div>
                          <p className="text-xs text-emerald-800/90 font-medium truncate mt-0.5">
                            {resumeData.title || "Agriculture Professional"}
                          </p>
                          {resumeData.updatedAt && (
                            <p className="text-[11px] text-emerald-700/70 mt-1">
                              Last saved:{" "}
                              {new Date(resumeData.updatedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-emerald-200/80 w-full min-w-0">
                        <Link
                          to="/resume-builder"
                          className="btn-primary text-xs py-2 px-3 flex-1 text-center font-bold flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
                        >
                          <Edit3 size={13} /> Edit in Builder
                        </Link>
                        <Link
                          to="/resume-builder"
                          className="btn-secondary text-xs py-2 px-3 flex-1 text-center bg-white font-semibold border border-emerald-300 hover:bg-emerald-100/50 rounded-xl"
                        >
                          View / Download 📥
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Case 2: Uploaded Document */}
                  {resumeUrl && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 flex-1 flex flex-col justify-between w-full min-w-0 overflow-hidden">
                      <div className="flex items-start gap-3 min-w-0 w-full">
                        <div className="h-10 w-10 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-emerald-950 flex items-center gap-1 truncate">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Uploaded Document
                          </p>
                          <p className="text-[11px] text-emerald-800/80 truncate mt-0.5 w-full block" title={resumeUrl}>
                            {resumeUrl.split("/").pop() || "Active Resume.pdf"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-emerald-200 w-full min-w-0">
                        <a
                          href={(() => {
                            const backendBase = (
                              import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
                            ).replace(/\/api\/?$/, "");
                            let target = (resumeUrl || "").trim().replace(/^https?:\/\/\/+/, "/");
                            if (target.startsWith("/uploads/")) return `${backendBase}${target}`;
                            if (target.startsWith("http://") || target.startsWith("https://")) return target;
                            return `https://${target}`;
                          })()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-xs py-2.5 px-3 flex-1 text-center bg-white font-semibold"
                        >
                          View / Download File 📥
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-gray-50 border border-brand-border text-center space-y-2 flex-1 flex flex-col items-center justify-center w-full min-w-0">
                  <FileText size={28} className="text-gray-300" />
                  <p className="text-xs text-brand-grey font-semibold">No resume uploaded yet.</p>
                  <p className="text-[11px] text-gray-400">
                    Upload a file on the left or create one using the builder.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
