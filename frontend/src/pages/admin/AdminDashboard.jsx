import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PlusCircle,
  Star,
  CheckCircle,
  XCircle,
  Landmark,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  Users,
  Download,
  ExternalLink,
  FileText,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Layers,
  Briefcase,
  LayoutDashboard,
  Clock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  FileSpreadsheet,
  Eye,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import ResumePreviewModal from "../../components/ResumePreviewModal.jsx";
import {
  fetchPlatformStats,
  fetchPendingJobs,
  fetchAllPlatformJobs,
  fetchAllApplications,
  reviewJob,
  toggleJobFeatured,
} from "../../services/adminService.js";
import {
  deleteJob,
  fetchGovtJobs,
  createGovtJob,
  updateGovtJob,
  deleteGovtJob,
} from "../../services/jobService.js";
import {
  fetchAllBlogs, createBlog, updateBlog, deleteBlog, uploadBlogImage,
  fetchAllWorkshops, createWorkshop, updateWorkshop, deleteWorkshop,
  fetchAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from "../../services/landingService.js";
import RichTextEditor from "../../components/common/RichTextEditor.jsx";
import SEO from "../../components/SEO.jsx";

const initialGovtForm = {
  title: "",
  organization: "",
  category: "Central Govt",
  state: "All India",
  qualification: "B.Sc Agriculture",
  vacancies: "",
  salary: "",
  applicationDeadline: "",
  examDate: "",
  notificationUrl: "",
  applyUrl: "",
  status: "Active",
  ageLimit: "18 - 30 Years",
  description: "",
  slug: "",
  slugModified: false,
};

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const setTab = (tabName) => {
    if (tabName === "overview") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabName });
    }
  };

  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Platform Applications State
  const [applications, setApplications] = useState([]);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [loadingApps, setLoadingApps] = useState(false);
  const [appViewMode, setAppViewMode] = useState("by_job"); // "by_job" | "all_feed"
  const [expandedJobIds, setExpandedJobIds] = useState(new Set());
  const [previewApp, setPreviewApp] = useState(null);

  const [actionSuccess, setActionSuccess] = useState("");

  // ── CMS State ──
  const [cmsBlogs, setCmsBlogs] = useState([]);
  const [cmsWorkshops, setCmsWorkshops] = useState([]);
  const [cmsTestimonials, setCmsTestimonials] = useState([]);
  const [cmsEditItem, setCmsEditItem] = useState(null);
  const [cmsEditType, setCmsEditType] = useState("");
  const [cmsForm, setCmsForm] = useState({});
  const [cmsLoading, setCmsLoading] = useState(false);

  // ── Govt Vacancies State ──
  const [govtJobs, setGovtJobs] = useState([]);
  const [loadingGovtJobs, setLoadingGovtJobs] = useState(false);
  const [govtSearch, setGovtSearch] = useState("");
  const [govtCategoryFilter, setGovtCategoryFilter] = useState("All");
  const [govtModalOpen, setGovtModalOpen] = useState(false);
  const [editingGovtJob, setEditingGovtJob] = useState(null);
  const [govtForm, setGovtForm] = useState(initialGovtForm);
  const [savingGovt, setSavingGovt] = useState(false);
  const [govtError, setGovtError] = useState("");
  const [copiedGovtId, setCopiedGovtId] = useState(null);

  const handleExportCSV = (customList = null, filenamePrefix = "all_applications") => {
    const listToExport = customList || applications;
    if (!listToExport || listToExport.length === 0) {
      alert("No applicants to export.");
      return;
    }

    const backendBase = (
      import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
    ).replace(/\/api\/?$/, "");

    const headers = [
      "Applicant Name",
      "Email Address",
      "Phone Number",
      "Target Job Title",
      "Company Name",
      "Job Location",
      "Application Status",
      "Applied Date",
      "Resume URL",
      "Cover Note",
    ];

    const rows = listToExport.map((app) => {
      let downloadUrl = app.resumeUrl ? app.resumeUrl.trim() : "";
      downloadUrl = downloadUrl.replace(/^https?:\/\/\/+/, "/");
      if (downloadUrl.startsWith("/uploads/")) {
        downloadUrl = `${backendBase}${downloadUrl}`;
      } else if (!downloadUrl.startsWith("http://") && !downloadUrl.startsWith("https://") && downloadUrl.length > 0) {
        downloadUrl = `https://${downloadUrl}`;
      } else if (!downloadUrl && app._id) {
        downloadUrl = `${backendBase}/api/applications/${app._id}/resume`;
      }

      return [
        `"${(app.seeker?.name || "Applicant").replace(/"/g, '""')}"`,
        `"${(app.seeker?.email || "").replace(/"/g, '""')}"`,
        `"${(app.seeker?.phone || "").replace(/"/g, '""')}"`,
        `"${(app.job?.title || "Job").replace(/"/g, '""')}"`,
        `"${(app.job?.companyName || app.job?.employer?.name || "Company").replace(/"/g, '""')}"`,
        `"${(app.job?.location || "").replace(/"/g, '""')}"`,
        `"${(app.status || "applied").replace(/"/g, '""')}"`,
        `"${new Date(app.createdAt).toLocaleDateString("en-IN")}"`,
        `"${downloadUrl.replace(/"/g, '""')}"`,
        `"${(app.coverNote || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = filenamePrefix.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriYuvaa_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleExpandJob = (jobId) => {
    setExpandedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const toggleExpandAll = (allIds) => {
    if (expandedJobIds.size === allIds.length) {
      setExpandedJobIds(new Set());
    } else {
      setExpandedJobIds(new Set(allIds));
    }
  };

  // Group applications by Job Posting
  const groupedJobs = useMemo(() => {
    const map = new Map();

    // Initialize all existing jobs
    allJobs.forEach((job) => {
      map.set(job._id.toString(), {
        jobId: job._id,
        title: job.title,
        companyName: job.companyName || job.employer?.name || "Hiring Company",
        location: job.location || "Remote / Pan-India",
        category: job.category?.name || "General",
        status: job.status,
        isFeatured: job.isFeatured,
        createdAt: job.createdAt,
        applicants: [],
      });
    });

    // Populate applications under each job
    applications.forEach((app) => {
      const jId = app.job?._id?.toString() || app.job?.toString() || "archived";
      if (!map.has(jId)) {
        map.set(jId, {
          jobId: app.job?._id || jId,
          title: app.job?.title || "Archived / Removed Job",
          companyName: app.job?.companyName || app.job?.employer?.name || "Company",
          location: app.job?.location || "",
          category: "General",
          status: "closed",
          isFeatured: false,
          createdAt: app.createdAt,
          applicants: [],
        });
      }
      map.get(jId).applicants.push(app);
    });

    let list = Array.from(map.values());

    // Search query filtering
    if (appSearch && appSearch.trim()) {
      const q = appSearch.trim().toLowerCase();
      list = list.filter((j) => {
        const matchJob =
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q);
        const matchApplicant = j.applicants.some(
          (a) =>
            a.seeker?.name?.toLowerCase().includes(q) ||
            a.seeker?.email?.toLowerCase().includes(q)
        );
        return matchJob || matchApplicant;
      });
    }

    // Sort by number of applicants descending (jobs with applications on top)
    return list.sort((a, b) => b.applicants.length - a.applicants.length || new Date(b.createdAt) - new Date(a.createdAt));
  }, [allJobs, applications, appSearch]);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchPendingJobs().then(setPendingJobs).catch(() => {});
    loadPlatformJobs();
    loadPlatformApplications();
    loadGovtJobsData();
  };

  const loadPlatformJobs = () => {
    setLoadingJobs(true);
    fetchAllPlatformJobs({
      status: jobStatusFilter !== "all" ? jobStatusFilter : undefined,
      search: jobSearch.trim() || undefined,
    })
      .then(setAllJobs)
      .catch(() => setAllJobs([]))
      .finally(() => setLoadingJobs(false));
  };

  const loadPlatformApplications = () => {
    setLoadingApps(true);
    fetchAllApplications({
      status: appStatusFilter !== "all" ? appStatusFilter : undefined,
      search: appSearch.trim() || undefined,
    })
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoadingApps(false));
  };

  const loadGovtJobsData = () => {
    setLoadingGovtJobs(true);
    fetchGovtJobs({
      category: govtCategoryFilter !== "All" ? govtCategoryFilter : undefined,
      search: govtSearch.trim() || undefined,
    })
      .then((data) => setGovtJobs(Array.isArray(data) ? data : []))
      .catch(() => setGovtJobs([]))
      .finally(() => setLoadingGovtJobs(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadPlatformJobs();
  }, [jobStatusFilter]);

  useEffect(() => {
    loadPlatformApplications();
  }, [appStatusFilter]);

  useEffect(() => {
    loadGovtJobsData();
  }, [govtCategoryFilter]);

  const handleSearchGovtSubmit = (e) => {
    e.preventDefault();
    loadGovtJobsData();
  };

  const handleOpenCreateGovtJob = () => {
    setEditingGovtJob(null);
    setGovtForm(initialGovtForm);
    setGovtError("");
    setGovtModalOpen(true);
  };

  const handleOpenEditGovtJob = (job) => {
    setEditingGovtJob(job);
    setGovtForm({
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
    setGovtError("");
    setGovtModalOpen(true);
  };

  const handleSaveGovtJob = async (e) => {
    e.preventDefault();
    setSavingGovt(true);
    setGovtError("");
    try {
      if (editingGovtJob?._id) {
        await updateGovtJob(editingGovtJob._id, govtForm);
        setActionSuccess(`Government vacancy "${govtForm.title}" updated successfully!`);
      } else {
        await createGovtJob(govtForm);
        setActionSuccess(`Government vacancy "${govtForm.title}" posted successfully!`);
      }
      setGovtModalOpen(false);
      setEditingGovtJob(null);
      setGovtForm(initialGovtForm);
      setTimeout(() => setActionSuccess(""), 4000);
      loadGovtJobsData();
    } catch (err) {
      setGovtError(err.response?.data?.message || "Failed to save government vacancy");
    } finally {
      setSavingGovt(false);
    }
  };

  const handleDeleteGovtJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete the notice for "${job.title}"?`)) return;
    try {
      await deleteGovtJob(job._id);
      setActionSuccess(`Vacancy notice "${job.title}" removed.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadGovtJobsData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vacancy");
    }
  };

  const handleCopyGovtLink = (job) => {
    const permalink = `${window.location.origin}/govt-jobs/${job.slug || job._id}`;
    navigator.clipboard.writeText(permalink);
    setCopiedGovtId(job._id);
    setTimeout(() => setCopiedGovtId(null), 2500);
  };

  const handleJobDecision = async (id, decision, isFeatured = false) => {
    await reviewJob(
      id,
      decision,
      decision === "rejected" ? "Did not meet posting guidelines" : undefined,
      isFeatured
    );
    loadAll();
  };

  const handleToggleFeatured = async (job) => {
    try {
      const res = await toggleJobFeatured(job._id);
      setActionSuccess(
        res.isFeatured
          ? `⭐ "${job.title}" has been set to FEATURED.`
          : `ℹ️ "${job.title}" has been unfeatured.`
      );
      setTimeout(() => setActionSuccess(""), 4000);
      loadPlatformJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle featured status");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job._id);
      setActionSuccess(`Job "${job.title}" has been removed.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO title="Admin Control Center" noindex={true} />
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Admin Control Center</h1>
          <p className="text-sm text-brand-grey">
            Manage job postings, review submissions, track applicant resumes, and monitor platform activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setTab("govt-jobs");
              handleOpenCreateGovtJob();
            }}
            className="btn-secondary text-sm flex items-center gap-2 py-2.5 px-4 shadow-2xs cursor-pointer"
          >
            <Landmark size={16} /> + Post Govt Vacancy
          </button>
          <Link
            to="/employer/post-job"
            className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4 shadow-sm"
          >
            <PlusCircle size={16} /> Post Direct Job
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button
            onClick={() => setActionSuccess("")}
            className="text-emerald-700 hover:text-emerald-950 text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── UNIFIED STICKY NAVIGATION TABS ── */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-gray-200/80 overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard size={15} /> Overview Hub
        </button>

        <button
          type="button"
          onClick={() => setTab("applications")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "applications"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <Users size={15} /> Applications Tracker
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === "applications" ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {applications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("jobs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "jobs"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <Briefcase size={15} /> Platform Jobs
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === "jobs" ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {allJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("approvals")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "approvals"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <Clock size={15} /> Job Moderation Queue
          {pendingJobs.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "approvals" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {pendingJobs.length}
            </span>
          )}
        <button
          type="button"
          onClick={() => setTab("govt-jobs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "govt-jobs"
              ? "bg-purple-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <Landmark size={15} /> Govt Vacancies
          {govtJobs.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "govt-jobs"
                  ? "bg-purple-800 text-white"
                  : "bg-purple-100 text-purple-900 border border-purple-200"
              }`}
            >
              {govtJobs.length}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden lg:block" />

        <button
          type="button"
          onClick={() => setTab("blogs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "blogs"
              ? "bg-blue-900 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <BookOpen size={15} /> Blogs
        </button>

        <button
          type="button"
          onClick={() => setTab("workshops")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "workshops"
              ? "bg-blue-900 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <GraduationCap size={15} /> Workshops
        </button>

        <button
          type="button"
          onClick={() => setTab("testimonials")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "testimonials"
              ? "bg-blue-900 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <MessageSquare size={15} /> Testimonials
        </button>

        <Link
          to="/govt-jobs"
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-purple-900 hover:bg-purple-50 rounded-xl transition-all whitespace-nowrap ml-auto"
        >
          <Landmark size={14} className="text-purple-700" /> Govt Jobs ↗
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: OVERVIEW CONTROL HUB & QUICK ACCESS ACTION CARDS ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metric Numbers */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Platform Users" value={stats.totalUsers} />
              <StatCard label="Active Platform Jobs" value={stats.totalJobs} />
              <StatCard label="Pending Job Moderation" value={stats.pendingJobs} />
              <StatCard label="Candidate Applications" value={stats.totalApplications} />
            </div>
          )}

          {/* Action Portal Navigation Cards */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-display font-bold text-brand-black">Quick Action Management Hub</h2>
              <p className="text-xs text-brand-grey">Select a module to view, manage, and edit records on dedicated views.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Applications Tracker */}
              <div
                onClick={() => setTab("applications")}
                className="card p-6 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users size={22} />
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {applications.length} Applicants
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-brand-green-dark transition-colors">
                    Job Applications Breakdown
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    View how many applicants applied to each job, inspect candidate profiles, and download resumes.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Applications View</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 2: Platform Jobs Manager */}
              <div
                onClick={() => setTab("jobs")}
                className="card p-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase size={22} />
                    </div>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100/60 border border-blue-200 px-2.5 py-1 rounded-full">
                      {allJobs.length} Jobs
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-blue-700 transition-colors">
                    Platform Jobs Manager
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Edit existing job listings, 1-click toggle Featured Gold Badges, status filters, and deletion.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-blue-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Platform Jobs</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 3: Pending Approvals Queue */}
              <div
                onClick={() => setTab("approvals")}
                className="card p-6 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Clock size={22} />
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        pendingJobs.length > 0
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {pendingJobs.length} Pending
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-amber-800 transition-colors">
                    Job Moderation Queue
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Review and approve or reject newly submitted job postings from employers before they go live.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-amber-900 group-hover:translate-x-0.5 transition-transform">
                  <span>Review Job Queue</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 4: Govt Jobs Portal */}
              <div
                onClick={() => setTab("govt-jobs")}
                className="card p-6 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Landmark size={22} />
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-100/60 border border-purple-200 px-2.5 py-1 rounded-full">
                      {govtJobs.length} Vacancies
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-purple-800 transition-colors">
                    Government Vacancies
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Create, update, and manage official state & central agriculture government vacancy notifications with slugs.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-purple-900 group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Govt Vacancies</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 5: Post Direct Job */}
              <Link
                to="/employer/post-job"
                className="card p-6 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PlusCircle size={22} />
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Instant Post
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-brand-green-dark transition-colors">
                    Post Direct Hiring Alert
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Publish direct opportunities or featured hiring posts instantly on behalf of any enterprise or organization.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Create Job Posting</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: JOB MODERATION QUEUE ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-black">Job Moderation & Approvals Queue</h2>
              <p className="text-xs text-brand-grey">Review, approve, or reject newly submitted job opportunities from employers.</p>
            </div>
            <button
              onClick={() => setTab("overview")}
              className="text-xs font-semibold text-brand-grey hover:text-black underline"
            >
              ← Back to Hub
            </button>
          </div>

          {/* Pending Job Approvals Full-Width Card */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm flex items-center justify-between bg-gray-50/50">
              <span className="flex items-center gap-2 font-display font-bold text-brand-black">
                <Clock size={16} className="text-amber-600" />
                Job Postings Awaiting Moderation
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                {pendingJobs.length} Pending
              </span>
            </div>
            <div className="divide-y divide-brand-border">
              {pendingJobs.length === 0 && (
                <div className="p-12 text-center space-y-2">
                  <CheckCircle size={40} className="mx-auto text-brand-green opacity-90" />
                  <p className="text-sm font-semibold text-brand-black">All caught up!</p>
                  <p className="text-xs text-brand-grey">There are currently no job postings awaiting approval.</p>
                </div>
              )}
              {pendingJobs.map((job) => (
                <div key={job._id} className="p-5 space-y-3 hover:bg-gray-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-base text-brand-black">{job.title}</p>
                        {job.featuredRequested && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            <Star size={10} fill="currentColor" /> Boost Requested
                          </span>
                        )}
                        <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md capitalize">
                          {job.employmentType?.replace(/-/g, " ")}
                        </span>
                        {job.category?.name && (
                          <span className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {job.category.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-grey flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-brand-black">{job.companyName || job.employer?.name || "Company"}</span>
                        <span>•</span>
                        <span>{job.location || "Pan-India"}</span>
                        <span>•</span>
                        <span>{job.salaryRange || "Salary Disclosed on Application"}</span>
                        <span>•</span>
                        <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                      </p>
                      {job.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                          {job.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleJobDecision(job._id, "approved", true)}
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Star size={13} fill="currentColor" /> Approve & Boost Featured
                    </button>

                    <button
                      onClick={() => handleJobDecision(job._id, "approved", false)}
                      className="text-xs font-bold bg-brand-green hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle size={13} /> Approve Live
                    </button>

                    <button
                      onClick={() => handleJobDecision(job._id, "rejected")}
                      className="text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <XCircle size={13} /> Reject
                    </button>

                    <Link
                      to={`/employer/post-job?edit=${job._id}`}
                      className="text-xs font-semibold text-gray-600 hover:text-black px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5 ml-auto"
                    >
                      <Edit3 size={13} /> Edit Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: PLATFORM JOBS MANAGEMENT ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-black">All Platform Jobs Management</h2>
              <p className="text-xs text-brand-grey">Edit any job posting, toggle 1-click Featured gold badges, or delete listings.</p>
            </div>
            <button
              onClick={() => setTab("overview")}
              className="text-xs font-semibold text-brand-grey hover:text-black underline"
            >
              ← Back to Hub
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {allJobs.length} Jobs Total
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={jobStatusFilter}
                  onChange={(e) => setJobStatusFilter(e.target.value)}
                  className="input-field text-xs py-2 bg-white w-auto"
                >
                  <option value="all">All Job Statuses</option>
                  <option value="approved">Approved & Live</option>
                  <option value="pending">Pending Moderation</option>
                  <option value="draft">Draft</option>
                  <option value="rejected">Rejected</option>
                </select>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loadPlatformJobs();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    placeholder="Search job title, company..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="input-field text-xs py-2 w-44 sm:w-56"
                  />
                  <button type="submit" className="btn-secondary text-xs py-2 px-3 shrink-0">
                    <Search size={13} />
                  </button>
                </form>
              </div>
            </div>

            {loadingJobs ? (
              <p className="p-8 text-sm text-brand-grey text-center">Loading jobs...</p>
            ) : allJobs.length === 0 ? (
              <p className="p-8 text-sm text-brand-grey text-center">No platform jobs found matching your criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                    <tr>
                      <th className="text-left px-5 py-3">Job Listing & Company</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-center px-5 py-3">Featured Boost</th>
                      <th className="text-right px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allJobs.map((job) => (
                      <tr key={job._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="font-semibold text-brand-black hover:text-brand-green-dark hover:underline flex items-center gap-1"
                            >
                              {job.title}
                            </Link>
                          </div>
                          <p className="text-xs text-brand-grey mt-0.5">
                            {job.companyName || job.employer?.name || "Hiring Company"} {job.location ? `· ${job.location}` : ""}
                          </p>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-brand-grey whitespace-nowrap">
                          {job.category?.name || "General"}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                              job.status === "approved"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                : job.status === "pending"
                                ? "bg-yellow-100 text-yellow-900 border border-yellow-200"
                                : job.status === "rejected"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            ● {job.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleToggleFeatured(job)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                              job.isFeatured
                                ? "bg-amber-400 text-amber-950 border border-amber-500 hover:bg-amber-300"
                                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
                            }`}
                            title={job.isFeatured ? "Click to Remove Featured status" : "Click to Make Featured"}
                          >
                            <Star size={13} fill={job.isFeatured ? "currentColor" : "none"} />
                            {job.isFeatured ? "Featured ⭐" : "Feature"}
                          </button>
                        </td>

                        <td className="px-5 py-3.5 text-right space-x-2">
                          <Link
                            to={`/employer/post-job?edit=${job._id}`}
                            className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 size={13} /> Edit
                          </Link>

                          <button
                            onClick={() => handleDeleteJob(job)}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: JOB APPLICATIONS BREAKDOWN & SEEKER VIEWER ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-black">Job Applications Breakdown</h2>
              <p className="text-xs text-brand-grey">Track how many candidates applied per job and download candidate resumes.</p>
            </div>
            <button
              onClick={() => setTab("overview")}
              className="text-xs font-semibold text-brand-grey hover:text-black underline"
            >
              ← Back to Hub
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-brand-border bg-white flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
              {/* Left: Applicant Counter & View Mode Switcher */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs bg-emerald-50 text-emerald-900 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                  👥 {applications.length} Total Applicants
                </span>

                {/* View Mode Toggle: By Job vs Full Feed */}
                <div className="inline-flex rounded-xl bg-gray-100/90 p-1 border border-gray-200 text-xs font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setAppViewMode("by_job")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      appViewMode === "by_job"
                        ? "bg-white text-emerald-950 shadow-2xs font-bold"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <Briefcase size={13} /> Group by Job ({groupedJobs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppViewMode("all_feed")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      appViewMode === "all_feed"
                        ? "bg-white text-emerald-950 shadow-2xs font-bold"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <Layers size={13} /> Flat Feed ({applications.length})
                  </button>
                </div>
              </div>

              {/* Right: Search, Filter, Export Controls */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loadPlatformApplications();
                  }}
                  className="relative flex-1 sm:flex-initial"
                >
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search applicant, job, company..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-gray-50/80 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </form>

                {/* Status Dropdown */}
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="w-auto px-3 py-1.5 text-xs font-medium bg-gray-50/80 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer transition-all shrink-0"
                >
                  <option value="all">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="viewed">Viewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={() => handleExportCSV(null, "all_applications")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
                  title="Export all filtered applicants to CSV spreadsheet"
                >
                  <FileSpreadsheet size={14} className="text-emerald-700" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {loadingApps ? (
              <p className="p-8 text-sm text-brand-grey text-center">Loading applications...</p>
            ) : appViewMode === "by_job" ? (
              <div className="divide-y divide-brand-border">
                <div className="p-4 bg-gray-50 flex items-center justify-between text-xs text-brand-grey">
                  <span>
                    Showing <strong>{groupedJobs.length}</strong> job postings with candidate breakdown
                  </span>
                  <button
                    onClick={() => toggleExpandAll(groupedJobs.map((j) => j.jobId.toString()))}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    {expandedJobIds.size === groupedJobs.length ? "Collapse All" : "Expand All Applicants"}
                  </button>
                </div>

                {groupedJobs.length === 0 ? (
                  <p className="p-8 text-sm text-brand-grey text-center">No job postings found matching your search.</p>
                ) : (
                  groupedJobs.map((group) => {
                    const isExpanded = expandedJobIds.has(group.jobId.toString());
                    const count = group.applicants.length;

                    return (
                      <div key={group.jobId} className="transition-colors hover:bg-gray-50/40">
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                to={`/jobs/${group.jobId}`}
                                className="font-display font-bold text-base text-brand-black hover:text-brand-green-dark hover:underline flex items-center gap-1.5"
                              >
                                {group.title} <ExternalLink size={13} className="text-brand-grey shrink-0" />
                              </Link>

                              {group.isFeatured && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                                  ⭐ Featured
                                </span>
                              )}

                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                                  group.status === "approved"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : group.status === "pending"
                                    ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {group.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-grey">
                              <span className="font-semibold text-emerald-950 flex items-center gap-1">
                                <Building2 size={13} className="text-emerald-700" /> {group.companyName}
                              </span>
                              {group.location && <span>• {group.location}</span>}
                              <span>• {group.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div
                              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
                                count > 0
                                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                  : "bg-gray-50 text-gray-500 border-gray-200"
                              }`}
                            >
                              <Users size={14} className={count > 0 ? "text-emerald-700" : "text-gray-400"} />
                              <span>
                                {count} {count === 1 ? "Applicant" : "Applicants"}
                              </span>
                            </div>

                            {count > 0 && (
                              <button
                                type="button"
                                onClick={() => handleExportCSV(group.applicants, group.title)}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-emerald-900 border border-gray-200 text-xs font-bold flex items-center gap-1 transition-colors"
                                title={`Export ${count} applicants for ${group.title} to CSV`}
                              >
                                <FileSpreadsheet size={13} className="text-emerald-700" />
                                <span className="hidden sm:inline">CSV</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleExpandJob(group.jobId.toString())}
                              className={`btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 ${
                                isExpanded ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-white"
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  Hide Applicants <ChevronUp size={14} />
                                </>
                              ) : (
                                <>
                                  View Applicants ({count}) <ChevronDown size={14} />
                                </>
                              )}
                            </button>

                            <Link
                              to={`/employer/jobs/${group.jobId}/applicants`}
                              className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-2 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                            >
                              Manage ↗
                            </Link>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-emerald-50/20 border-t border-brand-border p-4 sm:p-5">
                            {group.applicants.length === 0 ? (
                              <div className="py-6 text-center text-xs text-brand-grey bg-white rounded-xl border border-dashed border-brand-border">
                                No applicants have applied for this position yet.
                              </div>
                            ) : (
                              <div className="overflow-x-auto bg-white rounded-xl border border-brand-border shadow-2xs">
                                <table className="w-full text-xs">
                                  <thead className="bg-gray-50 text-brand-grey font-bold uppercase tracking-wider border-b border-brand-border">
                                    <tr>
                                      <th className="text-left px-4 py-3">Applicant</th>
                                      <th className="text-left px-4 py-3">Contact</th>
                                      <th className="text-left px-4 py-3">Applied On</th>
                                      <th className="text-left px-4 py-3">Status</th>
                                      <th className="text-left px-4 py-3">Cover Note</th>
                                      <th className="text-right px-4 py-3">Resume Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-brand-border">
                                    {group.applicants.map((app) => {
                                      const backendBase = (
                                        import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
                                      ).replace(/\/api\/?$/, "");

                                      let downloadUrl = app.resumeUrl ? app.resumeUrl.trim() : "";
                                      downloadUrl = downloadUrl.replace(/^https?:\/\/\/+/, "/");

                                      if (downloadUrl.startsWith("/uploads/")) {
                                        downloadUrl = `${backendBase}${downloadUrl}`;
                                      } else if (
                                        !downloadUrl.startsWith("http://") &&
                                        !downloadUrl.startsWith("https://") &&
                                        downloadUrl.length > 0
                                      ) {
                                        downloadUrl = `https://${downloadUrl}`;
                                      } else if (!downloadUrl) {
                                        downloadUrl = `${backendBase}/api/applications/${app._id}/resume`;
                                      }

                                      return (
                                        <tr key={app._id} className="hover:bg-gray-50/70 transition-colors">
                                          <td className="px-4 py-3 font-bold text-brand-black">
                                            {app.seeker?.name || "Applicant"}
                                          </td>
                                          <td className="px-4 py-3 text-brand-grey">
                                            <p>{app.seeker?.email}</p>
                                            {app.seeker?.phone && <p className="text-[11px]">📞 {app.seeker.phone}</p>}
                                          </td>
                                          <td className="px-4 py-3 text-brand-grey whitespace-nowrap">
                                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                                app.status === "shortlisted"
                                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                                  : app.status === "hired"
                                                  ? "bg-purple-100 text-purple-900 border border-purple-200"
                                                  : app.status === "rejected"
                                                  ? "bg-red-100 text-red-800 border border-red-200"
                                                  : app.status === "viewed"
                                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}
                                            >
                                              ● {app.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate italic">
                                            {app.coverNote || "-"}
                                          </td>
                                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setPreviewApp({
                                                  ...app,
                                                  jobTitle: group.title,
                                                })
                                              }
                                              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                                              title="Preview resume inside browser"
                                            >
                                              <Eye size={12} className="text-emerald-700" /> Preview
                                            </button>

                                            <a
                                              href={downloadUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                                            >
                                              <Download size={12} /> Resume
                                            </a>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                    <tr>
                      <th className="text-left px-5 py-3">Candidate</th>
                      <th className="text-left px-5 py-3">Target Company & Role</th>
                      <th className="text-left px-5 py-3">Applied On</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-right px-5 py-3">Resume Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const backendBase = (
                        import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
                      ).replace(/\/api\/?$/, "");

                      let downloadUrl = app.resumeUrl ? app.resumeUrl.trim() : "";
                      downloadUrl = downloadUrl.replace(/^https?:\/\/\/+/, "/");

                      if (downloadUrl.startsWith("/uploads/")) {
                        downloadUrl = `${backendBase}${downloadUrl}`;
                      } else if (
                        !downloadUrl.startsWith("http://") &&
                        !downloadUrl.startsWith("https://") &&
                        downloadUrl.length > 0
                      ) {
                        downloadUrl = `https://${downloadUrl}`;
                      } else if (!downloadUrl) {
                        downloadUrl = `${backendBase}/api/applications/${app._id}/resume`;
                      }

                      const companyName =
                        app.job?.companyName || app.job?.employer?.name || "Hiring Company";

                      return (
                        <tr key={app._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-brand-black">{app.seeker?.name || "Applicant"}</p>
                            <p className="text-xs text-brand-grey mt-0.5">{app.seeker?.email}</p>
                            {app.seeker?.phone && <p className="text-[11px] text-brand-grey">📞 {app.seeker.phone}</p>}
                          </td>

                          <td className="px-5 py-3.5">
                            {app.job ? (
                              <Link
                                to={`/jobs/${app.job._id}`}
                                className="font-semibold text-brand-black hover:text-brand-green-dark hover:underline flex items-center gap-1.5"
                              >
                                {app.job.title} <ExternalLink size={11} className="text-brand-grey shrink-0" />
                              </Link>
                            ) : (
                              <p className="font-semibold text-brand-grey">Job closed / removed</p>
                            )}
                            <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 size={13} className="text-emerald-700 shrink-0" />
                              {companyName} {app.job?.location ? `· ${app.job.location}` : ""}
                            </p>
                          </td>

                          <td className="px-5 py-3.5 text-xs text-brand-grey whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-brand-grey shrink-0" />
                              {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                                app.status === "shortlisted"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                  : app.status === "hired"
                                  ? "bg-purple-100 text-purple-900 border border-purple-200"
                                  : app.status === "rejected"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : app.status === "viewed"
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              ● {app.status}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewApp(app)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                              title="Preview resume inside browser"
                            >
                              <Eye size={13} className="text-emerald-700" /> Preview
                            </button>

                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                            >
                              <Download size={13} /> Resume
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB: GOVERNMENT AGRICULTURE VACANCIES ─────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "govt-jobs" && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-brand-black flex items-center gap-2">
                <Landmark size={22} className="text-purple-700" />
                Government Agriculture Vacancies
              </h2>
              <p className="text-xs text-brand-grey mt-0.5">
                Publish, manage, and edit central & state government recruitment notices with SEO-friendly slugs and official links.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/govt-jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5"
                title="View live government jobs portal"
              >
                View Public Portal <ExternalLink size={13} />
              </Link>
              <button
                type="button"
                onClick={handleOpenCreateGovtJob}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle size={15} /> Post New Vacancy
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 bg-white border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-brand-grey uppercase tracking-wider">Total Notices</p>
                <p className="text-2xl font-bold font-display text-brand-black mt-1">{govtJobs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Landmark size={18} />
              </div>
            </div>

            <div className="card p-4 bg-white border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-brand-grey uppercase tracking-wider">Active Openings</p>
                <p className="text-2xl font-bold font-display text-emerald-700 mt-1">
                  {govtJobs.filter((j) => j.status === "Active").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle size={18} />
              </div>
            </div>

            <div className="card p-4 bg-white border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-brand-grey uppercase tracking-wider">Closing Soon</p>
                <p className="text-2xl font-bold font-display text-amber-700 mt-1">
                  {govtJobs.filter((j) => j.status === "Closing Soon").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>

            <div className="card p-4 bg-white border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-brand-grey uppercase tracking-wider">Upcoming</p>
                <p className="text-2xl font-bold font-display text-blue-700 mt-1">
                  {govtJobs.filter((j) => j.status === "Upcoming").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="card p-4 bg-white border border-gray-200">
            <form onSubmit={handleSearchGovtSubmit} className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by vacancy title, organization, or state..."
                  value={govtSearch}
                  onChange={(e) => setGovtSearch(e.target.value)}
                  className="input-field pl-10 text-xs py-2.5 w-full bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={govtCategoryFilter}
                  onChange={(e) => setGovtCategoryFilter(e.target.value)}
                  className="input-field text-xs py-2.5 px-3 bg-white border-gray-200"
                >
                  <option value="All">All Categories</option>
                  <option value="Central Govt">Central Govt</option>
                  <option value="State Govt">State Govt</option>
                  <option value="Banking & NABARD">Banking & NABARD</option>
                  <option value="Research & ICAR">Research & ICAR</option>
                  <option value="PSU & Corporations">PSU & Corporations</option>
                </select>

                <button
                  type="submit"
                  className="btn-secondary text-xs py-2.5 px-4 font-semibold shrink-0 cursor-pointer"
                >
                  Search
                </button>

                {(govtSearch || govtCategoryFilter !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setGovtSearch("");
                      setGovtCategoryFilter("All");
                      fetchGovtJobs({}).then((data) => setGovtJobs(Array.isArray(data) ? data : []));
                    }}
                    className="text-xs text-brand-grey hover:text-black underline px-2 shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Vacancies Table */}
          <div className="card overflow-hidden bg-white border border-gray-200">
            {loadingGovtJobs ? (
              <div className="py-20 text-center text-xs text-brand-grey flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-purple-700" />
                <span>Loading government vacancies...</span>
              </div>
            ) : govtJobs.length === 0 ? (
              <div className="py-16 text-center text-brand-grey space-y-3">
                <Landmark size={36} className="mx-auto text-gray-300" />
                <p className="font-semibold text-brand-black">No government vacancies found.</p>
                <p className="text-xs max-w-sm mx-auto text-gray-500">
                  {govtSearch || govtCategoryFilter !== "All"
                    ? "Try adjusting your search filters or keyword criteria."
                    : "Get started by publishing the first official government agriculture recruitment notice."}
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateGovtJob}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 mt-2"
                >
                  <PlusCircle size={14} /> Post Govt Vacancy
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Vacancy & Permalink</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Category & State</th>
                      <th className="px-5 py-3.5">Vacancies / Pay</th>
                      <th className="px-5 py-3.5">Deadline</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {govtJobs.map((job) => {
                      const identifier = job.slug || job._id;
                      const detailUrl = `/govt-jobs/${identifier}`;
                      return (
                        <tr key={job._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-5 py-4 max-w-xs">
                            <div className="space-y-1">
                              <Link
                                to={detailUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-brand-black hover:text-purple-800 transition-colors line-clamp-1 block text-sm"
                                title={job.title}
                              >
                                {job.title}
                              </Link>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
                                <span className="truncate max-w-[170px] text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded">
                                  /govt-jobs/{job.slug || job._id.slice(-6)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyGovtLink(job)}
                                  className="text-gray-400 hover:text-emerald-700 transition-colors p-0.5"
                                  title="Copy permalink"
                                >
                                  {copiedGovtId === job._id ? (
                                    <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>
                                  ) : (
                                    <FileText size={12} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-brand-grey font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Landmark size={14} className="text-purple-700 shrink-0" />
                              <span className="max-w-[160px] truncate" title={job.organization}>
                                {job.organization}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className="inline-block text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                {job.category}
                              </span>
                              <p className="text-[11px] text-brand-grey flex items-center gap-1">
                                <MapPin size={11} className="text-gray-400 shrink-0" />
                                <span className="truncate max-w-[120px]">{job.state || "All India"}</span>
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <p className="font-bold text-brand-black">{job.vacancies || "Not Specified"}</p>
                              <p className="text-[11px] text-brand-grey truncate max-w-[140px]">{job.salary}</p>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-brand-black">{job.applicationDeadline}</p>
                              {job.examDate && (
                                <p className="text-[11px] text-brand-grey truncate max-w-[130px]">
                                  Exam: {job.examDate}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                job.status === "Closing Soon"
                                  ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                                  : job.status === "Upcoming"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
                              }`}
                            >
                              ● {job.status || "Active"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                to={detailUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                                title="View public detail page"
                              >
                                <ExternalLink size={13} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleOpenEditGovtJob(job)}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Edit vacancy notice"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGovtJob(job)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete vacancy notice"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB: BLOGS CMS ──────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "blogs" && (
        <CmsPanel
          type="blog"
          items={cmsBlogs}
          loading={cmsLoading}
          onLoad={() => { setCmsLoading(true); fetchAllBlogs().then(setCmsBlogs).catch(() => setCmsBlogs([])).finally(() => setCmsLoading(false)); }}
          onDelete={async (id) => { await deleteBlog(id); setCmsBlogs(cmsBlogs.filter(b => b._id !== id)); setActionSuccess("Blog deleted"); setTimeout(() => setActionSuccess(""), 3000); }}
          onSave={async (item, isNew) => {
            if (isNew) { const created = await createBlog(item); setCmsBlogs([created, ...cmsBlogs]); }
            else { const updated = await updateBlog(item._id, item); setCmsBlogs(cmsBlogs.map(b => b._id === updated._id ? updated : b)); }
            setActionSuccess(isNew ? "Blog created!" : "Blog updated!"); setTimeout(() => setActionSuccess(""), 3000);
          }}
          fields={[
            { key: "title", label: "Title", type: "text", required: true },
            { key: "slug", label: "Slug (Auto-generated if blank)", type: "text" },
            {
              key: "targetSite",
              label: "Display Destination",
              type: "select",
              options: [
                { label: "🌐 Both (Main Website & Job Portal)", value: "both" },
                { label: "🏠 Main Website Only (Landing Page)", value: "landing" },
                { label: "💼 Job Portal Only", value: "jobs" },
              ],
              defaultValue: "both",
            },
            { key: "coverImage", label: "Cover Image", type: "image" },
            { key: "excerpt", label: "Excerpt / Short Description", type: "textarea" },
            { key: "content", label: "Content", type: "richtext", required: true },
            { key: "author", label: "Author", type: "text" },
            { key: "tags", label: "Tags (comma-separated)", type: "tags" },
            { key: "isPublished", label: "Published", type: "toggle" },
          ]}
          columns={["title", "targetSite", "author", "isPublished", "createdAt"]}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB: WORKSHOPS CMS ──────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "workshops" && (
        <CmsPanel
          type="workshop"
          items={cmsWorkshops}
          loading={cmsLoading}
          onLoad={() => { setCmsLoading(true); fetchAllWorkshops().then(setCmsWorkshops).catch(() => setCmsWorkshops([])).finally(() => setCmsLoading(false)); }}
          onDelete={async (id) => { await deleteWorkshop(id); setCmsWorkshops(cmsWorkshops.filter(w => w._id !== id)); setActionSuccess("Workshop deleted"); setTimeout(() => setActionSuccess(""), 3000); }}
          onSave={async (item, isNew) => {
            if (isNew) { const created = await createWorkshop(item); setCmsWorkshops([created, ...cmsWorkshops]); }
            else { const updated = await updateWorkshop(item._id, item); setCmsWorkshops(cmsWorkshops.map(w => w._id === updated._id ? updated : w)); }
            setActionSuccess(isNew ? "Workshop created!" : "Workshop updated!"); setTimeout(() => setActionSuccess(""), 3000);
          }}
          fields={[
            { key: "title", label: "Title", type: "text", required: true },
            { key: "slug", label: "Slug", type: "text" },
            { key: "description", label: "Description", type: "textarea", required: true },
            { key: "category", label: "Category", type: "text" },
            { key: "instructor", label: "Instructor", type: "text" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "videoUrl", label: "YouTube Video URL", type: "text" },
            { key: "coverImage", label: "Cover Image URL", type: "text" },
            { key: "order", label: "Display Order", type: "number" },
            { key: "isActive", label: "Active", type: "toggle" },
          ]}
          columns={["title", "category", "duration", "isActive"]}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB: TESTIMONIALS CMS ───────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "testimonials" && (
        <CmsPanel
          type="testimonial"
          items={cmsTestimonials}
          loading={cmsLoading}
          onLoad={() => { setCmsLoading(true); fetchAllTestimonials().then(setCmsTestimonials).catch(() => setCmsTestimonials([])).finally(() => setCmsLoading(false)); }}
          onDelete={async (id) => { await deleteTestimonial(id); setCmsTestimonials(cmsTestimonials.filter(t => t._id !== id)); setActionSuccess("Testimonial deleted"); setTimeout(() => setActionSuccess(""), 3000); }}
          onSave={async (item, isNew) => {
            if (isNew) { const created = await createTestimonial(item); setCmsTestimonials([created, ...cmsTestimonials]); }
            else { const updated = await updateTestimonial(item._id, item); setCmsTestimonials(cmsTestimonials.map(t => t._id === updated._id ? updated : t)); }
            setActionSuccess(isNew ? "Testimonial created!" : "Testimonial updated!"); setTimeout(() => setActionSuccess(""), 3000);
          }}
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "role", label: "Role / Title", type: "text" },
            {
              key: "targetSite",
              label: "Display Destination",
              type: "select",
              options: [
                { label: "🌐 Both (Main Website & Job Portal)", value: "both" },
                { label: "🏠 Main Website Only (Landing Page)", value: "landing" },
                { label: "💼 Job Portal Only", value: "jobs" },
              ],
              defaultValue: "both",
            },
            { key: "content", label: "Testimonial Text", type: "textarea", required: true },
            { key: "rating", label: "Rating (1-5)", type: "number" },
            { key: "avatarUrl", label: "Avatar / Photo", type: "image" },
            { key: "order", label: "Display Order", type: "number" },
            { key: "isActive", label: "Active", type: "toggle" },
          ]}
          columns={["name", "targetSite", "role", "rating", "isActive"]}
        />
      )}

      {/* Resume In-Browser Preview Modal */}
      {previewApp && (
        <ResumePreviewModal
          application={previewApp}
          onClose={() => setPreviewApp(null)}
        />
      )}

      {/* ── GOVT VACANCY CREATE / EDIT MODAL (ADMIN) ── */}
      {govtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <h2 className="font-display font-bold text-xl text-brand-black flex items-center gap-2">
                  <Landmark size={20} className="text-purple-700" />
                  {editingGovtJob ? "Edit Government Vacancy Notice" : "Post Official Government Vacancy"}
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  {editingGovtJob
                    ? `Updating notice for "${editingGovtJob.title}"`
                    : "This notice will appear in real time on the job portal with an SEO-optimized detail page."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGovtModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {govtError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <XCircle size={15} className="shrink-0" />
                <span>{govtError}</span>
              </div>
            )}

            <form onSubmit={handleSaveGovtJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-brand-grey uppercase">Job Title / Designation *</label>
                  <input
                    required
                    placeholder="e.g. Agriculture Field Officer (AFO Scale-I) 2026"
                    className="input-field mt-1 text-sm"
                    value={govtForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setGovtForm((prev) => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slugModified ? prev.slug : slugify(newTitle),
                      }));
                    }}
                  />
                </div>

                <div className="sm:col-span-2 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-purple-950 uppercase text-[11px] flex items-center gap-1.5">
                      <span>🔗 Permanent URL Slug (SEO & Social Sharing Link)</span>
                    </label>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full">
                      Custom URL
                    </span>
                  </div>
                  <div className="flex items-center rounded-xl bg-white border border-purple-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent overflow-hidden shadow-2xs">
                    <span className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs font-mono text-gray-500 select-none whitespace-nowrap">
                      /govt-jobs/
                    </span>
                    <input
                      placeholder="ibps-afo-scale-1-2026"
                      className="w-full px-3 py-2 text-xs font-mono font-semibold text-purple-950 focus:outline-none bg-transparent"
                      value={govtForm.slug || ""}
                      onChange={(e) =>
                        setGovtForm((prev) => ({
                          ...prev,
                          slug: slugify(e.target.value),
                          slugModified: true,
                        }))
                      }
                    />
                  </div>
                  <p className="text-[11px] text-purple-800/80 leading-tight">
                    Auto-generated from title. Creates a clean permalink for WhatsApp sharing and search engine indexing.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Department / Organization *</label>
                  <input
                    required
                    placeholder="e.g. IBPS / NABARD / ICAR / UPPSC"
                    className="input-field mt-1 text-sm"
                    value={govtForm.organization}
                    onChange={(e) => setGovtForm({ ...govtForm, organization: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Category *</label>
                  <select
                    className="input-field mt-1 text-sm bg-white"
                    value={govtForm.category}
                    onChange={(e) => setGovtForm({ ...govtForm, category: e.target.value })}
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
                    value={govtForm.qualification}
                    onChange={(e) => setGovtForm({ ...govtForm, qualification: e.target.value })}
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
                    value={govtForm.state}
                    onChange={(e) => setGovtForm({ ...govtForm, state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Total Vacancies (Optional)</label>
                  <input
                    placeholder="e.g. 896 Posts"
                    className="input-field mt-1 text-sm"
                    value={govtForm.vacancies}
                    onChange={(e) => setGovtForm({ ...govtForm, vacancies: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Salary / Pay Scale *</label>
                  <input
                    required
                    placeholder="e.g. ₹48,480 - ₹85,920 / month"
                    className="input-field mt-1 text-sm"
                    value={govtForm.salary}
                    onChange={(e) => setGovtForm({ ...govtForm, salary: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Application Deadline *</label>
                  <input
                    required
                    placeholder="e.g. 31 Oct 2026"
                    className="input-field mt-1 text-sm"
                    value={govtForm.applicationDeadline}
                    onChange={(e) => setGovtForm({ ...govtForm, applicationDeadline: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-grey uppercase">Exam Date / Selection Process</label>
                  <input
                    placeholder="e.g. Prelims: Dec 2026 | Mains: Jan 2027"
                    className="input-field mt-1 text-sm"
                    value={govtForm.examDate}
                    onChange={(e) => setGovtForm({ ...govtForm, examDate: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-brand-grey uppercase">Official Notification PDF Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://official-dept.gov.in/notification.pdf"
                    className="input-field mt-1 text-sm"
                    value={govtForm.notificationUrl}
                    onChange={(e) => setGovtForm({ ...govtForm, notificationUrl: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-brand-grey uppercase">Online Application Portal Link (URL) *</label>
                  <input
                    required
                    type="url"
                    placeholder="https://ibpsonline.ibps.in/..."
                    className="input-field mt-1 text-sm"
                    value={govtForm.applyUrl}
                    onChange={(e) => setGovtForm({ ...govtForm, applyUrl: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-brand-grey uppercase">Status</label>
                  <select
                    className="input-field mt-1 text-sm bg-white"
                    value={govtForm.status}
                    onChange={(e) => setGovtForm({ ...govtForm, status: e.target.value })}
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
                    placeholder="Summary of post, age criteria, key eligibility, and selection stages..."
                    className="input-field mt-1 text-sm"
                    value={govtForm.description}
                    onChange={(e) => setGovtForm({ ...govtForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setGovtModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-grey hover:text-black font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={savingGovt}
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {savingGovt ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving Notice...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> {editingGovtJob ? "Update Vacancy Notice" : "Publish Vacancy Notice"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs text-brand-grey uppercase font-semibold">{label}</p>
    <p className="text-3xl font-display font-bold mt-2">{value}</p>
  </div>
);

/* ─── Reusable CMS Panel Component ─────────────────────── */
const CmsPanel = ({ type, items, loading, onLoad, onDelete, onSave, fields, columns }) => {
  const [editing, setEditing] = useState(null); // null = list view, {} = new, {...} = editing
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => { onLoad(); }, []);

  const handleFileUpload = async (fieldKey, file) => {
    if (!file) return;
    setUploadingField(fieldKey);
    try {
      const res = await uploadBlogImage(file);
      if (res?.imageUrl) {
        setForm(prev => ({ ...prev, [fieldKey]: res.imageUrl }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingField(null);
    }
  };

  const startNew = () => {
    const defaults = {};
    fields.forEach(f => {
      if (f.type === "toggle") defaults[f.key] = true;
      else if (f.type === "number") defaults[f.key] = 0;
      else if (f.type === "tags") defaults[f.key] = [];
      else if (f.type === "select") defaults[f.key] = f.defaultValue || f.options?.[0]?.value || "";
      else defaults[f.key] = "";
    });
    setForm(defaults);
    setEditing("new");
  };

  const startEdit = (item) => {
    const data = { ...item };
    fields.forEach(f => {
      if (f.type === "tags" && Array.isArray(data[f.key])) data[f.key] = data[f.key].join(", ");
    });
    setForm(data);
    setEditing(item._id);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      fields.forEach(f => {
        if (f.type === "tags" && typeof payload[f.key] === "string") {
          payload[f.key] = payload[f.key].split(",").map(t => t.trim()).filter(Boolean);
        }
        if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
      });
      await onSave(payload, editing === "new");
      setEditing(null);
      setForm({});
    } catch (err) {
      alert(err.response?.data?.message || `Failed to save ${type}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    try { await onDelete(id); } catch { alert(`Failed to delete ${type}`); }
  };

  const formatCell = (item, col) => {
    const val = item[col];
    if (col === "isPublished" || col === "isActive") return val ? "✅ Yes" : "❌ No";
    if (col === "targetSite") {
      if (val === "landing") return "🏠 Main Site";
      if (val === "jobs") return "💼 Job Portal";
      return "🌐 Both Sites";
    }
    if (col === "createdAt") return new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    if (col === "rating") return "⭐".repeat(val || 0);
    if (typeof val === "string" && val.length > 50) return val.substring(0, 50) + "...";
    return val ?? "—";
  };

  // ── Edit Form View ──
  if (editing !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold capitalize">{editing === "new" ? `New ${type}` : `Edit ${type}`}</h2>
          <button onClick={() => { setEditing(null); setForm({}); }} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"><X size={14} /> Cancel</button>
        </div>
        <div className="card p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
              {f.type === "richtext" ? (
                <RichTextEditor
                  value={form[f.key] || ""}
                  onChange={val => setForm({ ...form, [f.key]: val })}
                  rows={8}
                />
              ) : f.type === "textarea" ? (
                <textarea
                  value={form[f.key] || ""}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              ) : f.type === "select" ? (
                <select
                  value={form[f.key] || f.defaultValue || (f.options?.[0]?.value ?? "")}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                >
                  {f.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "image" ? (
                <div className="space-y-2">
                  {form[f.key] ? (
                    <div className="relative inline-block border border-gray-200 rounded-xl overflow-hidden group bg-gray-50 p-2">
                      <div className="aspect-[16/9] w-56 sm:w-64 rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
                        <img
                          src={form[f.key]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 px-1 text-xs text-gray-500">
                        <span className="truncate max-w-[200px] font-mono text-[11px]">{form[f.key]}</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, [f.key]: "" })}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                      {uploadingField === f.key ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-emerald-600" />
                          <span>Uploading image...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="text-emerald-700" />
                          <span>Upload direct image (PNG, JPG, WebP)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingField === f.key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(f.key, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <span className="text-xs text-gray-400">or paste URL:</span>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={form[f.key] || ""}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="flex-1 min-w-[200px] px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    💡 Uniform 16:9 widescreen ratio (e.g., 1280×720 or 1920×1080) is recommended for best presentation.
                  </p>
                </div>
              ) : f.type === "toggle" ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [f.key]: !form[f.key] })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    form[f.key] ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {form[f.key] ? "✅ Yes" : "❌ No"}
                </button>
              ) : f.type === "number" ? (
                <input
                  type="number"
                  value={form[f.key] ?? 0}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.key] || ""}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder={f.type === "tags" ? "tag1, tag2, tag3" : ""}
                />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm flex items-center gap-2 py-2.5 px-6"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditing(null); setForm({}); }} className="btn-secondary text-sm py-2.5 px-6">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold capitalize">{type}s Management</h2>
        <button onClick={startNew} className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4">
          <PlusCircle size={15} /> New {type}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(n => <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-gray-500">No {type}s yet. Create your first one!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map(col => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500 tracking-wider capitalize">{col.replace(/([A-Z])/g, " $1")}</th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    {columns.map(col => (
                      <td key={col} className="px-4 py-3 text-sm text-gray-700">{formatCell(item, col)}</td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(item)} className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"><Edit3 size={12} /> Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"><Trash2 size={12} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
