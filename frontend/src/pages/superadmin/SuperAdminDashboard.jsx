import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PlusCircle,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Users,
  Search,
  Download,
  Building2,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Briefcase,
  LayoutDashboard,
  ArrowRight,
  Landmark,
  Edit3,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import ResumePreviewModal from "../../components/ResumePreviewModal.jsx";
import {
  fetchPlatformStats,
  fetchUsers,
  fetchAllApplications,
  fetchAllPlatformJobs,
  updateUserStatus,
  createAdmin,
  updateUserRole,
} from "../../services/adminService.js";

const SuperAdminDashboard = () => {
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
  const [users, setUsers] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // Platform Applications State
  const [allJobs, setAllJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [loadingApps, setLoadingApps] = useState(false);
  const [appViewMode, setAppViewMode] = useState("by_job");
  const [expandedJobIds, setExpandedJobIds] = useState(new Set());
  const [previewApp, setPreviewApp] = useState(null);

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

    return list.sort((a, b) => b.applicants.length - a.applicants.length || new Date(b.createdAt) - new Date(a.createdAt));
  }, [allJobs, applications, appSearch]);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchUsers().then(setUsers).catch(() => {});
    fetchAllPlatformJobs().then(setAllJobs).catch(() => setAllJobs([]));
    loadPlatformApplications();
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

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadPlatformApplications();
  }, [appStatusFilter]);

  const handleStatusToggle = async (user) => {
    const next = user.status === "active" ? "suspended" : "active";
    await updateUserStatus(user._id, next);
    loadAll();
  };

  const handleRoleToggle = async (user, newRole) => {
    if (!window.confirm(`Are you sure you want to change ${user.name}'s role to "${newRole}"?`)) return;
    try {
      await updateUserRole(user._id, newRole);
      setSuccessMsg(`Role for ${user.name} updated to "${newRole}".`);
      setTimeout(() => setSuccessMsg(""), 4000);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleUpgradeAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoadingAction(true);
    try {
      const res = await createAdmin({ email: adminEmail });
      setSuccessMsg(res.message || "User successfully upgraded to Admin! ✉️ Confirmation email sent.");
      setShowAdminForm(false);
      setAdminEmail("");
      loadAll();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upgrade user to Admin");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Super Admin Control Hub</h1>
          <p className="text-sm text-brand-grey">
            Full platform authority, admin permissions, user management, and moderation oversight.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/employer/post-job"
            className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4 shadow-sm"
          >
            <PlusCircle size={16} /> Post Direct Job
          </Link>
          <button
            onClick={() => {
              setTab("users");
              setShowAdminForm(true);
              setError("");
            }}
            className="btn-secondary text-sm flex items-center gap-2 py-2.5 px-4 shadow-2xs"
          >
            <ShieldCheck size={16} className="text-brand-green" /> + Upgrade User to Admin
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── TOP NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard size={15} /> Control Center Hub
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
          <Users size={15} /> Job Applications
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "applications" ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {applications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "users"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <ShieldCheck size={15} /> User & Admin Access
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "users" ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {users.length}
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
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "jobs" ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {allJobs.length}
          </span>
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
          {/* Metrics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Registered Users" value={stats.totalUsers} />
              <StatCard label="Employer Accounts" value={stats.totalEmployers} />
              <StatCard label="Job Seekers" value={stats.totalSeekers} />
              <StatCard label="Platform Applications" value={stats.totalApplications} />
            </div>
          )}

          {/* Action Portal Navigation Cards */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-display font-bold text-brand-black">Super Admin Command Center</h2>
              <p className="text-xs text-brand-grey">Direct access to manage user permissions, monitor company applications, and moderate listings.</p>
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
                    View candidate counts grouped by job posting, review applicant contact details, and stream resumes.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Applications View</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 2: User & Admin Permissions */}
              <div
                onClick={() => setTab("users")}
                className="card p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck size={22} />
                    </div>
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-100/60 border border-indigo-200 px-2.5 py-1 rounded-full">
                      {users.length} Users
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-indigo-800 transition-colors">
                    User Roles & Admin Elevation
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Grant admin privileges with email notification, suspend accounts, and demote with role restoration.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-indigo-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Users & Roles</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 3: Platform Jobs Manager */}
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
                    All Platform Jobs
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Review, edit, feature boost, or delete job postings across employers and direct platform listings.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-blue-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Platform Jobs</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 4: Govt Jobs Portal */}
              <Link
                to="/govt-jobs"
                className="card p-6 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Landmark size={22} />
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-100/60 border border-purple-200 px-2.5 py-1 rounded-full">
                      Govt Portal
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-purple-800 transition-colors">
                    Government Vacancies
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Create, update, and manage official agriculture government vacancy announcements.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-purple-900 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Govt Jobs Portal</span>
                  <ExternalLink size={14} />
                </div>
              </Link>

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
                    Publish direct opportunities or featured hiring posts instantly for any company or client.
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
      {/* ── TAB 2: USER & ADMIN ACCESS MANAGEMENT ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-brand-black">User Roles & Admin Permissions</h2>
              <p className="text-xs text-brand-grey">Promote users to Admin, restore previous roles, and suspend/reactivate accounts.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5"
              >
                <ShieldCheck size={14} /> {showAdminForm ? "Close Form" : "+ Upgrade User to Admin"}
              </button>
              <button
                onClick={() => setTab("overview")}
                className="text-xs font-semibold text-brand-grey hover:text-black underline"
              >
                ← Back to Hub
              </button>
            </div>
          </div>

          {showAdminForm && (
            <div className="card p-6 border-2 border-emerald-100 bg-emerald-50/20 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2">
                    <ShieldCheck size={18} className="text-brand-green" /> Upgrade Registered User to Admin
                  </h3>
                  <p className="text-xs text-brand-grey mt-0.5">
                    The user must have an existing registered account. Once upgraded, they can log in using their own email and password to access the Admin Panel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="text-xs text-brand-grey hover:text-brand-black"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleUpgradeAdmin} className="flex flex-col sm:flex-row gap-3">
                <input
                  required
                  type="email"
                  placeholder="Enter registered user's email address (e.g. name@gmail.com)"
                  className="input-field text-sm bg-white flex-1"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <button
                  disabled={loadingAction}
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-5 shrink-0 flex items-center justify-center gap-1.5"
                >
                  {loadingAction ? "Upgrading..." : "Grant Admin Privileges"}
                </button>
              </form>

              {error && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle size={14} /> {error}
                </p>
              )}
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm flex items-center justify-between">
              <span>All Registered Users ({users.length})</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                  <tr>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Role Actions</th>
                    <th className="text-right px-5 py-3">Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-brand-black">{u.name}</td>
                      <td className="px-5 py-3 text-brand-grey">{u.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md capitalize ${
                            u.role === "superadmin"
                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                              : u.role === "admin"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : u.role === "employer"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            u.status === "active"
                              ? "bg-brand-green-light text-brand-green-dark"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {u.role === "admin" ? (
                          (() => {
                            const originalRole =
                              u.originalRole || u.previousRole || (u.hasEmployerProfile ? "employer" : "seeker");
                            return (
                              <div className="inline-flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => handleRoleToggle(u, originalRole)}
                                  className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                                  title={`Restore ${u.name} back to original role: ${originalRole === "employer" ? "Employer" : "Job Seeker"}`}
                                >
                                  <ShieldAlert size={13} className="text-amber-600" /> Demote to {originalRole === "employer" ? "Employer" : "Seeker"}
                                </button>
                              </div>
                            );
                          })()
                        ) : u.role !== "superadmin" ? (
                          <button
                            onClick={() => handleRoleToggle(u, "admin")}
                            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                            title="Grant full Admin privileges"
                          >
                            <ShieldCheck size={13} className="text-emerald-600" /> Make Admin
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Primary Owner</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {u.role !== "superadmin" && (
                          <button
                            onClick={() => handleStatusToggle(u)}
                            className={`text-xs font-semibold hover:underline ${
                              u.status === "active" ? "text-red-600" : "text-brand-green-dark"
                            }`}
                          >
                            {u.status === "active" ? "Suspend" : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <p className="text-xs text-brand-grey">Review, edit, feature boost, or delete job postings across the platform.</p>
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
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {allJobs.length} Jobs Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                  <tr>
                    <th className="text-left px-5 py-3">Job Listing & Company</th>
                    <th className="text-left px-5 py-3">Category</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map((job) => (
                    <tr key={job._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/jobs/${job._id}`} className="font-semibold text-brand-black hover:text-brand-green-dark hover:underline">
                          {job.title}
                        </Link>
                        <p className="text-xs text-brand-grey mt-0.5">
                          {job.companyName || job.employer?.name || "Hiring Company"} {job.location ? `· ${job.location}` : ""}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-brand-grey">{job.category?.name || "General"}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                            job.status === "approved"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : "bg-yellow-100 text-yellow-900 border border-yellow-200"
                          }`}
                        >
                          ● {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link
                          to={`/employer/post-job?edit=${job._id}`}
                          className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div className="p-5 border-b border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  {applications.length} Total Applicants
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* View Mode Toggle */}
                <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAppViewMode("by_job")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      appViewMode === "by_job"
                        ? "bg-white text-emerald-900 shadow-2xs font-bold"
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
                        ? "bg-white text-emerald-900 shadow-2xs font-bold"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <Layers size={13} /> Flat Feed ({applications.length})
                  </button>
                </div>

                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="input-field text-xs py-2 bg-white w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="viewed">Viewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loadPlatformApplications();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    placeholder="Search job, company, or applicant..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="input-field text-xs py-2 w-40 sm:w-52"
                  />
                  <button type="submit" className="btn-secondary text-xs py-2 px-3 shrink-0">
                    <Search size={13} />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => handleExportCSV(null, "all_applications")}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
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

      {/* Resume In-Browser Preview Modal */}
      {previewApp && (
        <ResumePreviewModal
          application={previewApp}
          onClose={() => setPreviewApp(null)}
        />
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

export default SuperAdminDashboard;
