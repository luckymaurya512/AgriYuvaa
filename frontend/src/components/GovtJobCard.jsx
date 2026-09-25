import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Users, GraduationCap, MapPin, IndianRupee, Calendar, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const GovtJobCard = ({ job }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobIdentifier = job.slug || job._id;

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate(`/login?redirect=/govt-jobs/${jobIdentifier}`);
    } else {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/govt-jobs/${jobIdentifier}`;
    const text = `🏛️ *Government Agriculture Vacancy Alert on AgriYuvaa*:\n\n📌 *${job.title}*\n🏢 *Organization:* ${job.organization}\n📍 *State:* ${job.state || "All India"}\n👥 *Vacancies:* ${job.vacancies || "Multiple"}\n💰 *Pay Scale:* ${job.salary || "As per rules"}\n📅 *Deadline:* ${job.applicationDeadline || "Check notification"}\n\n👉 *View & Apply Details:* ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      to={`/govt-jobs/${jobIdentifier}`}
      className="card p-4 sm:p-5 flex flex-col gap-3 h-full relative group border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-white"
    >
      {/* Top row: Organization tag, Status badge, Share */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-lg truncate max-w-[200px]">
            <Landmark size={12} className="shrink-0 text-emerald-700" />
            <span className="truncate">{job.organization}</span>
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              job.status === "Closing Soon"
                ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            ● {job.status || "Active"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShareClick}
          className="p-1.5 rounded-lg border border-brand-border/60 bg-white text-brand-grey hover:text-[#25D366] hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          aria-label={`Share ${job.title} on WhatsApp`}
          title="Share on WhatsApp"
        >
          <WhatsAppIcon size={14} className="text-current" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-base leading-snug group-hover:text-brand-green-dark transition-colors line-clamp-2">
        {job.title}
      </h3>

      {/* Key specs */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-brand-grey">
        {job.vacancies && (
          <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50/60 px-2 py-0.5 rounded">
            <Users size={12} className="text-emerald-700 shrink-0" /> {job.vacancies}
          </span>
        )}
        {job.qualification && (
          <span className="inline-flex items-center gap-1">
            <GraduationCap size={12} className="text-brand-green shrink-0" /> {job.qualification}
          </span>
        )}
        {job.state && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-brand-green shrink-0" /> {job.state}
          </span>
        )}
        {job.salary && (
          <span className="inline-flex items-center gap-1 font-semibold text-brand-black">
            <IndianRupee size={12} className="text-brand-green shrink-0" /> {job.salary}
          </span>
        )}
      </div>

      {/* Footer: Category + Deadline + Apply CTA */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-brand-border/50 text-xs">
        <span className="text-brand-grey flex items-center gap-1 truncate">
          <Calendar size={12} className="text-brand-grey shrink-0" />
          <span>Last Date: <strong className="text-brand-black">{job.applicationDeadline || "Check Notice"}</strong></span>
        </span>

        <button
          type="button"
          onClick={handleApplyClick}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer font-semibold"
        >
          Apply <ExternalLink size={11} />
        </button>
      </div>
    </Link>
  );
};

export default GovtJobCard;
