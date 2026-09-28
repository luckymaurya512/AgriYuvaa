import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  Download,
  Loader2,
  Sparkles,
  ShieldCheck,
  Save,
  ArrowRight,
  IndianRupee,
  Clock,
  Compass,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  uploadSeekerResume,
} from "../services/userService.js";
import { getActiveResume } from "../utils/resumeUtils.js";
import { calculateProfileCompletion } from "../utils/profileCompletion.js";
import ResumePreviewModal from "../components/ResumePreviewModal.jsx";
import SEO from "../components/SEO.jsx";

const qualificationsList = [
  "B.Sc Agriculture (Hons)",
  "B.Sc Horticulture",
  "B.Sc Forestry / Sericulture",
  "B.Tech Agricultural Engineering",
  "B.Tech Dairy Technology / Food Tech",
  "M.Sc Agriculture (Agronomy / Soil Science / Genetics)",
  "M.Sc Horticulture",
  "MBA / PGDM in Agri-Business Management (ABM)",
  "Diploma in Agriculture / Polytechnic",
  "10+2 / Intermediate (Science / Agri)",
  "General Graduate / Postgraduate",
  "Other Relevant Degree",
];

const agriSpecializations = [
  "Agronomy & Crop Production",
  "Horticulture & Greenhouse Management",
  "Soil Science & Agricultural Chemistry",
  "Plant Pathology & Entomology",
  "Agri-Tech, Precision Farming & Drone Ops",
  "Agricultural Engineering & Farm Machinery",
  "Dairy, Livestock & Poultry Production",
  "Food Processing & Post-Harvest Technology",
  "Seed Technology, Genetics & Breeding",
  "Fertilizer, Pesticides & Agrochemicals",
  "Agri-Business, Sales & Rural Marketing",
  "Organic Farming & Sustainable Agriculture",
  "Banking AFO / Agri-Financing",
];

const experienceLevels = [
  "0-1 Years (Fresher)",
  "1-2 Years",
  "2-3 Years",
  "3-5 Years",
  "5+ Years",
];

const noticePeriodList = [
  "Immediate Joiner (Available Now)",
  "15 Days or less",
  "30 Days (1 Month)",
  "45 Days",
  "60 Days (2 Months)",
  "90 Days (3 Months)",
  "Serving Notice Period",
];

const preferredJobTypes = [
  "Full-time",
  "Internship",
  "Part-time",
  "Contract / Project",
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general"); // "general" | "resume" | "security"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [previewResume, setPreviewResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    qualification: "",
    specialization: "",
    experienceLevel: "",
    bio: "",
    // New Employment & Compensation fields
    currentOrganization: "",
    currentDesignation: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "",
    preferredJobType: "Full-time",
    preferredLocations: "",
    openToRelocate: true,
    skills: "",
    // Employer fields
    companyName: "",
    sector: "",
    website: "",
    gstOrFpoId: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      setUser(data.user);
      setProfile(data.profile);

      const p = data.profile || {};
      const u = data.user || {};

      setFormData({
        name: u.name || "",
        phone: u.phone || "",
        location: p.location || "",
        qualification: p.highestQualification || p.education?.[0]?.degree || "",
        specialization: p.specialization || p.skills?.[0] || "",
        experienceLevel: p.totalExperience || p.experience?.[0]?.title || "",
        bio: p.bio || p.description || p.experience?.[0]?.description || "",
        currentOrganization: p.currentOrganization || p.experience?.[0]?.organization || "",
        currentDesignation: p.currentDesignation || "",
        currentCtc: p.currentCtc || "",
        expectedCtc: p.expectedCtc || "",
        noticePeriod: p.noticePeriod || "",
        preferredJobType: p.preferredJobType || "Full-time",
        preferredLocations: p.preferredLocations || "",
        openToRelocate: p.openToRelocate !== undefined ? p.openToRelocate : true,
        skills: Array.isArray(p.skills) ? p.skills.join(", ") : p.skills || "",
        companyName: p.companyName || u.name || "",
        sector: p.sector || "",
        website: p.website || "",
        gstOrFpoId: p.gstOrFpoId || "",
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setToast({
          type: "error",
          message: err.response?.data?.message || "Failed to load profile data",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 5000);
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
      };

      if (user?.role !== "employer") {
        const skillsArray = typeof formData.skills === "string"
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : formData.skills || [];

        payload.seekerProfile = {
          location: formData.location,
          highestQualification: formData.qualification,
          specialization: formData.specialization,
          totalExperience: formData.experienceLevel,
          bio: formData.bio,
          currentOrganization: formData.currentOrganization,
          currentDesignation: formData.currentDesignation,
          currentCtc: formData.currentCtc,
          expectedCtc: formData.expectedCtc,
          noticePeriod: formData.noticePeriod,
          preferredJobType: formData.preferredJobType,
          preferredLocations: formData.preferredLocations,
          openToRelocate: formData.openToRelocate,
          skills: skillsArray.length > 0 ? skillsArray : (formData.specialization ? [formData.specialization] : []),
          education: formData.qualification ? [{ degree: formData.qualification }] : [],
          experience: formData.currentDesignation || formData.currentOrganization || formData.experienceLevel
            ? [{
                title: formData.currentDesignation || formData.experienceLevel,
                organization: formData.currentOrganization,
                description: formData.bio,
              }]
            : [],
        };
      } else if (user?.role === "employer") {
        payload.employerProfile = {
          companyName: formData.companyName,
          sector: formData.sector,
          website: formData.website,
          location: formData.location,
          description: formData.bio,
          gstOrFpoId: formData.gstOrFpoId,
        };
      }

      const res = await updateUserProfile(payload);
      setUser(res.user);
      setProfile(res.profile);
      showToast("success", "Profile details updated successfully! ✅");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "New password and confirmation do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters long.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", "Password changed successfully! 🔒");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File size exceeds 5MB limit. Please upload a smaller PDF or document.");
      return;
    }

    setUploadingResume(true);
    try {
      const res = await uploadSeekerResume(file);
      showToast("success", "Resume uploaded and saved to your profile successfully! 📄");
      loadData();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 size={36} className="text-emerald-700 animate-spin" />
        <p className="text-xs font-semibold text-brand-grey">Loading account profile...</p>
      </div>
    );
  }

  const backendBase = (
    import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
  ).replace(/\/api\/?$/, "");

  let resumeDownloadUrl = profile?.resumeUrl ? profile.resumeUrl.trim() : "";
  resumeDownloadUrl = resumeDownloadUrl.replace(/^https?:\/\/\/+/, "/");
  if (resumeDownloadUrl.startsWith("/uploads/")) {
    resumeDownloadUrl = `${backendBase}${resumeDownloadUrl}`;
  } else if (!resumeDownloadUrl.startsWith("http://") && !resumeDownloadUrl.startsWith("https://") && resumeDownloadUrl.length > 0) {
    resumeDownloadUrl = `https://${resumeDownloadUrl}`;
  }

  const activeResume = getActiveResume(profile, user?.name);

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10">
      <SEO title="My Profile" noindex={true} />
      
      {/* Toast Notification Alert */}
      {toast.message && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in text-sm font-medium shadow-sm ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Profile Header Card */}
      <div className="card p-4 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-xl mb-6 sm:mb-8">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800 border-2 border-emerald-600/60 flex items-center justify-center text-white text-xl sm:text-3xl font-display font-bold shrink-0 shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-display font-bold text-white break-words">
                  {user?.name}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 whitespace-nowrap">
                  {user?.role === "seeker"
                    ? "Job Seeker"
                    : user?.role === "employer"
                    ? "Employer"
                    : user?.role === "superadmin"
                    ? "Super Admin"
                    : "Admin"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-emerald-300/90">
                <span className="flex items-center gap-1.5 break-all">
                  <Mail size={13} className="shrink-0" />
                  <span>{user?.email}</span>
                </span>
                {user?.isEmailVerified && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-900/80 border border-emerald-600 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap inline-flex items-center">
                    ✓ Verified
                  </span>
                )}
              </div>

              {user?.phone && (
                <p className="text-xs text-emerald-300/80 flex items-center gap-1.5">
                  <Phone size={13} className="shrink-0" /> <span>{user.phone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-emerald-800/60 sm:border-0 flex sm:justify-end">
            <Link
              to={
                user?.role === "employer"
                  ? "/employer/dashboard"
                  : user?.role === "admin"
                  ? "/admin"
                  : user?.role === "superadmin"
                  ? "/superadmin"
                  : "/seeker"
              }
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-600 transition-colors shadow-xs"
            >
              <span>Dashboard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── PROFILE STRENGTH & COMPLETION INDICATOR (FOR JOB SEEKERS & ADMINS) ── */}
      {user?.role !== "employer" && (() => {
        const completion = calculateProfileCompletion(user, profile, formData);
        return (
          <div className="card p-4 sm:p-6 mb-6 sm:mb-8 border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 shadow-sm rounded-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Score badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                  <span className="font-display font-black text-xl sm:text-2xl text-emerald-800 leading-none">
                    {completion.percentage}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mt-0.5">
                    Complete
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-sm sm:text-base text-brand-black">
                      Profile Strength: <span className="text-emerald-800">{completion.statusLabel}</span>
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        completion.percentage >= 80
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : completion.percentage >= 50
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {completion.badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-brand-grey mt-0.5 leading-relaxed">
                    {completion.percentage === 100
                      ? "⭐ Outstanding! Your profile is 100% complete and fully optimized for top agriculture recruiters."
                      : "Add your Current CTC, Expected CTC & Notice Period below to get up to 3x more recruiter interview calls."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowChecklist(!showChecklist)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 self-start md:self-center shrink-0 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
              >
                <span>{showChecklist ? "Hide Checklist" : "View Checklist"}</span>
                {showChecklist ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 mt-4 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  completion.percentage >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                    : completion.percentage >= 50
                    ? "bg-gradient-to-r from-teal-500 to-emerald-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{ width: `${completion.percentage}%` }}
              />
            </div>

            {/* Expandable Checklist Details */}
            {showChecklist ? (
              <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-200">
                {completion.criteria.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs transition-colors ${
                      item.completed
                        ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
                        : "bg-white border-amber-200 text-gray-700 shadow-2xs"
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-amber-400 bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        !
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold truncate">{item.label}</p>
                      <p className="text-[10px] text-brand-grey truncate">
                        {item.completed ? "✓ Completed" : `+${item.weight}%: ${item.hint}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              completion.pendingCriteria.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-emerald-100/70 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Pending to reach 100%:</span>
                  {completion.pendingCriteria.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-900 font-medium text-[11px] shadow-2xs"
                    >
                      <span className="text-amber-600 font-bold">+{item.weight}%</span> {item.label}
                    </span>
                  ))}
                  {completion.pendingCriteria.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowChecklist(true)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      +{completion.pendingCriteria.length - 3} more
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        );
      })()}

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-brand-border space-x-2 sm:space-x-4 mb-6 sm:mb-8 overflow-x-auto pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          <User size={15} />
          <span>General & Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resume")}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "resume"
              ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          <FileText size={15} />
          <span>Resume & Documents</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "security"
              ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          <Lock size={15} />
          <span>Password & Security</span>
        </button>
      </div>

      {/* ── TAB 1: GENERAL & PROFILE DETAILS ── */}
      {activeTab === "general" && (
        <div className="card p-4 sm:p-8">
          <div className="border-b border-brand-border pb-4 mb-6">
            <h2 className="text-lg font-display font-bold text-brand-black">
              Account & Profile Information
            </h2>
            <p className="text-xs text-brand-grey mt-0.5">
              Keep your contact information and agricultural background up to date.
            </p>
          </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-6">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field !pl-10 text-xs sm:text-sm"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field !pl-10 text-xs sm:text-sm"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                <p className="text-[11px] text-brand-grey mt-1">Recruiters use this to reach you regarding job offers.</p>
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                Email Address (Primary Account ID)
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="input-field !pl-10 text-xs sm:text-sm bg-gray-100 text-brand-grey cursor-not-allowed"
                />
              </div>
            </div>

            {/* ── Seeker & Candidate Specific Details ── */}
            {user?.role !== "employer" && (
              <div className="pt-4 border-t border-brand-border space-y-5">
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-emerald-700" />
                  <span>Agricultural Qualifications & Domain</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Highest Education / Degree
                    </label>
                    <select
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="input-field text-xs sm:text-sm bg-white"
                    >
                      <option value="">Select your degree...</option>
                      {qualificationsList.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Primary Agricultural Domain / Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="input-field text-xs sm:text-sm bg-white"
                    >
                      <option value="">Select your specialization...</option>
                      {agriSpecializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="input-field text-xs sm:text-sm bg-white"
                    >
                      <option value="">Select experience level...</option>
                      {experienceLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Current City / State
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="input-field !pl-10 text-xs sm:text-sm"
                        placeholder="e.g. Pune, Maharashtra / Lucknow, UP"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Sub-Section: Current Employment Details ── */}
                <div className="pt-4 border-t border-brand-border/70 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase size={15} className="text-emerald-700" />
                    <span>Current Employment & Organization</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Current Company / Organization / College
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <input
                          type="text"
                          value={formData.currentOrganization}
                          onChange={(e) => setFormData({ ...formData, currentOrganization: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm"
                          placeholder="e.g. Anand Agro Care / IFFCO / PAU Ludhiana / Fresher"
                        />
                      </div>
                      <p className="text-[11px] text-brand-grey mt-1">If student or seeking first job, you can write "Fresher" or your university name.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Current Designation / Role
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <input
                          type="text"
                          value={formData.currentDesignation}
                          onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm"
                          placeholder="e.g. Field Agronomist / Business Coordinator / Student"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Sub-Section: Compensation (CTC) & Availability ── */}
                <div className="pt-4 border-t border-brand-border/70 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-emerald-700" />
                    <span>Compensation (CTC) & Availability</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Current CTC */}
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Current CTC (Annual / Monthly)
                      </label>
                      <div className="relative">
                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <input
                          type="text"
                          value={formData.currentCtc}
                          onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm"
                          placeholder="e.g. ₹3,60,000 / year (or Fresher)"
                        />
                      </div>
                      {/* Quick Chips for Current CTC */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {["Fresher / NA", "₹2.5 - 3.5 LPA", "₹3.5 - 5 LPA", "₹5 - 8 LPA"].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setFormData({ ...formData, currentCtc: chip })}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 hover:bg-emerald-100 hover:text-emerald-900 text-gray-700 transition-colors cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expected CTC */}
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Expected CTC (Annual)
                      </label>
                      <div className="relative">
                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <input
                          type="text"
                          value={formData.expectedCtc}
                          onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm"
                          placeholder="e.g. ₹5,00,000 / year"
                        />
                      </div>
                      {/* Quick Chips for Expected CTC */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {["₹3 - 4.5 LPA", "₹4.5 - 6 LPA", "₹6 - 9 LPA", "Negotiable"].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setFormData({ ...formData, expectedCtc: chip })}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 hover:bg-emerald-100 hover:text-emerald-900 text-gray-700 transition-colors cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notice Period */}
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Notice Period / Availability
                      </label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <select
                          value={formData.noticePeriod}
                          onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm bg-white"
                        >
                          <option value="">Select availability / notice...</option>
                          {noticePeriodList.map((np) => (
                            <option key={np} value={np}>
                              {np}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[11px] text-brand-grey mt-1">Helps recruiters prioritize urgent openings.</p>
                    </div>
                  </div>
                </div>

                {/* ── Sub-Section: Career Preferences & Relocation ── */}
                <div className="pt-4 border-t border-brand-border/70 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass size={15} className="text-emerald-700" />
                    <span>Career & Relocation Preferences</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Preferred Employment Type
                      </label>
                      <select
                        value={formData.preferredJobType}
                        onChange={(e) => setFormData({ ...formData, preferredJobType: e.target.value })}
                        className="input-field text-xs sm:text-sm bg-white"
                      >
                        {preferredJobTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5">
                        Preferred Work Locations / States
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                        <input
                          type="text"
                          value={formData.preferredLocations}
                          onChange={(e) => setFormData({ ...formData, preferredLocations: e.target.value })}
                          className="input-field !pl-10 text-xs sm:text-sm"
                          placeholder="e.g. Pune, Delhi NCR, Lucknow, Pan India"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="openToRelocate"
                      checked={formData.openToRelocate}
                      onChange={(e) => setFormData({ ...formData, openToRelocate: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-gray-300"
                    />
                    <label htmlFor="openToRelocate" className="text-xs font-semibold text-brand-black cursor-pointer">
                      I am open to relocating anywhere in India for the right agriculture opportunity
                    </label>
                  </div>
                </div>

                {/* Key Skills */}
                <div className="pt-4 border-t border-brand-border/70 space-y-2">
                  <label className="block text-xs font-bold text-brand-black mb-1">
                    Key Agricultural Skills & Competencies
                  </label>
                  <div className="relative">
                    <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="input-field !pl-10 text-xs sm:text-sm"
                      placeholder="e.g. Agronomy, Field Trials, Soil Health, Farmer Advisory, Crop Protection, Seed Marketing"
                    />
                  </div>
                  <p className="text-[11px] text-brand-grey">Separate skills with commas (e.g., Agronomy, Sales, Drip Irrigation).</p>
                </div>

                {/* Summary / Bio */}
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1.5">
                    Professional Summary / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field text-xs sm:text-sm"
                    placeholder="Briefly describe your agricultural expertise, field research, or career aspirations..."
                  />
                </div>
              </div>
            )}

            {/* ── Employer Specific Details ── */}
            {user?.role === "employer" && (
              <div className="pt-4 border-t border-brand-border space-y-5">
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 size={16} className="text-emerald-700" />
                  <span>Company / Organization Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input-field text-xs sm:text-sm"
                      placeholder="e.g. AgriTech Bio Solutions Ltd."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Industry Sector / Domain
                    </label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="input-field text-xs sm:text-sm"
                      placeholder="e.g. Seeds R&D / Precision Agri / Dairy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Company Website URL
                    </label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="input-field !pl-10 text-xs sm:text-sm"
                        placeholder="https://www.yourcompany.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1.5">
                      Headquarters / Office Location
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="input-field !pl-10 text-xs sm:text-sm"
                        placeholder="e.g. Hyderabad, Telangana"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1.5">
                    GST Number / FPO Registration / CIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gstOrFpoId}
                    onChange={(e) => setFormData({ ...formData, gstOrFpoId: e.target.value })}
                    className="input-field text-xs sm:text-sm"
                    placeholder="e.g. 29ABCDE1234F1Z5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1.5">
                    Company Bio / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field text-xs sm:text-sm"
                    placeholder="Tell job seekers about your mission, scale, and work culture..."
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-border">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 2: RESUME & DOCUMENTS (ALL USERS) ── */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          <div className="card p-4 sm:p-8">
            <div className="border-b border-brand-border pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-display font-bold text-brand-black">
                  Resume & Candidate Documents
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  Manage your active resume document for 1-click job applications.
                </p>
              </div>

              <Link
                to="/resume-builder"
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Sparkles size={14} className="text-emerald-700" />
                <span>Build New Resume ↗</span>
              </Link>
            </div>

            {/* Active Resume Display (Single Active Resume: Last Edited or Uploaded) */}
            {activeResume ? (
              <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-bold text-sm text-brand-black truncate">
                        {activeResume.title}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                        {activeResume.badge}
                      </span>
                    </div>
                    <p className="text-xs text-brand-grey mt-0.5 truncate">
                      {activeResume.subtitle}
                      {activeResume.updatedAt && (
                        <>
                          {" "}• Updated{" "}
                          {new Date(activeResume.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeResume.type === "builder" ? (
                    <>
                      <Link
                        to="/resume-builder"
                        className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-white shadow-2xs text-emerald-900 font-bold border-emerald-300"
                      >
                        <Sparkles size={13} className="text-emerald-700" />
                        <span>Edit in Builder ↗</span>
                      </Link>
                      <Link
                        to="/resume-builder"
                        className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download size={13} />
                        <span>View / Download CV</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewResume({
                            resumeUrl: activeResume.url,
                            seeker: { name: user?.name, email: user?.email, phone: user?.phone },
                          })
                        }
                        className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-white shadow-2xs"
                      >
                        <Eye size={13} className="text-emerald-700" />
                        <span>Quick Preview</span>
                      </button>

                      <a
                        href={resumeDownloadUrl || activeResume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-brand-border text-center space-y-2 mb-6">
                <FileText size={32} className="mx-auto text-gray-400" />
                <p className="text-sm font-bold text-brand-black">No Resume on Profile Yet</p>
                <p className="text-xs text-brand-grey max-w-sm mx-auto">
                  Upload a PDF resume below or use our free Agriculture Resume Builder to create one in minutes.
                </p>
              </div>
            )}

            {/* Upload / Replace Resume Form */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wide">
                {profile?.resumeUrl ? "Upload New Version / Replace Resume" : "Upload Resume File"}
              </label>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs">
                  {uploadingResume ? (
                    <>
                      <Loader2 size={15} className="animate-spin text-emerald-700" />
                      <span>Uploading Resume...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={15} className="text-emerald-700" />
                      <span>Choose File (PDF, DOCX)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={uploadingResume}
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-brand-grey">Max file size: 5MB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: PASSWORD & SECURITY ── */}
      {activeTab === "security" && (
        <div className="card p-4 sm:p-8 max-w-2xl">
          <div className="border-b border-brand-border pb-4 mb-6">
            <h2 className="text-lg font-display font-bold text-brand-black flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-700" />
              <span>Security & Password Settings</span>
            </h2>
            <p className="text-xs text-brand-grey mt-0.5">
              Change your password to keep your AgriYuvaa account safe.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                Current Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="input-field !pl-10 text-xs sm:text-sm"
                  placeholder="Enter your existing password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                New Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="input-field !pl-10 text-xs sm:text-sm"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="input-field !pl-10 text-xs sm:text-sm"
                  placeholder="Re-enter your new password"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 flex items-center gap-2"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resume In-Browser Preview Modal */}
      {previewResume && (
        <ResumePreviewModal
          application={previewResume}
          onClose={() => setPreviewResume(null)}
        />
      )}
    </div>
  );
};

export default Profile;
