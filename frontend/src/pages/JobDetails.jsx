import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Edit3,
  Trash2,
  Clock,
  Award,
  Lock,
  LogIn,
} from "lucide-react";
import { fetchJobById, applyToJob, fetchMyApplications, fetchJobs, deleteJob } from "../services/jobService.js";
import { toggleJobFeatured } from "../services/adminService.js";
import { fetchSeekerProfile, fetchUserProfile, toggleSaveJob, uploadSeekerResume } from "../services/userService.js";
import { getActiveResume } from "../utils/resumeUtils.js";
import { toggleFollowEmployer, enablePushNotifications } from "../services/notificationService.js";
import { useAuth } from "../context/AuthContext.jsx";
import JobCard from "../components/JobCard.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import RichTextRenderer from "../components/common/RichTextRenderer.jsx";
import SEO from "../components/SEO.jsx";

const formatEmploymentType = (type) => {
  if (!type) return "Full-time";
  if (type === "work-from-home") return "Work From Home";
  if (type === "full-time") return "Full-time";
  if (type === "part-time") return "Part-time";
  if (type === "internship") return "Internship";
  return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
};

const formatExperience = (lvl) => {
  if (!lvl || lvl === "any" || lvl === "0-1" || lvl === "0-1 years" || lvl === "entry") return "0-1 Years (Fresher)";
  if (lvl === "1-2" || lvl === "1-2 years") return "1-2 Years";
  if (lvl === "2-3" || lvl === "2-3 years") return "2-3 Years";
  if (lvl === "3-5" || lvl === "3-5 years" || lvl === "mid") return "3-5 Years";
  if (lvl === "5+" || lvl === "5+ years" || lvl === "senior") return "5+ Years";
  return `${lvl} Years`;
};

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "link"
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [activeResumeInfo, setActiveResumeInfo] = useState(null);
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
  const [copiedCc, setCopiedCc] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then((fetchedJob) => {
        setJob(fetchedJob);
        if (user) {
          // 1. Check if user has already applied for this job
          fetchMyApplications()
            .then((apps) => {
              const matched = (apps || []).find((a) => (a.job?._id || a.job)?.toString() === id);
              if (matched) {
                setApplied(true);
                setExistingApplication(matched);
              }
            })
            .catch(() => {});

          // 2. Fetch profile to get saved jobs, follow status & single active resume (last edited/uploaded)
          fetchUserProfile()
            .then((data) => {
              const profile = data?.profile;
              if (profile?.savedJobs) {
                const saved = profile.savedJobs.some((j) => (j._id || j).toString() === id);
                setIsSaved(saved);
              }
              if (fetchedJob?.employer && profile?.followedEmployers) {
                const empId = fetchedJob.employer._id || fetchedJob.employer;
                const following = profile.followedEmployers.some((e) => {
                  const eId = (e._id || e)?.toString();
                  const eUserId = (e.user?._id || e.user)?.toString();
                  const target = empId.toString();
                  return eId === target || (eUserId && eUserId === target);
                });
                setIsFollowing(following);
              }

              // Determine ONE single active resume (last edited or uploaded)
              const active = getActiveResume(profile, user?.name);
              if (active) {
                setActiveResumeInfo(active);
                setResumeUrl(active.url);
                setUploadedFileName(active.title);
              }
            })
            .catch(() => {
              // Fallback for seeker profile
              if (user?.role === "seeker") {
                fetchSeekerProfile()
                  .then((p) => {
                    const active = getActiveResume(p, user?.name);
                    if (active) {
                      setActiveResumeInfo(active);
                      setResumeUrl(active.url);
                      setUploadedFileName(active.title);
                    }
                  })
                  .catch(() => {});
              }
            });
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
      const newActive = {
        type: "upload",
        title: file.name,
        subtitle: "Uploaded PDF / Document",
        url: res.url,
        originalName: file.name,
        updatedAt: new Date().toISOString(),
        badge: "Uploaded Document (Latest)",
      };
      setActiveResumeInfo(newActive);
      setResumeUrl(res.url);
      setUploadedFileName(file.name);
      setResumeMode("upload");
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
      setError("Please attach or upload your resume before applying.");
      return;
    }

    // Clean up corrupted triple slashes if present
    formattedUrl = formattedUrl.replace(/^https?:\/\/\/+/, "/");

    // If it's a relative backend uploaded path, prefix with backend server URL
    if (formattedUrl.startsWith("/uploads/")) {
      const backendBase = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
        : "https://agriyuvaa.onrender.com";
      formattedUrl = `${backendBase}${formattedUrl}`;
    } else if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
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
    } else if (type === "cc") {
      setCopiedCc(true);
      setTimeout(() => setCopiedCc(false), 2000);
    } else if (type === "subject") {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === "body") {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } else if (type === "share") {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (loading) return <div className="py-24 text-center text-brand-grey">Loading job...</div>;
  if (!job) return <div className="py-24 text-center text-brand-grey">{error || "Job not found."}</div>;

  const companyDisplayName = job.companyName || job.employer?.name || "Company";
  
  // Format subject: "Apply for the [Job Title] position at [Company] via (Agriyuvaa Job Portal)"
  let defaultEmailSubject = job.applyEmailSubject?.trim();
  if (!defaultEmailSubject) {
    defaultEmailSubject = `Apply for the ${job.title} position at ${companyDisplayName} via (Agriyuvaa Job Portal)`;
  } else if (!defaultEmailSubject.toLowerCase().includes("agriyuvaa")) {
    defaultEmailSubject = `Apply for the ${job.title} position at ${companyDisplayName} via (Agriyuvaa Job Portal)`;
  }

  const candidatePhone = user?.phone ? `\n- Phone: ${user.phone}` : "";
  const resumeRef = (job.applyType === "email" && resumeUrl)
    ? `\n- Online Resume Link: ${resumeUrl.startsWith("http") ? resumeUrl : `https://${resumeUrl}`}`
    : "";

  const currentJobUrl = typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/jobs/${job._id}`
    : `https://job.agriyuvaa.com/jobs/${job._id}`;

  const emailBody = `Dear Hiring Team at ${companyDisplayName},\n\nI am writing to apply for the "${job.title}" position at ${companyDisplayName}.\n\nPlease find attached my resume for your review and consideration.\n\nApplicant Details:\n- Name: ${user?.name || "Candidate"}\n- Email: ${user?.email || ""}${candidatePhone}${resumeRef}\n\nThank you for your time and consideration.\n\nBest regards,\n${user?.name || "Candidate"}\nApplied through Agriyuvaa job portal (${currentJobUrl})\n\n🌱 AgriYuvaa — India's Agriculture Career Platform (https://job.agriyuvaa.com)`;

  const platformCcEmail = import.meta.env.VITE_PLATFORM_CC_EMAIL || "agriyuvaa@gmail.com";

  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    job.applyEmail || ""
  )}&cc=${encodeURIComponent(platformCcEmail)}&su=${encodeURIComponent(
    defaultEmailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const mailtoLink = `mailto:${job.applyEmail}?cc=${encodeURIComponent(
    platformCcEmail
  )}&subject=${encodeURIComponent(defaultEmailSubject)}&body=${encodeURIComponent(
    emailBody
  )}`;

  const isOwner = user && (job.employer?._id === user._id || job.employer === user._id);
  const isAdmin = user && ["admin", "superadmin"].includes(user.role);
  const canEdit = isOwner || isAdmin;

  const deadlineDate = job.applicationDeadline || job.expiresAt;
  const isExpired = deadlineDate && new Date(deadlineDate) < new Date();

  const handleAdminToggleFeatured = async () => {
    try {
      const res = await toggleJobFeatured(id);
      setJob((prev) => ({ ...prev, isFeatured: res.isFeatured }));
      alert(
        res.isFeatured
          ? `⭐ "${job.title}" is now marked as FEATURED.`
          : `ℹ️ "${job.title}" featured boost removed.`
      );
    } catch (err) {
      alert("Failed to toggle featured status");
    }
  };

  const handleDeleteJob = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${job.title}"?\n\nThis will permanently remove the listing and its applicant records.`
      )
    ) {
      return;
    }
    try {
      await deleteJob(id);
      alert(`Job "${job.title}" has been removed.`);
      if (isAdmin) {
        navigate("/admin?tab=jobs");
      } else {
        navigate("/employer/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: (job.description || "").replace(/<[^>]+>/g, " ").slice(0, 500),
    datePosted: job.createdAt,
    validThrough: job.applicationDeadline || job.expiresAt,
    employmentType: job.employmentType ? job.employmentType.toUpperCase().replace("-", "_") : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: companyDisplayName,
      sameAs: job.companyWebsite || undefined,
      logo: job.companyLogo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "India",
        addressCountry: "IN",
      },
    },
    baseSalary: (job.salaryMin || job.salaryMax) ? {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin || undefined,
        maxValue: job.salaryMax || undefined,
        unitText: "YEAR",
      },
    } : undefined,
  };

  const plainDesc = (job.description || "").replace(/<[^>]+>/g, " ").trim().slice(0, 160);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 grid md:grid-cols-3 gap-8 w-full min-w-0">
      <SEO
        title={`${job.title} at ${companyDisplayName}`}
        description={plainDesc || `Apply for ${job.title} at ${companyDisplayName} in ${job.location || "India"}. Agriculture jobs on AgriYuvaa.`}
        canonical={`/jobs/${job._id || id}`}
        image={job.companyLogo}
        jsonLd={jobPostingSchema}
      />
      {/* Left Column: Job Info */}
      <div className="md:col-span-2 space-y-6 min-w-0 w-full">
        {isExpired && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
            <Clock size={18} className="text-amber-700 shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-950">Application Deadline Passed</p>
              <p className="text-[11px] text-amber-800 font-normal mt-0.5">
                The deadline for this job posting was{" "}
                <strong>
                  {new Date(deadlineDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                . This listing is now closed and no longer accepting new applications.
              </p>
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
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

            {/* Owner / Admin Quick Actions */}
            {canEdit && (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleAdminToggleFeatured}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 shadow-2xs ${
                      job.isFeatured
                        ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-amber-50 hover:text-amber-800"
                    }`}
                    title={job.isFeatured ? "Click to Remove Featured Status" : "Click to Make Featured"}
                  >
                    <Star size={12} fill={job.isFeatured ? "currentColor" : "none"} />
                    {job.isFeatured ? "Unfeature" : "Make Featured"}
                  </button>
                )}

                <Link
                  to={`/employer/post-job?edit=${job._id}`}
                  className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-3 py-1 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                >
                  <Edit3 size={13} /> Edit Job
                </Link>

                <button
                  type="button"
                  onClick={handleDeleteJob}
                  className="text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1 rounded-lg border border-red-200 hover:border-red-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
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
              <Briefcase size={16} className="text-brand-green" /> {formatEmploymentType(job.employmentType)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Award size={16} className="text-brand-green" /> {formatExperience(job.experienceLevel)}
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
            {deadlineDate && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isExpired ? "text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" : "text-amber-800"
                }`}
              >
                <Clock size={15} className={isExpired ? "text-amber-700" : "text-amber-600"} />
                {isExpired ? "Expired: " : "Deadline: "}
                {new Date(deadlineDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="font-display font-semibold mb-3">Job Description</h2>
          <RichTextRenderer content={job.description} className="text-sm text-brand-grey leading-relaxed" />
        </div>

        {job.responsibilities?.length > 0 && (
          <div className="card p-4 sm:p-6">
            <h2 className="font-display font-semibold mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <RichTextRenderer content={r} className="inline space-y-0" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="card p-4 sm:p-6">
            <h2 className="font-display font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <RichTextRenderer content={r} className="inline space-y-0" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits?.length > 0 && (
          <div className="card p-4 sm:p-6">
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
      <div className="space-y-4 min-w-0 w-full">
        <div className="card p-4 sm:p-6 sticky top-24 min-w-0 w-full overflow-hidden">
          {isExpired ? (
            <div className="p-6 text-center space-y-4 bg-amber-50/40 rounded-2xl border border-amber-200/80">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-brand-black">Applications Closed</h3>
                <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                  The application deadline for this position has passed. This job is no longer accepting new candidate submissions.
                </p>
              </div>
              <Link to="/jobs" className="btn-primary w-full text-center block text-xs py-3 font-bold shadow-xs">
                Explore Active Openings →
              </Link>
            </div>
          ) : !user ? (
            /* ── AUTH GATE: MANDATORY LOGIN TO APPLY (ANY JOB TYPE) ── */
            <div className="p-6 text-center space-y-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-green flex items-center justify-center mx-auto shadow-xs">
                <Lock size={22} className="text-emerald-800" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-brand-black">
                  Log in to Apply
                </h3>
                <p className="text-xs text-brand-grey mt-1.5 leading-relaxed">
                  {job.applyType === "email"
                    ? "You must be logged in to view the verified HR contact email and submit your application."
                    : job.applyType === "external_link"
                    ? "You must be logged in to access the verified company portal link and apply."
                    : "You must be logged in as a candidate to submit your resume for this position."}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  to={`/login?redirect=/jobs/${job._id}`}
                  className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <LogIn size={15} /> Log In to Apply
                </Link>

                <Link
                  to={`/register?redirect=/jobs/${job._id}`}
                  className="btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 text-brand-black"
                >
                  Create Free Candidate Account →
                </Link>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-around text-[11px] text-emerald-800 font-medium">
                <span>✓ 100% Free</span>
                <span>•</span>
                <span>✓ Verified Jobs</span>
                <span>•</span>
                <span>✓ Direct HR</span>
              </div>
            </div>
          ) : !["seeker", "employer"].includes(user?.role) ? (
            /* ── ROLE CHECK: CANDIDATES OR EMPLOYERS CAN APPLY ── */
            <div className="p-6 text-center space-y-3 bg-amber-50/40 rounded-2xl border border-amber-200/80">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Info size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-brand-black">
                  Candidate Account Required
                </h3>
                <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                  You are currently logged in with an administrator account. Please log in with a candidate account to apply to vacancies.
                </p>
              </div>
            </div>
          ) : /* ── CASE 1: DIRECT HR EMAIL APPLICATION ── */
          job.applyType === "email" ? (
            <div className="space-y-4 min-w-0 w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-semibold text-base leading-tight truncate">Apply via HR Email</h2>
                  <p className="text-xs text-brand-grey truncate">Direct submission to company HR</p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1.5 break-words">
                <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                  <Info size={14} className="shrink-0" /> Instructions:
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
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <input
                    readOnly
                    value={job.applyEmail || ""}
                    className="input-field text-sm font-medium bg-gray-50 flex-1 min-w-0 cursor-text select-all"
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

              {/* Action Button: Opens Gmail App on phone, Web Gmail on desktop */}
              <div className="pt-2">
                {/* Phone / Small Screen (md:hidden): Opens Gmail / native Mail app directly */}
                <a
                  href={mailtoLink}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3 text-sm font-bold shadow-xs md:hidden"
                >
                  <Mail size={17} /> Apply Now
                </a>

                {/* Large Screen / Desktop (hidden md:flex): Opens Web Gmail in browser */}
                <a
                  href={gmailWebLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center items-center justify-center gap-2 py-3 text-sm font-bold shadow-xs hidden md:flex"
                >
                  <Mail size={17} /> Apply Now
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

              {applied ? (
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wide">
                        Your Attached Resume *
                      </label>
                      <Link
                        to="/resume-builder"
                        target="_blank"
                        className="text-[11px] font-bold text-brand-green-dark hover:underline"
                      >
                        Resume Builder ↗
                      </Link>
                    </div>

                    {/* SHOW ONLY ONE RESUME (LAST EDITED / UPLOADED) */}
                    {activeResumeInfo && resumeMode !== "manual_link" ? (
                      <div className="w-full min-w-0 p-4 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-3 min-w-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/90 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <CheckCircle2 size={11} className="text-emerald-700" />
                                  {activeResumeInfo.badge || "Active Resume"}
                                </span>
                              </div>
                              <p
                                className="text-xs font-bold text-emerald-950 truncate block mt-1"
                                title={activeResumeInfo.title}
                              >
                                {activeResumeInfo.title}
                              </p>
                              <p className="text-[11px] text-emerald-800/80 truncate mt-0.5">
                                {activeResumeInfo.subtitle}
                                {activeResumeInfo.updatedAt && (
                                  <>
                                    {" "}• {new Date(activeResumeInfo.updatedAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Resume Actions Bar */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-emerald-200/80 flex-wrap">
                          <label className="text-[11px] font-bold text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100/70 px-3 py-1.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                            {uploadingResume ? (
                              <>
                                <Loader2 size={13} className="animate-spin text-emerald-700" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud size={13} className="text-emerald-700" />
                                <span>Replace with File</span>
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

                          <div className="flex items-center gap-2">
                            {activeResumeInfo.type === "builder" ? (
                              <Link
                                to="/resume-builder"
                                target="_blank"
                                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                              >
                                <Edit3 size={12} /> Edit CV ↗
                              </Link>
                            ) : (
                              <a
                                href={
                                  activeResumeInfo.url.startsWith("http")
                                    ? activeResumeInfo.url
                                    : `https://${activeResumeInfo.url}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink size={12} /> View File ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* No resume yet OR manual link mode */
                      <div className="space-y-3">
                        <label
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all w-full min-w-0 ${
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
                                Click to browse or drag & drop resume file
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

                        <div className="text-center">
                          <Link
                            to="/resume-builder"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                          >
                            <Edit3 size={13} className="text-emerald-600" /> Or Create with Resume Builder ↗
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full min-w-0">
                    <label className="text-xs font-bold text-brand-grey uppercase tracking-wide">
                      Cover Note (optional)
                    </label>
                    <textarea
                      className="input-field mt-1 text-sm w-full min-w-0"
                      rows={3}
                      placeholder="Brief note to the hiring manager..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium break-words">{error}</p>}

                  <button
                    type="submit"
                    disabled={uploadingResume || !resumeUrl}
                    className="btn-primary w-full py-3 text-sm font-bold shadow-sm disabled:opacity-50 min-w-0"
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
                const text = `🌾 *Agriculture Hiring Alert on AgriYuvaa Job Portal*:\n\n📌 *${job.title}*\n🏢 *Company:* ${company}\n📍 *Location:* ${job.location || "India"}\n💼 *Type:* ${job.employmentType || "Full-time"}${salaryInfo}\n\n👉 *View & Apply:* ${window.location.href}`;
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
