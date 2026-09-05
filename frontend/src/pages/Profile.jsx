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
} from "lucide-react";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  uploadSeekerResume,
} from "../services/userService.js";
import ResumePreviewModal from "../components/ResumePreviewModal.jsx";

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
  "Fresher / Entry Level (0 - 1 Year)",
  "Junior Professional (1 - 3 Years)",
  "Mid-Level Professional (3 - 5 Years)",
  "Senior Specialist (5 - 8 Years)",
  "Leadership / Management (8+ Years)",
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

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    qualification: "",
    specialization: "",
    experienceLevel: "",
    bio: "",
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
        qualification: p.education?.[0]?.degree || "",
        specialization: p.skills?.[0] || "",
        experienceLevel: p.experience?.[0]?.title || "",
        bio: p.description || p.experience?.[0]?.description || "",
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

      if (user?.role === "seeker") {
        payload.seekerProfile = {
          location: formData.location,
          skills: formData.specialization ? [formData.specialization] : [],
          education: formData.qualification ? [{ degree: formData.qualification }] : [],
          experience: formData.experienceLevel
            ? [{ title: formData.experienceLevel, description: formData.bio }]
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
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
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl relative overflow-hidden shadow-xl mb-8">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800 border-2 border-emerald-600/60 flex items-center justify-center text-white text-2xl sm:text-3xl font-display font-bold shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {user?.name}
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700">
                  {user?.role === "seeker"
                    ? "Job Seeker / Candidate"
                    : user?.role === "employer"
                    ? "Employer Recruiter"
                    : user?.role === "superadmin"
                    ? "Super Admin"
                    : "Admin"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-300/80 flex items-center gap-2">
                <Mail size={13} className="shrink-0" /> {user?.email}
                {user?.isEmailVerified && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-900/60 border border-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                    ✓ Verified
                  </span>
                )}
              </p>

              {user?.phone && (
                <p className="text-xs text-emerald-300/80 flex items-center gap-2">
                  <Phone size={13} className="shrink-0" /> {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
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
              className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center gap-1.5 border border-emerald-600 transition-colors shadow-xs"
            >
              <span>Dashboard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-brand-border space-x-2 sm:space-x-4 mb-8 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          <User size={15} />
          <span>General & Profile Details</span>
        </button>

        {user?.role === "seeker" && (
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "resume"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-brand-grey hover:text-brand-black"
            }`}
          >
            <FileText size={15} />
            <span>Resume & Documents</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
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
        <div className="card p-6 sm:p-8">
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

            {/* ── Seeker Specific Details ── */}
            {user?.role === "seeker" && (
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

      {/* ── TAB 2: RESUME & DOCUMENTS (SEEKERS ONLY) ── */}
      {activeTab === "resume" && user?.role === "seeker" && (
        <div className="space-y-6">
          <div className="card p-6 sm:p-8">
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

            {/* Active Resume Display */}
            {profile?.resumeUrl || profile?.resumeOriginalName ? (
              <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-brand-black truncate">
                      {profile.resumeOriginalName || "Active_Resume.pdf"}
                    </p>
                    <p className="text-xs text-brand-grey mt-0.5">
                      Uploaded on{" "}
                      {new Date(profile.updatedAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewResume({
                        resumeUrl: profile.resumeUrl,
                        seeker: { name: user?.name, email: user?.email, phone: user?.phone },
                      })
                    }
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-white shadow-2xs"
                  >
                    <Eye size={13} className="text-emerald-700" />
                    <span>Quick Preview</span>
                  </button>

                  <a
                    href={resumeDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-brand-border text-center space-y-2 mb-6">
                <FileText size={32} className="mx-auto text-gray-400" />
                <p className="text-sm font-bold text-brand-black">No Resume Uploaded Yet</p>
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
        <div className="card p-6 sm:p-8 max-w-2xl">
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
