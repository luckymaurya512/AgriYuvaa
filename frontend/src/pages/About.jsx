import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Landmark,
  BookOpen,
  Compass,
  Newspaper,
  CheckCircle2,
  Sparkles,
  UserPlus,
  SearchCheck,
  Handshake,
} from "lucide-react";
import SEO from "../components/SEO.jsx";
import CommunityBanner from "../components/CommunityBanner.jsx";

const steps = [
  { icon: UserPlus, title: "Create Your Profile", desc: "Add your skills, education, and preferred agri sectors in minutes." },
  { icon: SearchCheck, title: "Search & Apply", desc: "Filter jobs by crop, category, location, and employment type." },
  { icon: Handshake, title: "Get Hired", desc: "Track your applications and connect directly with employers." },
];

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
    emoji: "📝",
    title: "Resume & Profile Builder",
    desc: "Create professional ATS-friendly agriculture resumes, highlight your crop specialties, and download for free.",
    link: "/resume-builder",
    linkText: "Build Free Resume →",
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

          {/* <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            As agriculture continues to evolve through agri-tech, agribusiness, horticulture, food processing, biotechnology, and digital agriculture, AgriYuvaa connects young talent with relevant jobs, internships, learning opportunities, career guidance, and industry exposure.
          </p> */}

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

        {/* ── HOW AGRIYUVAA WORKS ── */}
        <section className="card p-6 sm:p-10 lg:p-12 border border-brand-border bg-white rounded-3xl shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-black">
              How AgriYuvaa Works
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey">
              Get hired in India’s leading agriculture organizations in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, idx) => (
              <div key={step.title} className="text-center relative">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-brand-black text-brand-green flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <step.icon size={26} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Step 0{idx + 1}
                </span>
                <h3 className="font-display font-bold mb-1.5 text-base text-brand-black">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-grey max-w-xs mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
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

        {/* ── RESUME BUILDER SECTION ── */}
        <section className="card p-6 sm:p-10 border-2 border-emerald-500/20 bg-gradient-to-br from-slate-950 via-emerald-950 to-green-950 text-white rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Free Candidate Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Build an ATS-Friendly Agriculture Resume in Minutes
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Create a recruiter-ready CV tailored for Agronomy, Horticulture, Farm Management, ICAR research, and AgriTech roles with pre-filled agriculture skills, education templates, and instant 1-click clean PDF download.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/resume-builder"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Sparkles size={15} />
                <span>Build Free Resume →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY BANNER ── */}
        <section>
          <CommunityBanner />
        </section>

      </div>
    </div>
  );
};

export default About;
