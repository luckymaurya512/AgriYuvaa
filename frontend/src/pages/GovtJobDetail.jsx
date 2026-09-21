import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Landmark,
  Calendar,
  ExternalLink,
  FileText,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  IndianRupee,
  Share2,
  Check,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { fetchGovtJobById, fetchGovtJobs } from "../services/jobService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import GovtJobCard from "../components/GovtJobCard.jsx";
import SEO from "../components/SEO.jsx";

const GovtJobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchGovtJobById(id)
      .then((data) => {
        setJob(data);
        // Load related vacancies in same category or general
        fetchGovtJobs({ category: data.category !== "All" ? data.category : undefined })
          .then((all) => {
            const others = (Array.isArray(all) ? all : [])
              .filter((j) => j._id !== data._id && j.slug !== data.slug)
              .slice(0, 3);
            setRelatedJobs(others);
          })
          .catch(() => setRelatedJobs([]));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      navigate(`/login?redirect=/govt-jobs/${job?.slug || job?._id || id}`);
    } else if (job?.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShareWhatsApp = () => {
    if (!job) return;
    const shareUrl = `${window.location.origin}/govt-jobs/${job.slug || job._id}`;
    const text = `🏛️ *Government Agriculture Vacancy Alert on AgriYuvaa*:\n\n📌 *${job.title}*\n🏢 *Organization:* ${job.organization}\n📍 *State:* ${job.state || "All India"}\n👥 *Vacancies:* ${job.vacancies || "Multiple"}\n💰 *Pay Scale:* ${job.salary || "As per rules"}\n📅 *Deadline:* ${job.applicationDeadline || "Check notification"}\n\n👉 *View & Apply Details:* ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    if (!job) return;
    const shareUrl = `${window.location.origin}/govt-jobs/${job.slug || job._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="card p-8 space-y-5 bg-white">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-16 bg-gray-100 rounded-xl" />
                ))}
              </div>
              <div className="h-32 bg-gray-100 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 py-20">
        <div className="card max-w-md w-full p-8 text-center space-y-4 bg-white">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
            <Landmark size={26} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Government Vacancy Not Found</h2>
          <p className="text-xs text-gray-500">
            This recruitment notice may have concluded or the URL link is invalid.
          </p>
          <Link
            to="/govt-jobs"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Government Vacancies
          </Link>
        </div>
      </div>
    );
  }

  const jobSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization,
    },
    employmentType: "FULL_TIME",
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: job.state || "All India",
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary,
      },
    },
    validThrough: job.applicationDeadline,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <SEO
        title={`${job.title} - ${job.organization} Recruitment | AgriYuvaa`}
        description={`${job.title} at ${job.organization}. Total Vacancies: ${job.vacancies}. Salary: ${job.salary}. Last Date to apply: ${job.applicationDeadline}.`}
        canonical={`/govt-jobs/${job.slug || job._id}`}
        jsonLd={jobSchema}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3 text-xs text-brand-grey">
          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap truncate">
            <Link to="/" className="hover:text-emerald-800 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <Link to="/govt-jobs" className="hover:text-emerald-800 transition-colors">
              Govt Vacancies
            </Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <span className="font-semibold text-brand-black truncate">{job.organization}</span>
          </div>

          <Link
            to="/govt-jobs"
            className="shrink-0 inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
          >
            <ArrowLeft size={14} /> Back to all vacancies
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Details Card (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card p-6 sm:p-8 bg-white border border-brand-border shadow-xs space-y-6">
              {/* Header: Organization & Status Badges */}
              <div className="space-y-3 pb-6 border-b border-brand-border/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-lg">
                      <Landmark size={14} className="text-emerald-700" />
                      {job.organization}
                    </span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-lg">
                      {job.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        job.status === "Closing Soon"
                          ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      ● {job.status || "Active"}
                    </span>
                  </div>

                  {/* Share Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      title="Share on WhatsApp"
                    >
                      <WhatsAppIcon size={14} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                      title="Copy link"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={13} />
                          <span className="hidden sm:inline">Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-3xl font-display font-extrabold text-brand-black leading-snug">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-brand-grey pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-700" />
                    <span>Location: <strong className="text-brand-black">{job.state || "All India"}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-700" />
                    <span>Application Deadline: <strong className="text-brand-black">{job.applicationDeadline}</strong></span>
                  </span>
                </div>
              </div>

              {/* Key Specs Matrix */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-grey mb-3">
                  Vacancy Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <Users size={14} className="text-emerald-700" />
                      <span>Total Vacancies</span>
                    </div>
                    <div className="font-bold text-sm text-brand-black">{job.vacancies || "Not Specified"}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <IndianRupee size={14} className="text-emerald-700" />
                      <span>Pay Scale / Salary</span>
                    </div>
                    <div className="font-bold text-sm text-brand-black truncate">{job.salary}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <GraduationCap size={14} className="text-emerald-700" />
                      <span>Required Degree</span>
                    </div>
                    <div className="font-bold text-sm text-brand-black truncate">{job.qualification}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <Clock size={14} className="text-emerald-700" />
                      <span>Age Limit</span>
                    </div>
                    <div className="font-bold text-xs text-brand-black">{job.ageLimit || "18 - 30 Years"}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <Calendar size={14} className="text-emerald-700" />
                      <span>Exam Date / Schedule</span>
                    </div>
                    <div className="font-bold text-xs text-brand-black">{job.examDate || "Will be notified"}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100/80">
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mb-1">
                      <ShieldCheck size={14} className="text-emerald-700" />
                      <span>Verification</span>
                    </div>
                    <div className="font-bold text-xs text-emerald-800">Govt Official Portal</div>
                  </div>
                </div>
              </div>

              {/* Recruitment Notification & Role Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-display font-bold text-brand-black">
                  Job Description & Roles
                </h3>
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200/60 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Action Buttons Box */}
              <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="btn-primary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Apply on Govt Portal <ExternalLink size={15} />
                </button>

                {job.notificationUrl && (
                  <a
                    href={job.notificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-3 px-5 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FileText size={15} /> Download Official Notification PDF
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Highlights & Quick Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <div className="card p-6 bg-white border border-brand-border shadow-xs space-y-5">
              <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-700" />
                Verified Notification
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-brand-grey">Authority:</span>
                  <span className="font-bold text-brand-black text-right">{job.organization}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-brand-grey">Vacancies:</span>
                  <span className="font-bold text-brand-black">{job.vacancies}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-brand-grey">State / Area:</span>
                  <span className="font-bold text-brand-black">{job.state}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-brand-grey">Deadline:</span>
                  <span className="font-bold text-red-600">{job.applicationDeadline}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
                ℹ️ <strong>Candidate Note:</strong> Always verify eligibility criteria and fee details in the official advertisement PDF before submitting applications.
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                Direct Application Link <ExternalLink size={13} />
              </button>
            </div>

            {/* Share Prompt Box */}
            <div className="card p-5 bg-gradient-to-br from-emerald-900 to-gray-900 text-white space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <span>📢</span> Share with Agri Batchmates
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Know someone preparing for ICAR, NABARD, or State Agriculture exams? Share this alert directly with them.
              </p>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <WhatsAppIcon size={15} /> Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Government Vacancies Section */}
        {relatedJobs.length > 0 && (
          <div className="mt-14 pt-10 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-brand-black">
                  Other Active Government Vacancies
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  Explore other recent public sector recruitment notices in agriculture
                </p>
              </div>
              <Link
                to="/govt-jobs"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                View all notifications →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedJobs.map((rj) => (
                <GovtJobCard key={rj._id} job={rj} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovtJobDetail;
