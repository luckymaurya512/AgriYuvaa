import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";

const formatSalary = (min, max) => {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  return `₹${(min || max).toLocaleString("en-IN")}+`;
};

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="card p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-base leading-snug">{job.title}</h3>
        {job.isFeatured && <span className="badge-featured shrink-0">Featured</span>}
      </div>

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
