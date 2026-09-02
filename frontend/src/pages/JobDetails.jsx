import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Share2,
  CheckCircle2,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Info,
  Bookmark,
  Zap,
  Star,
  Bell,
  UploadCloud,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { fetchJobById, applyToJob, fetchMyApplications, fetchJobs } from "../services/jobService.js";
import { fetchSeekerProfile, toggleSaveJob, uploadSeekerResume } from "../services/userService.js";
import { toggleFollowEmployer, enablePushNotifications } from "../services/notificationService.js";
import { useAuth } from "../context/AuthContext.jsx";
import JobCard from "../components/JobCard.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "link"
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [applied, setApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Bookmark / Save state
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Follow Employer state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then((fetchedJob) => {
        setJob(fetchedJob);
        if (user?.role === "seeker") {
          // 1. Check if seeker has already applied for this job
          fetchMyApplications()
            .then((apps) => {
              const matched = (apps || []).find((a) => (a.job?._id || a.job)?.toString() === id);
              if (matched) {
                setApplied(true);
                setExistingApplication(matched);
              }
            })
            .catch(() => {});

          // 2. Fetch seeker profile for saved jobs, follow status & resume
          if (fetchedJob?.employer) {
            const empId = fetchedJob.employer._id || fetchedJob.employer;
            fetchSeekerProfile()
              .then((profile) => {
                if (profile?.savedJobs) {
                  const saved = profile.savedJobs.some((j) => (j._id || j).toString() === id);
                  setIsSaved(saved);
                }
                if (profile?.followedEmployers) {
                  const following = profile.followedEmployers.some((e) => {
                    const eId = (e._id || e)?.toString();
                    const eUserId = (e.user?._id || e.user)?.toString();
                    const target = empId.toString();
                    return eId === target || (eUserId && eUserId === target);
                  });
                  setIsFollowing(following);
                }
                if (profile?.resumeUrl) {
                  setResumeUrl(profile.resumeUrl);
                  setUploadedFileName("Profile Resume (Ready)");
                }
              })
              .catch(() => {});
          }
        }

        // 3. Fetch similar agriculture jobs in the same category or location
        const catId = fetchedJob?.category?._id || fetchedJob?.category;
        fetchJobs(catId ? { category: catId, limit: 6 } : { limit: 6 })
          .then((data) => {
            const list = (data.jobs || data || []).filter(
              (j) => (j._id || j)?.toString() !== id.toString()
            );
            setSimilarJobs(list.slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => setError("This job could not be found."))
      .finally(() => setLoading(false));
  }, [id, user]);

  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB. Please choose a smaller PDF or document.");
      return;
    }

    setUploadingResume(true);
    setError("");
    try {
      const res = await uploadSeekerResume(file);
      setResumeUrl(res.url);
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume file. Please select a valid PDF or DOCX file.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
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
    processFile(file);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    let formattedUrl = (resumeUrl || "").trim();
    if (!formattedUrl) {
      setError("Please provide your resume URL.");
      return;
    }
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    if (!formattedUrl.includes(".") || formattedUrl.length < 8) {
      setError("Please enter a valid resume link (e.g., https://drive.google.com/file/... or Dropbox link)");
      return;
    }
    try {
      await applyToJob(id, { resumeUrl: formattedUrl, coverNote });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application");
    }
  };

  const handleToggleBookmark = async () => {
    if (!user || user.role !== "seeker") {
      alert("Please log in as a Job Seeker to bookmark jobs.");
      return;
    }
    setSavingBookmark(true);
    try {
      const res = await toggleSaveJob(id);
      setIsSaved(res.isSaved);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!user || user.role !== "seeker") {
      alert("Please log in as a Job Seeker to follow employers and get job alerts.");
      return;
    }
    const empId = job?.employer?._id || job?.employer;
    if (!empId) return;

    setFollowingLoading(true);
    try {
      const res = await toggleFollowEmployer(empId);
      setIsFollowing(res.isFollowing);
      if (res.isFollowing) {
        // Automatically ask for push notifications if not already enabled
        enablePushNotifications().catch(() => {});
        alert(`🔔 You are now following ${companyDisplayName}! You will receive instant push & email alerts when they post new jobs.`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowingLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === "subject") {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === "share") {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (loading) return <div className="py-24 text-center text-brand-grey">Loading job...</div>;
  if (!job) return <div className="py-24 text-center text-brand-grey">{error || "Job not found."}</div>;

  const companyDisplayName = job.companyName || job.employer?.name || "Hiring Company";
  const defaultEmailSubject =
    job.applyEmailSubject || `Application for ${job.title} - ${user?.name || "Applicant"}`;

  const emailBody = `Dear HR,\n\nPlease find attached my resume for the ${job.title} position at ${companyDisplayName}.\n\nName: ${
    user?.name || ""
  }\nEmail: ${user?.email || ""}\n\nBest regards,\n${user?.name || ""}`;

  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    job.applyEmail || ""
  )}&su=${encodeURIComponent(defaultEmailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const mailtoLink = `mailto:${job.applyEmail}?subject=${encodeURIComponent(
    defaultEmailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
      {/* Left Column: Job Info */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                <Star size={13} fill="currentColor" /> Featured
              </span>
            )}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-md animate-pulse">
                <Zap size={13} fill="currentColor" /> Urgent Hiring
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold text-brand-black/90 flex items-center gap-1.5">
              <Building2 size={18} className="text-brand-green" /> {companyDisplayName}
            </p>

            {user?.role === "seeker" && (
              <button
                type="button"
                onClick={handleToggleFollow}
                disabled={followingLoading}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  isFollowing
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-white text-gray-700 border-gray-300 hover:border-emerald-500 hover:text-emerald-800"
                }`}
                title={isFollowing ? "You follow this employer" : "Follow to get push alerts when they post jobs"}
              >
                <Bell size={12} fill={isFollowing ? "currentColor" : "none"} />
                {followingLoading ? "..." : isFollowing ? "Following ✓" : "Follow Employer"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-brand-grey mt-4">
            <span className="inline-flex items-center gap-1">
              <MapPin size={16} className="text-brand-green" /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase size={16} className="text-brand-green" /> {job.employmentType}
            </span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="inline-flex items-center gap-1">
                <IndianRupee size={16} className="text-brand-green" />
                {job.salaryMin && job.salaryMax
                  ? `₹${job.salaryMin.toLocaleString("en-IN")} - ₹${job.salaryMax.toLocaleString("en-IN")}`
                  : `₹${(job.salaryMin || job.salaryMax).toLocaleString("en-IN")}+`}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar size={16} className="text-brand-green" /> Posted{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-3">Job Description</h2>
          <p className="text-sm text-brand-grey whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {job.responsibilities?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Column: Application Card */}
      <div className="space-y-4">
        <div className="card p-6 sticky top-24">
          {/* ── CASE 1: DIRECT HR EMAIL APPLICATION ── */}
          {job.applyType === "email" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base leading-tight">Apply via HR Email</h2>
                  <p className="text-xs text-brand-grey">Direct submission to company HR</p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                  <Info size={14} /> Instructions:
                </p>
                <p className="leading-relaxed">
                  {job.applyEmailInstructions ||
                    "Please send your updated resume directly to the HR contact below with the specified subject line."}
                </p>
              </div>

              {/* HR Email Copy Box */}
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                  HR Email Address
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    readOnly
                    value={job.applyEmail || ""}
                    className="input-field text-sm font-medium bg-gray-50 flex-1 cursor-text select-all"
                  />
                  <button
                    onClick={() => handleCopy(job.applyEmail, "email")}
                    className="btn-secondary text-xs px-3 py-2.5 shrink-0 flex items-center gap-1"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={14} className="text-brand-green" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Subject Line Copy Box */}
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                  Recommended Subject Line
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    readOnly
                    value={defaultEmailSubject}
                    className="input-field text-xs bg-gray-50 flex-1 cursor-text select-all"
                  />
                  <button
                    onClick={() => handleCopy(defaultEmailSubject, "subject")}
                    className="btn-secondary text-xs px-3 py-2.5 shrink-0 flex items-center gap-1"
                    title="Copy Subject"
                  >
                    {copiedSubject ? (
                      <>
                        <Check size={14} className="text-brand-green" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Web Gmail + Default App */}
              <div className="space-y-2 pt-1">
                <a
                  href={gmailWebLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 py-2.5"
                >
                  <Mail size={16} /> Compose in Gmail (Web) ↗
                </a>

                <a
                  href={mailtoLink}
                  className="btn-secondary w-full text-center flex items-center justify-center gap-2 py-2 text-xs text-brand-grey hover:text-brand-black"
                >
                  Open in Default Mail App (Outlook/Apple)
                </a>
              </div>
            </div>
          ) : /* ── CASE 2: COMPANY WEBSITE LINK ── */
          job.applyType === "external_link" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <ExternalLink size={18} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base leading-tight">
                    Apply on Company Website
                  </h2>
                  <p className="text-xs text-brand-grey">External Application</p>
                </div>
              </div>

              <p className="text-xs text-brand-grey leading-relaxed">
                {companyDisplayName} accepts applications directly on their official careers portal. Click below to continue your application.
              </p>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3"
              >
                Apply on Company Site <ExternalLink size={16} />
              </a>

              <p className="text-[11px] text-brand-grey text-center">
                You will be redirected to <span className="font-medium text-brand-black">{new URL(job.applyUrl || "https://example.com").hostname}</span>
              </p>
            </div>
          ) : (
            /* ── CASE 3: IN-PLATFORM APPLICATION (DEFAULT) ── */
            <div>
              <h2 className="font-display font-semibold mb-4">Apply for this role</h2>

              {!user ? (
                <div className="text-sm text-brand-grey">
                  <Link to="/login" className="text-brand-green-dark font-semibold">
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link to="/register" className="text-brand-green-dark font-semibold">
                    create an account
                  </Link>{" "}
                  to apply.
                </div>
              ) : user.role !== "seeker" ? (
                <p className="text-sm text-brand-grey">Only job seeker accounts can apply to jobs.</p>
              ) : applied ? (
                <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-emerald-950">
                        Application Submitted
                      </h3>
                      <p className="text-xs text-emerald-800/90 mt-0.5">
                        You have already applied for this position.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Application Status:</span>
                      <span className="font-bold capitalize px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        {existingApplication?.status || "Applied"}
                      </span>
                    </div>
                    {existingApplication?.createdAt && (
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Submitted On:</span>
                        <span className="text-gray-600 font-medium">
                          {new Date(existingApplication.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/seeker"
                    className="btn-primary w-full text-center py-2.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    Track in Seeker Dashboard →
                  </Link>

                  {/* 🌾 Similar Jobs Mini Recommendations */}
                  {similarJobs.length > 0 && (
                    <div className="pt-3 border-t border-emerald-200 space-y-2.5">
                      <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        🌾 Similar Agriculture Openings:
                      </p>
                      <div className="space-y-2">
                        {similarJobs.map((simJob) => (
                          <Link
                            key={simJob._id}
                            to={`/jobs/${simJob._id}`}
                            className="p-2.5 bg-white rounded-xl border border-emerald-100 hover:border-emerald-400 flex items-start justify-between gap-2 transition-all block group shadow-2xs"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-brand-black group-hover:text-brand-green-dark truncate">
                                {simJob.title}
                              </p>
                              <p className="text-[11px] text-brand-grey truncate">
                                {simJob.companyName || simJob.employer?.name} · {simJob.location}
                              </p>
                            </div>
                            <span className="text-[11px] font-bold text-brand-green-dark shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                              View →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wide">
                        Your Resume *
                      </label>
                      <Link
                        to="/resume-builder"
                        target="_blank"
                        className="text-[11px] font-bold text-brand-green-dark hover:underline"
                      >
                        Build CV here ↗
                      </Link>
                    </div>

                    {/* Dual Mode Switcher */}
                    <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl mb-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setResumeMode("upload")}
                        className={`py-1.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          resumeMode === "upload"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-gray-600 hover:text-brand-black"
                        }`}
                      >
                        <UploadCloud size={13} /> Upload File (PDF)
                      </button>
                      <button
                        type="button"
                        onClick={() => setResumeMode("link")}
                        className={`py-1.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          resumeMode === "link"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-gray-600 hover:text-brand-black"
                        }`}
                      >
                        <ExternalLink size={13} /> Paste Link
                      </button>
                    </div>

                    {/* Mode 1: Direct File Upload */}
                    {resumeMode === "upload" ? (
                      <div>
                        {resumeUrl && uploadedFileName ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText size={18} className="text-emerald-700 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-emerald-950 truncate">
                                  {uploadedFileName}
                                </p>
                                <span className="text-[10px] text-emerald-700">✓ Ready to submit</span>
                              </div>
                            </div>
                            <label className="text-[11px] font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 px-2.5 py-1 rounded-lg cursor-pointer shrink-0">
                              Change
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileUpload}
                              />
                            </label>
                          </div>
                        ) : (
                          <label
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              isDragging
                                ? "border-emerald-600 bg-emerald-100/70 scale-[1.02] shadow-sm"
                                : "border-gray-300 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/30"
                            }`}
                          >
                            {uploadingResume ? (
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 py-2">
                                <Loader2 size={18} className="animate-spin text-emerald-600" /> Uploading resume...
                              </div>
                            ) : isDragging ? (
                              <div className="flex flex-col items-center gap-1 text-emerald-800 py-1 animate-bounce">
                                <UploadCloud size={28} className="text-emerald-600" />
                                <p className="text-xs font-bold">Drop resume file here to upload</p>
                              </div>
                            ) : (
                              <>
                                <UploadCloud size={24} className="text-gray-400" />
                                <p className="text-xs font-bold text-brand-black text-center">
                                  Click to browse or drag & drop resume
                                </p>
                                <p className="text-[10px] text-gray-500 text-center">
                                  PDF, DOCX, or DOC (Max 10MB)
                                </p>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              disabled={uploadingResume}
                              onChange={handleFileUpload}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      /* Mode 2: Paste URL */
                      <div>
                        <input
                          required
                          className="input-field text-sm"
                          placeholder="e.g. https://drive.google.com/file/d/..."
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                        />
                        <p className="text-[11px] text-brand-grey mt-1">
                          Ensure link access is set to "Anyone with the link".
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-grey uppercase tracking-wide">
                      Cover Note (optional)
                    </label>
                    <textarea
                      className="input-field mt-1 text-sm"
                      rows={3}
                      placeholder="Brief note to the hiring manager..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={uploadingResume || !resumeUrl}
                    className="btn-primary w-full py-3 text-sm font-bold shadow-sm disabled:opacity-50"
                  >
                    {uploadingResume ? "Uploading Resume..." : "Submit Application 🚀"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Action Row: WhatsApp Share + Bookmark + Copy */}
          <div className="space-y-2 mt-4 pt-3 border-t border-brand-border">
            {/* 📲 Primary WhatsApp Share Button */}
            <button
              type="button"
              onClick={() => {
                const salaryInfo =
                  job.salaryMin || job.salaryMax
                    ? `\n💰 *Salary:* ${
                        job.salaryMin && job.salaryMax
                          ? `₹${job.salaryMin.toLocaleString("en-IN")} - ₹${job.salaryMax.toLocaleString("en-IN")}`
                          : `₹${(job.salaryMin || job.salaryMax).toLocaleString("en-IN")}+`
                      }`
                    : "";
                const company = companyDisplayName;
                const text = `🌾 *Agriculture Hiring Alert on AgriYuvaa*:\n\n📌 *${job.title}*\n🏢 *Company:* ${company}\n📍 *Location:* ${job.location || "India"}\n💼 *Type:* ${job.employmentType || "Full-time"}${salaryInfo}\n\n👉 *View & Apply:* ${window.location.href}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <WhatsAppIcon size={16} /> Share on WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-2">
              {user?.role === "seeker" && (
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  disabled={savingBookmark}
                  className={`btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 ${
                    isSaved ? "bg-emerald-50 border-emerald-300 text-emerald-800" : ""
                  }`}
                >
                  <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Job"}
                </button>
              )}

              <button
                onClick={() => handleCopy(window.location.href, "share")}
                className={`btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 ${
                  user?.role !== "seeker" ? "col-span-2" : ""
                }`}
              >
                {copiedShare ? (
                  <>
                    <Check size={14} className="text-brand-green" /> Link Copied
                  </>
                ) : (
                  <>
                    <Share2 size={14} /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌾 Bottom Section: Similar Agriculture Jobs You May Like */}
      {similarJobs.length > 0 && (
        <div className="md:col-span-3 pt-10 mt-6 border-t border-brand-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-brand-black flex items-center gap-2">
                <span>🌾</span> Similar Agriculture Jobs You May Like
              </h2>
              <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
                Explore more verified openings in {job.category?.name || "Agriculture & Agribusiness"}.
              </p>
            </div>
            <Link
              to={`/jobs?category=${job.category?._id || ""}`}
              className="text-xs sm:text-sm font-bold text-brand-green-dark hover:underline flex items-center gap-1"
            >
              Explore all openings <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob._id} job={simJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
