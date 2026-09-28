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
import logo from "../assets/logo.png";
import SEO from "../components/SEO.jsx";

const whatWeOfferList = [
  {
    icon: Briefcase,
    emoji: "🌱",
    title: "Agriculture Jobs",
    desc: "Discover verified employment opportunities across agriculture, agritech, and allied sectors.",
    link: "https://job.agriyuvaa.com/jobs",
    linkText: "Browse Jobs →",
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-800 border-emerald-200",
  },
  {
    icon: GraduationCap,
    emoji: "🎓",
    title: "Internships",
    desc: "Find hands-on opportunities for practical farm experience, corporate internships, and industry exposure.",
    link: "https://job.agriyuvaa.com/jobs?employmentType=internship",
    linkText: "Find Internships →",
    color: "from-blue-500/10 to-blue-500/5 text-blue-800 border-blue-200",
  },
  {
    icon: Landmark,
    emoji: "🏛️",
    title: "Government Jobs & Exams",
    desc: "Stay updated with central & state agriculture vacancies, ICAR, NABARD, IBPS AFO, and exam notifications.",
    link: "https://job.agriyuvaa.com/govt-jobs",
    linkText: "View Govt Jobs →",
    color: "from-purple-500/10 to-purple-500/5 text-purple-800 border-purple-200",
  },
  {
    icon: BookOpen,
    emoji: "📚",
    title: "Courses & Skill Development",
    desc: "Explore hands-on courses, expert workshops, webinars, and specialized agri-skill training programs.",
    link: "/workshops",
    linkText: "Explore Workshops →",
    color: "from-amber-500/10 to-amber-500/5 text-amber-800 border-amber-200",
  },
  {
    icon: Compass,
    emoji: "💼",
    title: "Career Guidance",
    desc: "Access useful agricultural career resources, interview preparation notes, and expert mentorship.",
    link: "https://job.agriyuvaa.com/resume-builder",
    linkText: "Career Resources →",
    color: "from-teal-500/10 to-teal-500/5 text-teal-800 border-teal-200",
  },
  {
    icon: Newspaper,
    emoji: "📰",
    title: "Agriculture Updates",
    desc: "Stay informed about latest government schemes, agri-events, industry milestones, and sector updates.",
    link: "/blogs",
    linkText: "Read Updates →",
    color: "from-slate-500/10 to-slate-500/5 text-slate-800 border-slate-200",
  },
];

const About = () => {
  return (
    <div className="pt-24 pb-20">
      <SEO
        title="About AgriYuvaa - Empowering Agriculture's Next Generation"
        description="AgriYuvaa is a youth-focused agriculture platform connecting students, freshers, and professionals with jobs, internships, courses, and career guidance."
        canonical="/about"
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <img src={logo} alt="AgriYuvaa" className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-md" />
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            🌾 About AgriYuvaa
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Empowering Agriculture’s <span className="text-[#fca34d]">Next Generation</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            AgriYuvaa is a youth-focused agriculture platform that helps students, freshers, and professionals discover opportunities, build skills, and grow their careers in agriculture and allied sectors.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            As agriculture continues to evolve through agri-tech, agribusiness, horticulture, food processing, biotechnology, and digital agriculture, AgriYuvaa connects young talent with relevant jobs, internships, learning opportunities, career guidance, and industry exposure.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://job.agriyuvaa.com/jobs"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm inline-flex items-center gap-2"
            >
              Explore Job Portal <ArrowRight size={15} />
            </a>
            <a
              href="https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm inline-flex items-center gap-2"
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Job Portal Spotlight */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-green-50 border border-emerald-200 shadow-sm space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-md inline-block">
            Flagship Employment Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            AgriYuvaa Job Portal
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            AgriYuvaa Job Portal is one of <strong>India’s Best Agriculture Job Portals</strong>, connecting agriculture students, freshers, and professionals with job and internship opportunities across India.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Explore opportunities in agriculture, agribusiness, horticulture, agri-tech, food processing, agricultural inputs, and allied sectors. Create your professional resume, discover relevant job openings, and take the next step in your career.
          </p>
          <div className="p-4 rounded-2xl bg-white border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              Whether you're looking for your first internship, first job, or your next career opportunity, AgriYuvaa Job Portal helps you find relevant opportunities in one place.
            </p>
            <a
              href="https://job.agriyuvaa.com"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-xs inline-flex items-center gap-1.5 shrink-0"
            >
              Visit Portal <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* What We Offer Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What We Offer</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Structured avenues to build, upskill, and grow your career in agriculture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeOfferList.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between space-y-3 bg-gradient-to-b ${item.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <h3 className="font-bold text-base text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-gray-200/50">
                  <a
                    href={item.link}
                    className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    {item.linkText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              To build an accessible and connected career ecosystem for the next generation of agriculture professionals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-5">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              To connect, inform, and empower agriculture youth through access to jobs, internships, learning opportunities, career resources, and industry exposure.
            </p>
          </div>
        </div>

        {/* Special Community & Resume Builder Advertising Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Join The Movement</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Community & Career Tools</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp Community Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white flex flex-col justify-between space-y-4 shadow-md border border-emerald-800">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#25D366]/20 text-emerald-300 border border-[#25D366]/30 px-2 py-0.5 rounded-full inline-block">
                  15,000+ Agri Youths
                </span>
                <h3 className="text-xl font-bold">Join India's Best Agriculture Community</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Connect with fellow students, get daily verified job drops, free ICAR/AFO notes, and exclusive webinar invites directly on WhatsApp.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">100% Free</span>
                <a
                  href="https://chat.whatsapp.com/KXExVgaKwi28tQIRItEepl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs py-2 px-4 rounded-xl font-bold transition-all shadow-xs"
                >
                  Join WhatsApp Community →
                </a>
              </div>
            </div>

            {/* Resume Builder Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-emerald-950 text-white flex flex-col justify-between space-y-4 shadow-md border border-emerald-800">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full inline-block">
                  ATS Resume Builder
                </span>
                <h3 className="text-xl font-bold">Build an Agriculture CV in 2 Mins</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Create a recruiter-ready CV tailored for Agronomy, Horticulture, AgriTech, and ICAR research jobs with instant 1-click clean PDF download.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Free Candidate Tool</span>
                <a
                  href="https://job.agriyuvaa.com/resume-builder"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-2 px-4 rounded-xl font-bold transition-all shadow-xs"
                >
                  Build Resume Free →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Be Part of AgriYuvaa CTA */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 rounded-3xl p-10 text-white text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <span>🌱 Be Part of AgriYuvaa</span>
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight">Learn. Connect. Explore. Grow.</h3>
          <p className="text-emerald-50 max-w-lg mx-auto text-sm leading-relaxed">
            Join AgriYuvaa and discover opportunities that can help you build a rewarding career in agriculture.
          </p>
          <p className="text-xl font-extrabold text-[#fca34d]">
            Your Career in Agriculture Starts Here.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://job.agriyuvaa.com/register"
              className="bg-white text-emerald-900 font-bold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-all text-sm shadow-md"
            >
              Get Started for Free →
            </a>
            <a
              href="https://job.agriyuvaa.com/jobs"
              className="bg-emerald-900/60 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-900 transition-all text-sm"
            >
              Browse Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
