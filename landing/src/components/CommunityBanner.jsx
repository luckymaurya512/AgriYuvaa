import React from "react";
import { ArrowRight } from "lucide-react";

// Official brand SVG icons matching the design
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const communityChannels = [
  {
    name: "WhatsApp",
    link: "https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl",
    icon: WhatsAppIcon,
    iconBg: "bg-[#25D366]",
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/agri_yuvaa/",
    icon: InstagramIcon,
    iconBg: "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600",
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/agriyuvaa/",
    icon: LinkedInIcon,
    iconBg: "bg-[#0077B5]",
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/@agri_yuvaa",
    icon: YouTubeIcon,
    iconBg: "bg-[#FF0000]",
  },
];

const CommunityBanner = () => {
  const handleJoinPrimary = () => {
    window.open("https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-12">
      <div
        className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-14 text-white shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #047857 45%, #065f46 100%)",
        }}
      >
        {/* Subtle dot matrix pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.7) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Ambient Radial Highlights */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Text & CTA Section */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Join India's Best <br className="hidden sm:inline" />
              Agriculture <br className="hidden sm:inline" />
              <span className="text-[#fca34d]">Community.</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-50/90 max-w-lg leading-relaxed font-normal">
              Connect with students, get daily career updates, exclusive workshop invites, and mentorship access.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleJoinPrimary}
                className="bg-white text-emerald-950 font-bold px-7 py-3 rounded-full flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all shadow-md text-sm cursor-pointer"
              >
                <span>Join Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Cards Grid (2x2 symmetrical clean cards) */}
          <div
            id="community-channels-grid"
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4"
          >
            {communityChannels.map((c) => (
              <a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 sm:p-5 rounded-2xl bg-[#065f46]/60 hover:bg-[#065f46]/95 border border-white/15 hover:border-white/40 backdrop-blur-sm transition-all duration-200 flex items-center gap-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Brand Icon Square */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${c.iconBg} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  <c.icon />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-lg text-white truncate leading-tight group-hover:text-emerald-200 transition-colors">
                    {c.name}
                  </h3>
                  <ArrowRight
                    size={16}
                    className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBanner;
