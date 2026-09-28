import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

const ResumePromoCard = ({
  variant = "grid",
  title = "Need an Agriculture Resume That Stands Out?",
  description = "Build a recruiter-ready CV tailored for ICAR, Agronomy, and AgriTech roles in 2 minutes.",
  className = "",
}) => {
  if (variant === "sidebar") {
    return (
      <div
        className={`card p-4 sm:p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950 text-white border border-emerald-800/60 shadow-md space-y-3 relative overflow-hidden group ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" /> Free Tool
          </span>
          <span className="text-[11px] text-emerald-300 font-semibold">ATS-Friendly</span>
        </div>

        <div>
          <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug">
            {title}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <ul className="space-y-1 text-[11px] text-emerald-200/90 pt-1">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>Pre-filled with Agriculture courses & skills</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>1-Click clean PDF download</span>
          </li>
        </ul>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">100% Free</span>
          <Link
            to="/resume-builder"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-1.5 px-3.5 rounded-lg font-bold shadow-xs whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer"
          >
            Build Resume <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`card p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 text-white border border-emerald-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                {title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                ATS Optimized
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 max-w-xl">
              {description}
            </p>
          </div>
        </div>

        <Link
          to="/resume-builder"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-2 px-4 rounded-xl font-bold shadow-xs whitespace-nowrap transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles size={13} /> Build Agriculture CV →
        </Link>
      </div>
    );
  }

  // Default "grid" card variant (designed for 2-column or 3-column job feeds)
  return (
    <div
      className={`card p-4 sm:p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950 text-white flex flex-col justify-between border border-emerald-800/60 shadow-md relative overflow-hidden group min-h-[220px] ${className}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" /> Free Tool
          </span>
          <span className="text-[11px] text-emerald-300 font-semibold">ATS-Friendly</span>
        </div>
        <h3 className="font-display font-bold text-base text-white leading-snug">
          {title}
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="pt-3.5 mt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">1-Click PDF Download</span>
        <Link
          to="/resume-builder"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-1.5 px-3.5 rounded-lg font-bold shadow-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
        >
          Build Resume <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default ResumePromoCard;
