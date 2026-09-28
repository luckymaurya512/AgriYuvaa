import React from "react";
import { Users, ArrowRight, Bell } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const CommunityPromoCard = ({
  variant = "grid",
  title = "Join India's Best Agriculture Community",
  subtitle = "Never miss a job drop or exam alert! Connect with 15,000+ agriculture youths & graduates.",
  className = "",
}) => {
  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl";

  if (variant === "sidebar") {
    return (
      <div
        className={`card p-4 sm:p-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white border border-emerald-700/60 shadow-md space-y-3 relative overflow-hidden group ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-[#25D366]/20 text-emerald-300 border border-[#25D366]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <WhatsAppIcon size={11} className="text-[#25D366]" /> WhatsApp Community
          </span>
          <span className="text-[11px] text-amber-300 font-semibold">15,000+ Youths</span>
        </div>

        <div>
          <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug">
            {title}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Instant Daily Alerts</span>
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs py-1.5 px-3.5 rounded-lg font-bold shadow-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <WhatsAppIcon size={13} /> Join Group <ArrowRight size={12} />
          </a>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`card p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center shrink-0">
            <WhatsAppIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                {title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                15K+ Active
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>

        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs py-2 px-4 rounded-xl font-bold shadow-xs whitespace-nowrap transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <WhatsAppIcon size={14} /> Join WhatsApp →
        </a>
      </div>
    );
  }

  // Default "grid" card variant (designed for 2-column or 3-column job feeds)
  return (
    <div
      className={`card p-4 sm:p-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-green-950 text-white flex flex-col justify-between border border-emerald-700/60 shadow-md relative overflow-hidden group min-h-[220px] ${className}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-[#25D366]/20 text-emerald-300 border border-[#25D366]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <WhatsAppIcon size={11} className="text-[#25D366]" /> WhatsApp Community
          </span>
          <span className="text-[11px] text-amber-300 font-semibold">15,000+ Agri Youths</span>
        </div>
        <h3 className="font-display font-bold text-base text-white leading-snug">
          {title}
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="pt-3.5 mt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">100% Free to Join</span>
        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs py-1.5 px-3.5 rounded-lg font-bold shadow-xs whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <WhatsAppIcon size={13} /> Join WhatsApp <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
};

export default CommunityPromoCard;
