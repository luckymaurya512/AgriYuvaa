import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Landmark,
  BookOpen,
  Compass,
  Newspaper,
  ArrowRight,
  CheckCircle2,
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

      </div>
    </div>
  );
};

export default About;
