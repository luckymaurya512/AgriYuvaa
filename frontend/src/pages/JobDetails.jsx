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
} from "lucide-react";
import { fetchJobById, applyToJob } from "../services/jobService.js";
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

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(() => setError("This job could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

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
  const mailtoLink = `mailto:${job.applyEmail}?subject=${encodeURIComponent(
    defaultEmailSubject
  )}&body=${encodeURIComponent(
    `Dear HR,\n\nPlease find attached my resume for the ${job.title} position at ${companyDisplayName}.\n\nName: ${
      user?.name || ""
    }\nEmail: ${user?.email || ""}\n\nBest regards,\n${user?.name || ""}`
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
      {/* Left Column: Job Info */}
      <div className="md:col-span-2 space-y-6">
        <div>
          {job.isFeatured && <span className="badge-featured mb-3 inline-block">Featured</span>}
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
                  <Info size={14} /> How to Apply:
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
                    className="input-field text-sm font-medium bg-gray-50 flex-1 cursor-text"
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
                    className="input-field text-xs bg-gray-50 flex-1 cursor-text"
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

              {/* Launch Email App CTA */}
              <a
                href={mailtoLink}
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3 mt-2"
              >
                <Mail size={16} /> Open Email & Send Resume
              </a>
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

          {/* Share button */}
          <button
            onClick={() => handleCopy(window.location.href, "share")}
            className="btn-secondary w-full mt-3 text-sm flex items-center justify-center gap-1.5"
          >
            {copiedShare ? (
              <>
                <Check size={16} className="text-brand-green" /> Link Copied to Clipboard
              </>
            ) : (
              <>
                <Share2 size={16} /> Share this job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
