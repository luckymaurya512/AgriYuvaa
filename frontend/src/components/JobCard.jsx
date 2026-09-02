import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Bookmark, Zap, Star } from "lucide-react";
import { toggleSaveJob } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const formatSalary = (min, max) => {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  return `₹${(min || max).toLocaleString("en-IN")}+`;
};

const JobCard = ({ job, isSavedInitial = false, onBookmarkChange }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== "seeker") {
      alert("Please log in as a Job Seeker to bookmark jobs.");
      return;
    }

    setSaving(true);
    try {
      const res = await toggleSaveJob(job._id);
      setIsSaved(res.isSaved);
      if (onBookmarkChange) onBookmarkChange(job._id, res.isSaved);
    } catch (err) {
      console.error("Failed to bookmark job:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link to={`/jobs/${job._id}`} className="card p-5 flex flex-col gap-3 h-full relative group">
      {/* Top row: Badges & Bookmark Icon */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {job.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
              <Star size={11} fill="currentColor" /> Featured
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md animate-pulse">
              <Zap size={11} fill="currentColor" /> Urgent
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const salaryInfo = job.salaryMin || job.salaryMax ? `\n💰 *Salary:* ${formatSalary(job.salaryMin, job.salaryMax)}` : "";
              const company = job.companyName || job.employer?.name || "Agri Company";
              const text = `🌾 *Agriculture Hiring Alert on AgriYuvaa*:\n\n📌 *${job.title}*\n🏢 *Company:* ${company}\n📍 *Location:* ${job.location || "India"}\n💼 *Type:* ${job.employmentType || "Full-time"}${salaryInfo}\n\n👉 *View & Apply:* https://frontend-lime-nine-60.vercel.app/jobs/${job._id}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-[#25D366]/15 text-[#25D366] hover:border-[#25D366]/40 transition-colors flex items-center justify-center"
            title="Share on WhatsApp"
          >
            <WhatsAppIcon size={14} className="text-[#25D366]" />
          </button>

          {user?.role === "seeker" && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={saving}
              className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                isSaved
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-400 hover:text-emerald-700 hover:border-emerald-200"
              }`}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
            >
              <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-display font-semibold text-base leading-snug group-hover:text-brand-green-dark transition-colors">
        {job.title}
      </h3>

      <p className="text-sm font-medium text-brand-black/90">
        {job.companyName || job.employer?.name || "AgriYuvaa Employer"}
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-brand-grey">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} className="text-brand-green" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase size={14} className="text-brand-green" /> {job.employmentType}
        </span>
        <span className="inline-flex items-center gap-1">
          <IndianRupee size={14} className="text-brand-green" /> {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
        {job.category?.name && (
          <span className="text-xs font-medium text-brand-green-dark bg-brand-green-light px-3 py-1 rounded-full">
            {job.category.name}
          </span>
        )}
        {job.applyType === "email" && (
          <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            ✉️ Email HR
          </span>
        )}
        {job.applyType === "external_link" && (
          <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
            🌐 Company Site
          </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
