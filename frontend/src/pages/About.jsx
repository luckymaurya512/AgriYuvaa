import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Landmark,
  BookOpen,
  Compass,
  Newspaper,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import SEO from "../components/SEO.jsx";
import ResumePromoCard from "../components/ResumePromoCard.jsx";
import CommunityPromoCard from "../components/CommunityPromoCard.jsx";
import CommunityBanner from "../components/CommunityBanner.jsx";

const whatWeOfferList = [
  {
    icon: Briefcase,
    emoji: "🌱",
    title: "Agriculture Jobs",
    desc: "Discover verified employment opportunities across agriculture, agritech, and allied sectors.",
    link: "/jobs",
    linkText: "Browse Jobs →",
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-800 border-emerald-200",
  },
  {
    icon: GraduationCap,
    emoji: "🎓",
    title: "Internships",
    desc: "Find hands-on opportunities for practical farm experience, corporate internships, and industry exposure.",
    link: "/jobs?employmentType=internship",
    linkText: "Find Internships →",
    color: "from-blue-500/10 to-blue-500/5 text-blue-800 border-blue-200",
  },
  {
    icon: Landmark,
    emoji: "🏛️",
    title: "Government Jobs & Exams",
    desc: "Stay updated with central & state agriculture vacancies, ICAR, NABARD, IBPS AFO, and exam notifications.",
    link: "/govt-jobs",
    linkText: "View Govt Jobs →",
    color: "from-purple-500/10 to-purple-500/5 text-purple-800 border-purple-200",
  },
  {
    icon: BookOpen,
    emoji: "📚",
    title: "Courses & Skill Development",
    desc: "Explore hands-on courses, expert workshops, webinars, and specialized agri-skill training programs.",
    link: "https://agriyuvaa.com/workshops",
    isExternal: true,
    linkText: "Explore Workshops →",
    color: "from-amber-500/10 to-amber-500/5 text-amber-800 border-amber-200",
  },
  {
    icon: Compass,
    emoji: "💼",
    title: "Career Guidance",
    desc: "Access useful agricultural career resources, interview preparation notes, and expert mentorship.",
    link: "/resume-builder",
    linkText: "Career Resources →",
    color: "from-teal-500/10 to-teal-500/5 text-teal-800 border-teal-200",
  },
  {
    icon: Newspaper,
    emoji: "📰",
    title: "Agriculture Updates",
    desc: "Stay informed about latest government schemes, agri-events, industry milestones, and sector updates.",
    link: "https://agriyuvaa.com/blogs",
    isExternal: true,
    linkText: "Read Updates →",
    color: "from-slate-500/10 to-slate-500/5 text-slate-800 border-slate-200",
  },
];

const About = () => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <SEO
        title="About AgriYuvaa - Empowering Agriculture's Next Generation"
        description="AgriYuvaa is India's leading youth-focused agriculture platform, connecting students, freshers, and professionals with verified jobs, internships, government exams, and career resources."
        canonical="/about"
      />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-green-950 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <span>🌾 About AgriYuvaa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
            Empowering Agriculture’s <br className="hidden sm:inline" />
            <span className="text-[#fca34d]">Next Generation</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-normal">
            AgriYuvaa is a youth-focused agriculture platform that helps students, freshers, and professionals discover opportunities, build skills, and grow their careers in agriculture and allied sectors.
          </p>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            As agriculture continues to evolve through agri-tech, agribusiness, horticulture, food processing, biotechnology, and digital agriculture, AgriYuvaa connects young talent with relevant jobs, internships, learning opportunities, career guidance, and industry exposure.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Jobs & Internships</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/resume-builder"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} className="text-amber-400" />
              <span>Build Free Resume</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* ── AGRIYUVAA JOB PORTAL SPOTLIGHT ── */}
        <section className="card p-6 sm:p-10 lg:p-12 border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-md inline-block">
                Dedicated Employment Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-black">
                AgriYuvaa Job Portal
              </h2>
              <p className="text-sm sm:text-base text-brand-grey font-medium leading-relaxed">
                AgriYuvaa Job Portal is one of <strong>India’s Best Agriculture Job Portals</strong>, connecting agriculture students, freshers, and professionals with job and internship opportunities across India.
              </p>
              <p className="text-xs sm:text-sm text-brand-grey leading-relaxed">
                Explore opportunities in agriculture, agribusiness, horticulture, agri-tech, food processing, agricultural inputs, and allied sectors. Create your professional resume, discover relevant job openings, and take the next step in your career.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs lg:w-80 shrink-0 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" /> All-in-One Platform
              </div>
              <p className="text-xs text-brand-grey leading-relaxed">
                Whether you're looking for your first internship, first job, or your next career opportunity, AgriYuvaa Job Portal helps you find relevant opportunities in one place.
              </p>
              <Link
                to="/jobs"
                className="btn-primary w-full text-center block text-xs py-2.5 font-bold"
              >
                Browse All Openings →
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHAT WE OFFER (6 PILLARS) ── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-black">
              What We Offer
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey">
              Everything you need to launch and accelerate a rewarding career in Indian agriculture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeOfferList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className={`card p-6 border transition-all hover:shadow-md flex flex-col justify-between space-y-4 bg-gradient-to-b ${item.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <h3 className="font-display font-bold text-base text-brand-black">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-grey leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-green-dark hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        {item.linkText}
                      </a>
                    ) : (
                      <Link
                        to={item.link}
                        className="text-xs font-bold text-brand-green-dark hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        {item.linkText}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── OUR VISION & MISSION ── */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 sm:p-8 border border-emerald-200/80 bg-emerald-50/30 rounded-3xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-brand-black">Our Vision</h3>
              <p className="text-xs sm:text-sm text-brand-grey mt-2 leading-relaxed">
                To build an accessible and connected career ecosystem for the next generation of agriculture professionals.
              </p>
            </div>
          </div>

          <div className="card p-6 sm:p-8 border border-amber-200/80 bg-amber-50/30 rounded-3xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-brand-black">Our Mission</h3>
              <p className="text-xs sm:text-sm text-brand-grey mt-2 leading-relaxed">
                To connect, inform, and empower agriculture youth through access to jobs, internships, learning opportunities, career resources, and industry exposure.
              </p>
            </div>
          </div>
        </section>

        {/* ── PROMO HIGHLIGHT: COMMUNITY & RESUME BUILDER ── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
              Free Platform Tools & Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-black">
              Accelerate Your Agricultural Career
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey">
              Take advantage of our community channels and free resume builder to stay ahead of opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CommunityPromoCard
              variant="grid"
              title="Join India's Best Agriculture Community"
              subtitle="Connect with 15,000+ students and professionals. Get instant daily job notifications, ICAR exam study materials, and direct updates on WhatsApp."
            />
            <ResumePromoCard
              variant="grid"
              title="Build an ATS-Friendly Agriculture CV"
              description="Craft a standout resume tailored for agronomy, farm management, ICAR research, and agritech roles in 2 minutes with free instant PDF download."
            />
          </div>
        </section>

        {/* ── FULL COMMUNITY BANNER ── */}
        <section>
          <CommunityBanner />
        </section>

        {/* ── BE PART OF AGRIYUVAA (CALLOUT) ── */}
        <section className="card p-8 sm:p-12 text-center bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 text-white rounded-3xl space-y-5 shadow-xl border border-emerald-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>🌱 Be Part of AgriYuvaa</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Learn. Connect. Explore. Grow.
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Join AgriYuvaa and discover opportunities that can help you build a rewarding career in agriculture.
          </p>

          <p className="text-lg sm:text-xl font-display font-bold text-[#fca34d]">
            Your Career in Agriculture Starts Here.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm cursor-pointer"
            >
              Get Started for Free →
            </Link>
            <Link
              to="/jobs"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm cursor-pointer"
            >
              Browse Openings
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
