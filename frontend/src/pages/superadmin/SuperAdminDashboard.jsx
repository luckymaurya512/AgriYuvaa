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
  ArrowUpRight,
  Landmark,
  Edit3,
  FileSpreadsheet,
  Eye,
  Globe,
  Sparkles,
  RotateCcw,
  Check,
  Settings,
  Link2,
  Trash2,
  Phone,
} from "lucide-react";
import ResumePreviewModal from "../../components/ResumePreviewModal.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import {
  fetchPlatformStats,
  fetchUsers,
  fetchAllApplications,
  fetchAllPlatformJobs,
  updateUserStatus,
  createAdmin,
  updateUserRole,
  fetchPageSeoConfigs,
  upsertPageSeoConfig,
  deletePageSeoConfig,
} from "../../services/adminService.js";
import { deleteJob } from "../../services/jobService.js";
import SEO from "../../components/SEO.jsx";

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
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [showAdminForm, setShowAdminForm] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const role = (u.role || "").trim().toLowerCase();
      const matchesRole =
        userRoleFilter === "all"
          ? true
          : userRoleFilter === "employer"
          ? role === "employer"
          : userRoleFilter === "seeker"
          ? role === "seeker" || role === "user"
          : userRoleFilter === "admin"
          ? role === "admin" || role === "superadmin"
          : role === userRoleFilter;

      const q = userSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && String(u.phone).toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q));

      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearch]);
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

  // ── Page SEO Management State ──
  const [pageSeoList, setPageSeoList] = useState([]);
  const [loadingSeo, setLoadingSeo] = useState(false);
  const [seoSearch, setSeoSearch] = useState("");
  const [seoFilter, setSeoFilter] = useState("all"); // "all" | "customized" | "default"
  const [editingSeoItem, setEditingSeoItem] = useState(null);
  const [seoForm, setSeoForm] = useState({
    route: "",
    pageName: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
    noindex: false,
  });
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoError, setSeoError] = useState("");

  // ── Critical Action Confirmation Dialog State ──
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    message: "",
    itemName: "",
    itemType: "",
    confirmText: "Yes, Proceed",
    cancelText: "Think Again / Cancel",
    variant: "danger",
    loading: false,
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false, loading: false }));
  };

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
      "Current Designation",
      "Current Organization",
      "Current CTC",
      "Expected CTC",
      "Notice Period",
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
        `"${(app.seekerProfile?.currentDesignation || "N/A").replace(/"/g, '""')}"`,
        `"${(app.seekerProfile?.currentOrganization || "N/A").replace(/"/g, '""')}"`,
        `"${(app.seekerProfile?.currentCtc || "N/A").replace(/"/g, '""')}"`,
        `"${(app.seekerProfile?.expectedCtc || "N/A").replace(/"/g, '""')}"`,
        `"${(app.seekerProfile?.noticePeriod || "N/A").replace(/"/g, '""')}"`,
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
    loadPageSeo();
  };

  const loadPageSeo = () => {
    setLoadingSeo(true);
    fetchPageSeoConfigs()
      .then((data) => setPageSeoList(Array.isArray(data) ? data : []))
      .catch(() => setPageSeoList([]))
      .finally(() => setLoadingSeo(false));
  };

  const handleOpenEditSeo = (item) => {
    setEditingSeoItem(item);
    setSeoForm({
      route: item.route || "",
      pageName: item.pageName || "",
      metaTitle: item.metaTitle || item.defaultTitle || "",
      metaDescription: item.metaDescription || item.defaultDescription || "",
      metaKeywords: Array.isArray(item.metaKeywords)
        ? item.metaKeywords.join(", ")
        : item.metaKeywords || (Array.isArray(item.defaultKeywords) ? item.defaultKeywords.join(", ") : ""),
      ogImage: item.ogImage || "",
      noindex: Boolean(item.noindex),
    });
    setSeoError("");
  };

  const handleOpenCreateCustomSeo = () => {
    setEditingSeoItem({ isNew: true });
    setSeoForm({
      route: "/",
      pageName: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ogImage: "",
      noindex: false,
    });
    setSeoError("");
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSavingSeo(true);
    setSeoError("");
    try {
      await upsertPageSeoConfig(seoForm);
      setSuccessMsg(`SEO configuration for ${seoForm.route} saved successfully!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setEditingSeoItem(null);
      loadPageSeo();
      window.dispatchEvent(new Event("agriyuvaa_page_seo_updated"));
    } catch (err) {
      setSeoError(err.response?.data?.message || "Failed to save page SEO settings");
    } finally {
      setSavingSeo(false);
    }
  };

  const handleResetSeo = (item) => {
    if (!item._id) return;
    setConfirmConfig({
      isOpen: true,
      title: "Reset SEO to Default?",
      subtitle: "Revert Google search metadata for this route back to system defaults.",
      message: (
        <span>
          Are you sure you want to reset SEO settings for route <strong>"{item.route}"</strong>?
          Custom meta titles, descriptions, and focus keywords will be deleted and platform defaults will be restored.
        </span>
      ),
      itemName: `${item.pageName || item.route} (${item.route})`,
      itemType: "Page Route",
      confirmText: "Yes, Reset to Default",
      cancelText: "Keep Custom SEO",
      variant: "warning",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await deletePageSeoConfig(item._id);
          setSuccessMsg(`Reset SEO for ${item.route} to default.`);
          setTimeout(() => setSuccessMsg(""), 4000);
          loadPageSeo();
          window.dispatchEvent(new Event("agriyuvaa_page_seo_updated"));
        } catch (err) {
          setError(err.response?.data?.message || "Failed to reset page SEO");
        } finally {
          closeConfirmModal();
        }
      },
    });
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

  const handleStatusToggle = (user) => {
    const next = user.status === "active" ? "suspended" : "active";
    const isSuspending = next === "suspended";
    setConfirmConfig({
      isOpen: true,
      title: isSuspending ? "Suspend User Account?" : "Reactivate User Account?",
      subtitle: isSuspending
        ? "Prevent this user from logging in or using portal features."
        : "Restore standard platform login and portal access.",
      message: isSuspending ? (
        <span>
          Are you sure you want to suspend <strong>{user.name}</strong> ({user.email})?
          They will immediately lose access to their account until reinstated by a Super Admin.
        </span>
      ) : (
        <span>
          Are you sure you want to reactivate <strong>{user.name}</strong> ({user.email})?
          Their account access will be restored immediately.
        </span>
      ),
      itemName: `${user.name} (${user.email})`,
      itemType: "Account",
      confirmText: isSuspending ? "Yes, Suspend Account" : "Yes, Reactivate",
      cancelText: "Cancel",
      variant: isSuspending ? "danger" : "info",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await updateUserStatus(user._id, next);
          setSuccessMsg(`User ${user.name} marked as ${next}.`);
          setTimeout(() => setSuccessMsg(""), 4000);
          loadAll();
        } catch (err) {
          setError(err.response?.data?.message || "Failed to change user status");
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleRoleToggle = (user, newRole) => {
    const isPromotion = newRole === "admin" || newRole === "superadmin";
    setConfirmConfig({
      isOpen: true,
      title: isPromotion ? "Promote User to Admin?" : `Demote User to ${newRole === "employer" ? "Employer" : "Job Seeker"}?`,
      subtitle: isPromotion
        ? "Grant full administrative access across jobs, candidates, and portal settings."
        : "Revoke administrative privileges and restore standard user permissions.",
      message: isPromotion ? (
        <span>
          Are you sure you want to grant <strong>Admin privileges</strong> to <strong>{user.name}</strong> ({user.email})?
          They will be able to manage job posts, review applicants, and view user profiles.
        </span>
      ) : (
        <span>
          Are you sure you want to demote <strong>{user.name}</strong> from Admin back to <strong>{newRole === "employer" ? "Employer" : "Job Seeker"}</strong>?
          They will immediately lose access to the administrative control suite.
        </span>
      ),
      itemName: `${user.name} (${user.email})`,
      itemType: "User Permission",
      confirmText: isPromotion ? "Yes, Make Admin" : `Yes, Demote to ${newRole === "employer" ? "Employer" : "Seeker"}`,
      cancelText: "Cancel / Keep Current Role",
      variant: isPromotion ? "info" : "warning",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await updateUserRole(user._id, newRole);
          setSuccessMsg(`Role for ${user.name} updated to "${newRole}".`);
          setTimeout(() => setSuccessMsg(""), 4000);
          loadAll();
        } catch (err) {
          setError(err.response?.data?.message || "Failed to update role");
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleDeleteJob = (job) => {
    setConfirmConfig({
      isOpen: true,
      title: "Permanently Delete Job Post?",
      subtitle: "This listing will be purged from search results and dashboards.",
      message: (
        <span>
          Are you sure you want to delete <strong>"{job.title}"</strong>?
          All candidate application history and bookmarks linked to this job post will be permanently removed.
        </span>
      ),
      itemName: job.title,
      itemType: "Job Listing",
      confirmText: "Yes, Delete Job",
      cancelText: "Keep Job",
      variant: "danger",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await deleteJob(job._id);
          setSuccessMsg(`Job "${job.title}" was permanently removed.`);
          setTimeout(() => setSuccessMsg(""), 4000);
          setAllJobs((prev) => prev.filter((j) => j._id !== job._id));
        } catch (err) {
          setError(err.response?.data?.message || "Failed to delete job");
        } finally {
          closeConfirmModal();
        }
      },
    });
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
      <SEO title="Super Admin Control Hub" noindex={true} />
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

        <button
          type="button"
          onClick={() => setTab("seo")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "seo"
              ? "bg-emerald-950 text-white shadow-2xs"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          <Globe size={15} /> Page SEO Suite
          {pageSeoList.some((p) => p.isCustomized) && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "seo" ? "bg-emerald-800 text-white" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {pageSeoList.filter((p) => p.isCustomized).length} Active
            </span>
          )}
        </button>

        <Link
          to="/employers"
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all whitespace-nowrap ml-auto"
        >
          <Building2 size={14} className="text-emerald-700" /> Employers Directory ↗
        </Link>

        <Link
          to="/govt-jobs"
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-purple-900 hover:bg-purple-50 rounded-xl transition-all whitespace-nowrap"
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
              <StatCard
                label="Total Registered Users"
                value={stats.totalUsers}
                onClick={() => {
                  setTab("users");
                  setUserRoleFilter("all");
                }}
                hint="View all users"
              />
              <StatCard
                label="Employer Accounts"
                value={stats.totalEmployers}
                onClick={() => {
                  setTab("users");
                  setUserRoleFilter("employer");
                }}
                hint="View employers"
              />
              <StatCard
                label="Job Seekers"
                value={stats.totalSeekers}
                onClick={() => {
                  setTab("users");
                  setUserRoleFilter("seeker");
                }}
                hint="View seekers"
              />
              <StatCard
                label="Platform Applications"
                value={stats.totalApplications}
                onClick={() => setTab("applications")}
                hint="View applications"
              />
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

              {/* Card 6: Page SEO & Metadata Manager */}
              <div
                onClick={() => setTab("seo")}
                className="card p-6 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between border-2 border-emerald-100/70 bg-gradient-to-br from-white via-white to-emerald-50/25"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Globe size={22} />
                    </div>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={11} className="text-emerald-700" /> Google Ranking
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-black group-hover:text-brand-green-dark transition-colors">
                    Page SEO & Metadata Manager
                  </h3>
                  <p className="text-xs text-brand-grey mt-1 leading-relaxed">
                    Set Google search titles, descriptions, and focus keywords for all job portal routes to maximize organic search rankings.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Open SEO Command Suite</span>
                  <ArrowRight size={14} />
                </div>
              </div>
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
            <div className="px-5 py-4 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-brand-black">
                  {userRoleFilter === "all"
                    ? "All Registered Users"
                    : userRoleFilter === "employer"
                    ? "Employer Accounts"
                    : userRoleFilter === "seeker"
                    ? "Job Seekers"
                    : `${userRoleFilter.toUpperCase()} Accounts`}{" "}
                  <span className="text-brand-grey font-normal">
                    ({filteredUsers.length} of {users.length})
                  </span>
                </span>
                {userRoleFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter("all")}
                    className="text-xs text-brand-green font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Role Filter Pills */}
                <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter("all")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      userRoleFilter === "all"
                        ? "bg-white text-brand-black shadow-2xs font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    All ({users.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter("employer")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      userRoleFilter === "employer"
                        ? "bg-white text-emerald-900 shadow-2xs font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    Employers (
                    {
                      users.filter((u) => (u.role || "").trim().toLowerCase() === "employer").length
                    }
                    )
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter("seeker")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      userRoleFilter === "seeker"
                        ? "bg-white text-emerald-900 shadow-2xs font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    Seekers (
                    {
                      users.filter(
                        (u) =>
                          (u.role || "").trim().toLowerCase() === "seeker" ||
                          (u.role || "").trim().toLowerCase() === "user"
                      ).length
                    }
                    )
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter("admin")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      userRoleFilter === "admin"
                        ? "bg-white text-emerald-900 shadow-2xs font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    Admins (
                    {
                      users.filter(
                        (u) =>
                          (u.role || "").trim().toLowerCase() === "admin" ||
                          (u.role || "").trim().toLowerCase() === "superadmin"
                      ).length
                    }
                    )
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, or mobile..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                  <tr>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Mobile No.</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Role Actions</th>
                    <th className="text-right px-5 py-3">Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-brand-grey text-xs">
                        No registered users match your selected filter or search term.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                    <tr key={u._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-brand-black">{u.name}</td>
                      <td className="px-5 py-3 text-brand-grey">{u.email}</td>
                      <td className="px-5 py-3 text-xs">
                        {u.phone ? (
                          <a
                            href={`tel:${u.phone}`}
                            className="text-brand-black hover:text-emerald-700 font-medium hover:underline inline-flex items-center gap-1.5 font-mono"
                            title={`Call ${u.phone}`}
                          >
                            <Phone size={12} className="text-emerald-600 shrink-0" />
                            <span>{u.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not Provided</span>
                        )}
                      </td>
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
                  )))}
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
                          className="text-xs font-semibold text-brand-black hover:text-brand-green-dark bg-gray-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Edit3 size={13} /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Permanently Delete Job Post"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
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
                                          <td className="px-4 py-3 text-brand-black">
                                            <p className="font-bold text-brand-black">{app.seeker?.name || "Applicant"}</p>
                                            {(app.seekerProfile?.currentDesignation || app.seekerProfile?.currentOrganization) && (
                                              <p className="text-[11px] text-brand-grey font-medium truncate max-w-[200px]">
                                                💼 {app.seekerProfile.currentDesignation}
                                                {app.seekerProfile.currentDesignation && app.seekerProfile.currentOrganization ? " @ " : ""}
                                                {app.seekerProfile.currentOrganization}
                                              </p>
                                            )}
                                            {(app.seekerProfile?.currentCtc || app.seekerProfile?.expectedCtc) && (
                                              <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                                CTC: {app.seekerProfile.currentCtc || "-"} ➔ Exp: {app.seekerProfile.expectedCtc || "-"}
                                              </p>
                                            )}
                                            {app.seekerProfile?.noticePeriod && (
                                              <p className="text-[10px] text-blue-700 font-medium">
                                                ⏱️ {app.seekerProfile.noticePeriod}
                                              </p>
                                            )}
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
                            {(app.seekerProfile?.currentDesignation || app.seekerProfile?.currentOrganization) && (
                              <p className="text-[11px] text-brand-grey font-medium truncate max-w-[200px]">
                                💼 {app.seekerProfile.currentDesignation}
                                {app.seekerProfile.currentDesignation && app.seekerProfile.currentOrganization ? " @ " : ""}
                                {app.seekerProfile.currentOrganization}
                              </p>
                            )}
                            {(app.seekerProfile?.currentCtc || app.seekerProfile?.expectedCtc) && (
                              <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                CTC: {app.seekerProfile.currentCtc || "-"} ➔ Exp: {app.seekerProfile.expectedCtc || "-"}
                              </p>
                            )}
                            {app.seekerProfile?.noticePeriod && (
                              <p className="text-[10px] text-blue-700 font-medium">
                                ⏱️ {app.seekerProfile.noticePeriod}
                              </p>
                            )}
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
      {/* ── TAB 4: GLOBAL PAGE SEO & METADATA SUITE ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-brand-black flex items-center gap-2">
                  <Globe size={20} className="text-emerald-700" /> Global Page SEO & Search Metadata Suite
                </h2>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  Rank Booster
                </span>
              </div>
              <p className="text-xs text-brand-grey mt-1">
                Customize Google search titles, click-through descriptions, focus keywords, and WhatsApp/LinkedIn social cards for all portal pages.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreateCustomSeo}
                className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-2xs cursor-pointer"
              >
                <PlusCircle size={14} /> + Add Custom Page Route
              </button>
              <button
                onClick={() => setTab("overview")}
                className="text-xs font-semibold text-brand-grey hover:text-black underline cursor-pointer"
              >
                ← Back to Hub
              </button>
            </div>
          </div>

          {/* Metrics summary banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-grey uppercase">Total Portal Pages</p>
                <p className="text-2xl font-display font-bold text-brand-black mt-1">{pageSeoList.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                <Globe size={18} />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emerald-900 uppercase">Google Optimized</p>
                <p className="text-2xl font-display font-bold text-emerald-950 mt-1">
                  {pageSeoList.filter((p) => p.isCustomized).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-brand-grey uppercase">Using Default Fallback</p>
                <p className="text-2xl font-display font-bold text-gray-700 mt-1">
                  {pageSeoList.filter((p) => !p.isCustomized).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                <RotateCcw size={18} />
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSeoFilter("all")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  seoFilter === "all" ? "bg-white text-brand-black shadow-2xs font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                All Pages ({pageSeoList.length})
              </button>
              <button
                type="button"
                onClick={() => setSeoFilter("customized")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  seoFilter === "customized" ? "bg-white text-emerald-900 shadow-2xs font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                Optimized ({pageSeoList.filter((p) => p.isCustomized).length})
              </button>
              <button
                type="button"
                onClick={() => setSeoFilter("default")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  seoFilter === "default" ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                Default ({pageSeoList.filter((p) => !p.isCustomized).length})
              </button>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search page name or route..."
                value={seoSearch}
                onChange={(e) => setSeoSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Pages Grid */}
          {loadingSeo ? (
            <div className="card p-12 text-center text-brand-grey text-xs">
              Loading platform page metadata...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageSeoList
                .filter((item) => {
                  if (seoFilter === "customized" && !item.isCustomized) return false;
                  if (seoFilter === "default" && item.isCustomized) return false;
                  if (!seoSearch.trim()) return true;
                  const q = seoSearch.trim().toLowerCase();
                  return (
                    item.pageName?.toLowerCase().includes(q) ||
                    item.route?.toLowerCase().includes(q) ||
                    item.metaTitle?.toLowerCase().includes(q) ||
                    item.defaultTitle?.toLowerCase().includes(q)
                  );
                })
                .map((item) => {
                  const activeTitle = item.metaTitle || item.defaultTitle || "AgriYuvaa";
                  const activeDesc = item.metaDescription || item.defaultDescription || "";
                  const activeKeywords = Array.isArray(item.metaKeywords) && item.metaKeywords.length > 0
                    ? item.metaKeywords
                    : item.defaultKeywords || [];

                  return (
                    <div
                      key={item.route}
                      className={`card p-5 transition-all flex flex-col justify-between ${
                        item.isCustomized
                          ? "border-emerald-200/90 bg-emerald-50/10 shadow-2xs"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div>
                        {/* Top Route & Status */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg">
                            {item.route}
                          </span>
                          {item.isCustomized ? (
                            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles size={11} className="text-emerald-700" /> Google Optimized
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
                              System Default
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-base text-brand-black mb-1">
                          {item.pageName}
                        </h3>

                        {/* Mini Google SERP Preview Box */}
                        <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="font-medium text-emerald-800">jobs.agriyuvaa.com</span>
                            <span>›</span>
                            <span className="truncate">{item.route === "/" ? "home" : item.route.replace(/^\//, "")}</span>
                          </div>
                          <p className="text-xs font-semibold text-blue-700 line-clamp-1 hover:underline cursor-pointer">
                            {activeTitle}
                          </p>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                            {activeDesc || "No description specified. Google will generate an automated snippet from page content."}
                          </p>
                        </div>

                        {/* Keywords Preview */}
                        {activeKeywords.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Keywords:</span>
                            {activeKeywords.slice(0, 3).map((kw, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                              >
                                {kw}
                              </span>
                            ))}
                            {activeKeywords.length > 3 && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                +{activeKeywords.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSeo(item)}
                          className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 size={13} /> {item.isCustomized ? "Edit Custom SEO" : "Customize SEO"}
                        </button>

                        <div className="flex items-center gap-2">
                          {item.isCustomized && (
                            <button
                              type="button"
                              onClick={() => handleResetSeo(item)}
                              className="text-xs font-semibold text-gray-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reset to system defaults"
                            >
                              <RotateCcw size={12} /> Reset
                            </button>
                          )}
                          <a
                            href={item.route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Visit page live"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ── Page SEO Edit & Google Live Preview Modal ── */}
      {editingSeoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-emerald-900 to-gray-900 text-white">
              <div>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Globe size={18} className="text-emerald-400" />
                  {editingSeoItem.isNew ? "Add Custom Page SEO Route" : `SEO Settings: ${editingSeoItem.pageName || editingSeoItem.route}`}
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5 font-mono">
                  {seoForm.route || "/"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSeoItem(null)}
                className="text-white/60 hover:text-white p-1 rounded-lg transition-colors text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content with Live Google SERP Simulator */}
            <form onSubmit={handleSaveSeo} className="p-6 overflow-y-auto space-y-5 flex-1">
              {seoError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} /> {seoError}
                </div>
              )}

              {/* LIVE GOOGLE SERP SIMULATOR */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" /> Live Google Search Result Simulator
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Desktop Preview</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                      A
                    </div>
                    <span className="font-medium text-gray-800">AgriYuvaa Jobs</span>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500 text-[11px] font-mono">
                      https://jobs.agriyuvaa.com{seoForm.route || "/"}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-blue-700 hover:underline leading-snug cursor-pointer">
                    {seoForm.metaTitle || editingSeoItem.defaultTitle || "Enter Meta Title..."}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {seoForm.metaDescription || editingSeoItem.defaultDescription || "Enter meta description so Google users will be attracted to click your page..."}
                  </p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Page Name / Title</label>
                  <input
                    required
                    type="text"
                    value={seoForm.pageName}
                    onChange={(e) => setSeoForm({ ...seoForm, pageName: e.target.value })}
                    placeholder="e.g. Job Search & Vacancies"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Route Path</label>
                  <input
                    required
                    type="text"
                    disabled={!editingSeoItem.isNew}
                    value={seoForm.route}
                    onChange={(e) => setSeoForm({ ...seoForm, route: e.target.value })}
                    placeholder="e.g. /jobs"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-gray-50 disabled:text-gray-500 font-mono"
                  />
                </div>
              </div>

              {/* Meta Title with Character Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Google Meta Title</label>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      (seoForm.metaTitle || "").length >= 45 && (seoForm.metaTitle || "").length <= 60
                        ? "bg-emerald-100 text-emerald-800 font-bold"
                        : (seoForm.metaTitle || "").length > 60
                        ? "bg-amber-100 text-amber-800 font-bold"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {(seoForm.metaTitle || "").length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={seoForm.metaTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                  placeholder={editingSeoItem.defaultTitle || "Custom Google clickable headline..."}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Recommended: 50–60 characters. Appears as the main clickable headline in search results.
                </p>
              </div>

              {/* Meta Description with Character Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Google Meta Description</label>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      (seoForm.metaDescription || "").length >= 120 && (seoForm.metaDescription || "").length <= 160
                        ? "bg-emerald-100 text-emerald-800 font-bold"
                        : (seoForm.metaDescription || "").length > 160
                        ? "bg-amber-100 text-amber-800 font-bold"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {(seoForm.metaDescription || "").length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  placeholder={editingSeoItem.defaultDescription || "Short 150-160 character description that entices users to click..."}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Recommended: 150–160 characters. Appears directly under your headline in search results.
                </p>
              </div>

              {/* Focus Keywords */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Focus Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={seoForm.metaKeywords}
                  onChange={(e) => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
                  placeholder="e.g. agriculture jobs, agronomy salary, icar exam 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Target search queries you want this specific page to rank for on Google.
                </p>
              </div>

              {/* Social Share Image (OG Image) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Custom Social Share Image (OG Image)</label>
                <input
                  type="text"
                  value={seoForm.ogImage}
                  onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                  placeholder="https://... (Leave blank to use default AgriYuvaa logo preview)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Preview card image when sharing this page on WhatsApp, LinkedIn, or Twitter.
                </p>
              </div>

              {/* Noindex Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="seoNoindex"
                  checked={seoForm.noindex}
                  onChange={(e) => setSeoForm({ ...seoForm, noindex: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <label htmlFor="seoNoindex" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Do not index this page on Google search engines (<code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">noindex</code>)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingSeoItem(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={savingSeo}
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {savingSeo ? "Saving SEO..." : "Save SEO Settings"}
                </button>
              </div>
            </form>
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

      {/* Critical Action Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        subtitle={confirmConfig.subtitle}
        message={confirmConfig.message}
        itemName={confirmConfig.itemName}
        itemType={confirmConfig.itemType}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        variant={confirmConfig.variant}
        loading={confirmConfig.loading}
        onConfirm={confirmConfig.onConfirm}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

const StatCard = ({ label, value, onClick, hint }) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    }}
    className={`card p-5 transition-all duration-200 select-none ${
      onClick
        ? "cursor-pointer hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 hover:bg-emerald-50/20 active:translate-y-0 group"
        : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs text-brand-grey uppercase font-semibold group-hover:text-emerald-900 transition-colors">
        {label}
      </p>
      {onClick && (
        <span className="p-1 rounded-lg text-gray-300 group-hover:text-emerald-700 group-hover:bg-emerald-100/60 transition-all">
          <ArrowUpRight size={15} />
        </span>
      )}
    </div>
    <p className="text-3xl font-display font-bold mt-2 text-brand-black group-hover:text-emerald-950 transition-colors">
      {value}
    </p>
    {hint && (
      <p className="text-[11px] font-medium text-gray-400 group-hover:text-emerald-700 mt-1.5 transition-colors flex items-center gap-1">
        <span>{hint}</span>
        <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
      </p>
    )}
  </div>
);

export default SuperAdminDashboard;
