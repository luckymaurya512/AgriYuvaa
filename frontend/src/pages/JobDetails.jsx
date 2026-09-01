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
} from "lucide-react";
import { fetchJobById, applyToJob } from "../services/jobService.js";
import { toggleSaveJob, fetchSeekerProfile } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Bookmark / Save state
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(() => setError("This job could not be found."))
      .finally(() => setLoading(false));

    if (user?.role === "seeker") {
      fetchSeekerProfile()
        .then((profile) => {
          if (profile?.savedJobs) {
            const saved = profile.savedJobs.some((j) => (j._id || j).toString() === id);
            setIsSaved(saved);
          }
        })
        .catch(() => {});
    }
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await applyToJob(id, { resumeUrl, coverNote });
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
          <p className="text-base font-semibold text-brand-black/90 flex items-center gap-1.5">
            <Building2 size={18} className="text-brand-green" /> {companyDisplayName}
          </p>

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
                <p className="text-sm text-brand-green-dark font-semibold">
                  Application submitted! You can track its status from your dashboard.
                </p>
              ) : (
                <form onSubmit={handleApply} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                      Resume URL
                    </label>
                    <input
                      required
                      className="input-field mt-1 text-sm"
                      placeholder="Link to your resume (Google Drive, PDF)"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                      Cover Note (optional)
                    </label>
                    <textarea
                      className="input-field mt-1 text-sm"
                      rows={4}
                      placeholder="Why are you a good fit for this role?"
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <button type="submit" className="btn-primary w-full">
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Action Row: Save Job + Share */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-border">
            {user?.role === "seeker" && (
              <button
                type="button"
                onClick={handleToggleBookmark}
                disabled={savingBookmark}
                className={`btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 ${
                  isSaved ? "bg-emerald-50 border-emerald-300 text-emerald-800" : ""
                }`}
              >
                <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save Job"}
              </button>
            )}

            <button
              onClick={() => handleCopy(window.location.href, "share")}
              className={`btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 ${
                user?.role !== "seeker" ? "col-span-2" : ""
              }`}
            >
              {copiedShare ? (
                <>
                  <Check size={15} className="text-brand-green" /> Link Copied
                </>
              ) : (
                <>
                  <Share2 size={15} /> Share Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
