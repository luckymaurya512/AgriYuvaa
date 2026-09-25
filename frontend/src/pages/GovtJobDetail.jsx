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
  Edit3,
  Trash2,
  Building2,
  X,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { fetchGovtJobById, fetchGovtJobs, updateGovtJob, deleteGovtJob } from "../services/jobService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import GovtJobCard from "../components/GovtJobCard.jsx";
import SEO from "../components/SEO.jsx";

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const GovtJobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Admin Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenEdit = () => {
    if (!job) return;
    setEditForm({
      title: job.title || "",
      organization: job.organization || "",
      category: job.category || "Central Govt",
      state: job.state || "All India",
      qualification: job.qualification || "B.Sc Agriculture",
      vacancies: job.vacancies || "",
      salary: job.salary || "",
      applicationDeadline: job.applicationDeadline || "",
      examDate: job.examDate || "",
      notificationUrl: job.notificationUrl || "",
      applyUrl: job.applyUrl || "",
      status: job.status || "Active",
      ageLimit: job.ageLimit || "18 - 30 Years",
      description: job.description || "",
      slug: job.slug || "",
      slugModified: true,
    });
    setEditError("");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setEditError("");
    try {
      const updated = await updateGovtJob(job._id, editForm);
      setJob(updated);
      setEditModalOpen(false);
      setSuccessMsg("Government Vacancy updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      if (updated.slug && updated.slug !== id) {
        navigate(`/govt-jobs/${updated.slug}`, { replace: true });
      }
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update government vacancy");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${job.title}"?`)) return;
    try {
      await deleteGovtJob(job._id);
      navigate("/govt-jobs", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vacancy");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchGovtJobById(id)
      .then(async (data) => {
        setJob(data);
        try {
          let others = [];
          if (data.category && data.category !== "All") {
            const catJobs = await fetchGovtJobs({ category: data.category });
            others = (Array.isArray(catJobs) ? catJobs : []).filter(
              (j) => j._id !== data._id && j.slug !== data.slug
            );
          }
          if (others.length < 3) {
            const allJobs = await fetchGovtJobs({});
            const more = (Array.isArray(allJobs) ? allJobs : []).filter(
              (j) => j._id !== data._id && j.slug !== data.slug && !others.some((o) => o._id === j._id)
            );
            others = [...others, ...more];
          }
          setRelatedJobs(others.slice(0, 6));
        } catch (_) {
          setRelatedJobs([]);
        }
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
    const text = `🏛️ *Government Agriculture Vacancy Alert on AgriYuvaa Job Portal*:\n\n📌 *${job.title}*\n🏢 *Organization:* ${job.organization}\n📍 *State:* ${job.state || "All India"}\n👥 *Vacancies:* ${job.vacancies || "Multiple"}\n💰 *Pay Scale:* ${job.salary || "As per rules"}\n📅 *Deadline:* ${job.applicationDeadline || "Check notification"}\n\n👉 *View & Apply Details:* ${shareUrl}`;
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-grey">
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
            <Link to="/" className="hover:text-emerald-800 transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <Link to="/govt-jobs" className="hover:text-emerald-800 transition-colors shrink-0">
              Govt Vacancies
            </Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <span className="font-semibold text-brand-black truncate">{job.organization}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 transition-colors shadow-2xs cursor-pointer"
                  title="Edit this government vacancy notice"
                >
                  <Edit3 size={13} /> <span className="hidden sm:inline">Edit Notice</span><span className="sm:hidden">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors shadow-2xs cursor-pointer"
                  title="Delete this government vacancy notice"
                >
                  <Trash2 size={13} /> <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}
            <Link
              to="/govt-jobs"
              className="shrink-0 inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to all vacancies</span><span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        {successMsg && (
          <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        <div className="card p-4 sm:p-8 bg-white border border-brand-border shadow-xs space-y-5 sm:space-y-6">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
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

                <Link
                  to="/govt-jobs"
                  className="px-5 py-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-sm font-bold flex items-center justify-center gap-1.5 transition-all sm:ml-auto"
                >
                  <Briefcase size={15} className="text-emerald-700" /> More Vacancies →
                </Link>
              </div>

              {/* Candidate Note */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 leading-relaxed flex items-start gap-2">
                <span className="shrink-0 text-sm">ℹ️</span>
                <span>
                  <strong>Candidate Note:</strong> Always verify eligibility criteria, reservation categories, and fee details in the official advertisement PDF before submitting applications.
                </span>
              </div>
            </div>

        {/* ── MORE JOBS SECTION ── */}
        <div className="mt-12 pt-8 border-t border-brand-border space-y-6">
          {/* Section Header & Direct Portal Navigation Pills */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sparkles size={16} />
                </span>
                <h2 className="text-xl font-display font-bold text-brand-black">
                  More Agriculture Jobs & Vacancies
                </h2>
              </div>
              <p className="text-xs text-brand-grey">
                Explore more public sector recruitments and verified agricultural job alerts
              </p>
            </div>

            {/* Quick Switch Options */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/govt-jobs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors shadow-2xs"
              >
                <Landmark size={14} className="text-purple-700" /> All Govt Vacancies ↗
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <Briefcase size={14} className="text-emerald-700" /> Private & Corporate Jobs ↗
              </Link>
              <Link
                to="/employers"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <Building2 size={14} className="text-gray-600" /> Hiring Employers ↗
              </Link>
            </div>
          </div>

          {/* Related Jobs Grid */}
          {relatedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedJobs.map((rj) => (
                <GovtJobCard key={rj._id} job={rj} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center bg-white border border-brand-border space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                <Landmark size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-black">Looking for more agriculture jobs?</h3>
                <p className="text-xs text-brand-grey max-w-md mx-auto mt-1">
                  Discover dozens of central & state government exams, banking recruitments, and private agribusiness openings.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link to="/govt-jobs" className="btn-primary text-xs py-2.5 px-5">
                  Browse All Govt Vacancies
                </Link>
                <Link to="/jobs" className="btn-secondary text-xs py-2.5 px-5">
                  Browse Private Jobs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── EDIT GOVT VACANCY MODAL (ADMIN) ── */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border my-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <h2 className="font-display font-bold text-xl text-brand-black flex items-center gap-2">
                    <Landmark size={20} className="text-emerald-700" /> Edit Government Vacancy Notice
                  </h2>
                  <p className="text-xs text-brand-grey mt-0.5">
                    Modifications will reflect immediately on this notice page and in search results.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-brand-grey uppercase">Job Title / Designation *</label>
                    <input
                      required
                      placeholder="e.g. Agriculture Field Officer (AFO Scale-I) 2026"
                      className="input-field mt-1 text-sm"
                      value={editForm.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditForm((prev) => ({
                          ...prev,
                          title: newTitle,
                          slug: prev.slugModified ? prev.slug : slugify(newTitle),
                        }));
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-emerald-950 uppercase text-[11px] flex items-center gap-1.5">
                        <span>🔗 Permanent URL Slug (SEO & Social Sharing Link)</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        Custom URL
                      </span>
                    </div>
                    <div className="flex items-center rounded-xl bg-white border border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-transparent overflow-hidden shadow-2xs">
                      <span className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs font-mono text-gray-500 select-none whitespace-nowrap">
                        /govt-jobs/
                      </span>
                      <input
                        placeholder="ibps-afo-scale-1-2026"
                        className="w-full px-3 py-2 text-xs font-mono font-semibold text-emerald-950 focus:outline-none bg-transparent"
                        value={editForm.slug || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            slug: slugify(e.target.value),
                            slugModified: true,
                          }))
                        }
                      />
                    </div>
                    <p className="text-[11px] text-emerald-800/80 leading-tight">
                      Custom handle for direct sharing. Changing this updates your page URL automatically.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Department / Organization *</label>
                    <input
                      required
                      placeholder="e.g. IBPS / NABARD / ICAR / UPPSC"
                      className="input-field mt-1 text-sm"
                      value={editForm.organization || ""}
                      onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Category *</label>
                    <select
                      className="input-field mt-1 text-sm bg-white"
                      value={editForm.category || "Central Govt"}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      <option value="Central Govt">Central Govt</option>
                      <option value="State Govt">State Govt</option>
                      <option value="Banking & NABARD">Banking & NABARD</option>
                      <option value="Research & ICAR">Research & ICAR</option>
                      <option value="PSU & Corporations">PSU & Corporations</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Eligibility / Qualification *</label>
                    <select
                      className="input-field mt-1 text-sm bg-white"
                      value={editForm.qualification || "B.Sc Agriculture"}
                      onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                    >
                      <option value="B.Sc Agriculture">B.Sc Agriculture</option>
                      <option value="M.Sc / Ph.D">M.Sc / Ph.D</option>
                      <option value="Diploma in Agriculture">Diploma in Agriculture</option>
                      <option value="B.Tech Agri Engg">B.Tech Agri Engg</option>
                      <option value="Any Graduate">Any Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">State / Location *</label>
                    <input
                      required
                      placeholder="e.g. All India or Uttar Pradesh"
                      className="input-field mt-1 text-sm"
                      value={editForm.state || ""}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Total Vacancies (Optional)</label>
                    <input
                      placeholder="e.g. 896 Posts"
                      className="input-field mt-1 text-sm"
                      value={editForm.vacancies || ""}
                      onChange={(e) => setEditForm({ ...editForm, vacancies: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Salary / Pay Scale *</label>
                    <input
                      required
                      placeholder="e.g. ₹48,480 - ₹85,920 / month"
                      className="input-field mt-1 text-sm"
                      value={editForm.salary || ""}
                      onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Application Deadline *</label>
                    <input
                      required
                      placeholder="e.g. 31 Oct 2026"
                      className="input-field mt-1 text-sm"
                      value={editForm.applicationDeadline || ""}
                      onChange={(e) => setEditForm({ ...editForm, applicationDeadline: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-brand-grey uppercase">Exam Date / Selection Process</label>
                    <input
                      placeholder="e.g. Prelims: Dec 2026 | Mains: Jan 2027"
                      className="input-field mt-1 text-sm"
                      value={editForm.examDate || ""}
                      onChange={(e) => setEditForm({ ...editForm, examDate: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-brand-grey uppercase">Official Notification PDF Link (URL)</label>
                    <input
                      type="url"
                      placeholder="https://official-dept.gov.in/notification.pdf"
                      className="input-field mt-1 text-sm"
                      value={editForm.notificationUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, notificationUrl: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-brand-grey uppercase">Online Application Portal Link (URL) *</label>
                    <input
                      required
                      type="url"
                      placeholder="https://ibpsonline.ibps.in/..."
                      className="input-field mt-1 text-sm"
                      value={editForm.applyUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, applyUrl: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-brand-grey uppercase">Status</label>
                    <select
                      className="input-field mt-1 text-sm bg-white"
                      value={editForm.status || "Active"}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="Active">Active (Accepting Applications)</option>
                      <option value="Closing Soon">Closing Soon</option>
                      <option value="Upcoming">Upcoming Notification</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-brand-grey uppercase">Short Summary & Details *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Summary of post, age criteria, key eligibility and selection stages..."
                      className="input-field mt-1 text-sm"
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-grey hover:text-black font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingEdit}
                    type="submit"
                    className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {savingEdit ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save size={15} /> Update Vacancy Notice
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovtJobDetail;
