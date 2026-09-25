import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Bookmark, Zap, Star, Calendar, Award } from "lucide-react";
import { toggleSaveJob } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const formatSalary = (min, max) => {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  return `₹${(min || max).toLocaleString("en-IN")}+`;
};

const formatEmploymentType = (type) => {
  if (!type) return "Full-time";
  if (type === "work-from-home") return "Work From Home";
  if (type === "full-time") return "Full-time";
  if (type === "part-time") return "Part-time";
  if (type === "internship") return "Internship";
  return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
};

const formatExperience = (lvl) => {
  if (!lvl) return null;
  if (lvl === "0-1" || lvl === "0-1 years" || lvl === "entry" || lvl === "any") return "0-1 Yrs";
  if (lvl === "1-2" || lvl === "1-2 years") return "1-2 Yrs";
  if (lvl === "2-3" || lvl === "2-3 years") return "2-3 Yrs";
  if (lvl === "3-5" || lvl === "3-5 years" || lvl === "mid") return "3-5 Yrs";
  if (lvl === "5+" || lvl === "5+ years" || lvl === "senior") return "5+ Yrs";
  return `${lvl} Yrs`;
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

  const deadlineDate = job.applicationDeadline || job.expiresAt;

  return (
    <Link to={`/jobs/${job._id}`} className="card p-4 sm:p-5 flex flex-col gap-3 h-full relative group">
      {/* Top row: Badges & Bookmark Icon */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {job.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs">
              <Star size={11} fill="currentColor" /> Featured
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg animate-pulse">
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
              const text = `🌾 *Agriculture Hiring Alert on AgriYuvaa*:\n\n📌 *${job.title}*\n🏢 *Company:* ${company}\n📍 *Location:* ${job.location || "India"}\n💼 *Type:* ${job.employmentType || "Full-time"}${salaryInfo}\n\n👉 *View & Apply:* https://job.agriyuvaa.com/jobs/${job._id}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
            }}
            className="p-1.5 rounded-lg border border-brand-border/60 bg-white text-brand-grey hover:text-[#25D366] hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex items-center justify-center cursor-pointer"
            aria-label={`Share ${job.title} on WhatsApp`}
            title="Share on WhatsApp"
          >
            <WhatsAppIcon size={14} className="text-current" />
          </button>

          {user?.role === "seeker" && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={saving}
              className={`p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                isSaved
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-400 hover:text-emerald-700 hover:border-emerald-200"
              }`}
              aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
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

      {/* Primary Key Metadata: Location, Employment Type, Salary */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-brand-grey">
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} className="text-brand-green shrink-0" /> {job.location || "India"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase size={13} className="text-brand-green shrink-0" /> {formatEmploymentType(job.employmentType)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-black">
          <IndianRupee size={13} className="text-brand-green shrink-0" /> {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      {/* Clean Footer Row: Category Tag + Application Deadline */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-brand-border/50 text-xs">
        {job.category?.name && (
          <span className="text-xs font-medium text-brand-green-dark bg-brand-green-light px-3 py-1 rounded-md truncate max-w-[160px]">
            {job.category.name}
          </span>
        )}
        {deadlineDate && (
          <span className="text-xs text-brand-grey flex items-center gap-1 ml-auto">
            <Calendar size={12} className="text-brand-grey shrink-0" />
            <span>Closes {new Date(deadlineDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
