import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  MapPin,
  Heart,
  Sprout,
  Zap,
  Briefcase,
  Globe,
  Mail,
  Phone,
  Send,
  Clock,
  Play,
  Youtube,
} from "lucide-react";
import { fetchWorkshops, fetchTestimonials, fetchBlogs } from "../services/landingService.js";
import logo from "../assets/logo.png";
import SEO from "../components/SEO.jsx";

/* ─── Animated Counter ───────────────────────────── */
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target.replace(/[^0-9]/g, ""));
          const duration = 2000;
          const steps = 60;
          const increment = num / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ─── Workshop Thumbnails & Badges ─────────────────── */
const defaultWorkshopImages = {
  drone: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
  hydroponics: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop",
  mushroom: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=800&auto=format&fit=crop",
  beekeeping: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=800&auto=format&fit=crop",
  biofloc: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop",
  saffron: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop",
  precision: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop",
};

const getWorkshopThumbnail = (w = {}) => {
  if (w.coverImage && w.coverImage.trim()) {
    return w.coverImage;
  }
  const title = (w.title || "").toLowerCase();
  for (const [key, url] of Object.entries(defaultWorkshopImages)) {
    if (title.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1592417817098-8f3d69102553?q=80&w=800&auto=format&fit=crop";
};

/* ─── Blog Thumbnails & Fallbacks ─────────────────── */
const defaultBlogImages = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
];

const fallbackBlogs = [
  {
    _id: "fb_1",
    slug: "how-ai-is-transforming-indian-agriculture-2026",
    title: "How AI is Transforming Indian Agriculture in 2026",
    excerpt: "From satellite-driven crop advisories to computer vision-powered pest detection, AI is reshaping farms across India.",
    category: "AI",
    tags: ["AI", "AgriTech"],
    publishedAt: "2025-07-12",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "fb_2",
    slug: "top-10-agriculture-entrance-exams-2026",
    title: "Top 10 Agriculture Entrance Exams for 2026",
    excerpt: "Complete preparation guide and key dates for ICAR AIEEA, state agriculture CETs, and postgraduate entrance exams.",
    category: "EXAMS",
    tags: ["EXAMS"],
    publishedAt: "2025-07-08",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
  },
  {
    _id: "fb_3",
    slug: "government-schemes-every-agri-student-must-know",
    title: "Government Schemes Every Agri Student Must Know",
    excerpt: "Subsidies, funding, and incubation grants under AC&ABC, RKVY-RAFTAAR, and PMFBY for young agriculture entrepreneurs.",
    category: "SCHEMES",
    tags: ["SCHEMES"],
    publishedAt: "2025-07-04",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop",
  },
  {
    _id: "fb_4",
    slug: "career-roadmap-bsc-agriculture-to-agritech-founder",
    title: "Career Roadmap: From B.Sc. Agriculture to AgriTech Founder",
    excerpt: "How young graduates are leveraging domain agriculture knowledge and modern tech to build high-valuation agritech startups.",
    category: "CAREERS",
    tags: ["CAREERS"],
    publishedAt: "2025-06-30",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
  },
];

/* ─── Main Landing Page ──────────────────────────── */
const LandingPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    fetchWorkshops()
      .then((data) => setWorkshops(data || []))
      .catch(() => setWorkshops([]));
    fetchTestimonials({ targetSite: "landing" })
      .then((data) => setTestimonials(data || []))
      .catch(() => setTestimonials([]));
    fetchBlogs({ limit: 4, targetSite: "landing" })
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]));
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const stats = [
    { icon: Users, value: "5000", suffix: "+", label: "Youth Empowered" },
    { icon: GraduationCap, value: "50", suffix: "+", label: "Workshops Conducted" },
    { icon: MapPin, value: "25", suffix: "+", label: "States Covered" },
    { icon: Heart, value: "18000", suffix: "+", label: "Happy Learners" },
  ];

  const features = [
    { icon: Sprout, title: "Youth Empowerment", desc: "Building the next generation of agricultural leaders across India." },
    { icon: Zap, title: "Skill Development", desc: "Hands-on workshops in drone technology, hydroponics, and more." },
    { icon: Briefcase, title: "Career Opportunities", desc: "Connecting young talent with verified agriculture job openings." },
    { icon: Globe, title: "Agriculture Community", desc: "A vibrant network of students, farmers, and agri-entrepreneurs." },
  ];

  return (
    <div className="overflow-hidden">
      <SEO
        title="AgriYuvaa — Where Youth Meets Agriculture"
        description="India's premier platform for agriculture students. Workshops, blogs, career guidance & community for the next generation of agricultural leaders."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AgriYuvaa",
          url: "https://agriyuvaa.com",
          logo: "https://agriyuvaa.com/logo.png",
          description: "India's premier platform for agriculture students. Workshops, blogs, career guidance & community for the next generation of agricultural leaders.",
          sameAs: [],
        }}
      />
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-gray-950 overflow-hidden">
        {/* Background Image Layer with Balanced Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="AgriYuvaa Modern Agriculture"
            className="w-full h-full object-cover object-center opacity-75 sm:opacity-85 scale-100 transition-all duration-700"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop";
            }}
          />
          {/* Subtle directional gradient — keeps left side readable while letting the lush landscape & sunrise shine through */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/60" />
        </div>

        {/* Animated ambient background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 14}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Sprout size={14} />
              <span>Where Youth Meets Agriculture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg">
              Empowering the{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                  Next Generation
                </span>
              </span>{" "}
              of Agriculture
            </h1>

            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 drop-shadow-sm">
              AgriYuvaa is the best platform for agriculture students — connecting, inspiring, and
              empowering young individuals to lead the future of Indian agriculture.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="https://job.agriyuvaa.com"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 text-sm group"
              >
                Explore Agriculture Jobs
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-2xl transition-all backdrop-blur-sm border border-white/10 text-sm"
              >
                Join a Workshop
              </Link>
            </div>
          </div>

          {/* Hero visual — stats grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/[0.14] hover:border-emerald-400/40 transition-all duration-300 shadow-xl group hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <stat.icon size={28} className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════ MOBILE STATS ══════════════════ */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-emerald-50 rounded-2xl p-5 text-center">
              <stat.icon size={22} className="text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-gray-900">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ ABOUT ══════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 to-lime-50 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-4 relative z-10">
                <img src={logo} alt="AgriYuvaa" className="w-28 h-28 object-contain mx-auto drop-shadow-md" />
                <h3 className="text-2xl font-bold text-emerald-900">AgriYuvaa</h3>
                <p className="text-emerald-700 text-sm max-w-xs mx-auto">Where Youth Meets Agriculture — Building the future of farming, one student at a time.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-200/50 rounded-full blur-2xl" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-lime-200/50 rounded-full blur-2xl" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Trusted Platform</div>
                <div className="text-xs text-gray-500">5000+ Youth Empowered</div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              ⭐ About Our Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
              Online Learning<br />
              <span className="text-emerald-600">Wherever And Whenever.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              AgriYuvaa is the best platform for agriculture students, committed to inspiring and
              empowering the next generation of agricultural leaders by creating a platform for young
              individuals in agriculture to connect, share their journeys, and support one another.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feat) => (
                <div key={feat.title} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <feat.icon size={18} className="text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-0.5">{feat.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-md"
            >
              Find Out More <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WORKSHOPS ═══════════════════ */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              ⭐ Workshop & Trainings
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Learn from the <span className="text-emerald-600">Experts</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Hands-on workshops designed to equip young farmers with cutting-edge skills in modern agriculture.
            </p>
          </div>

          {workshops.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {workshops.map((w) => (
                <div
                  key={w._id}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-xs"
                >
                  {/* Thumbnail with Play Overlay */}
                  <Link to="/workshops" className="relative h-48 w-full overflow-hidden bg-gray-100 block group/thumb">
                    <img
                      src={getWorkshopThumbnail(w)}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-115">
                        <Play size={18} className="fill-current ml-0.5" />
                      </div>
                    </div>

                    {w.category && (
                      <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/95 text-emerald-800 px-3 py-1 rounded-full shadow-sm backdrop-blur-xs">
                        {w.category}
                      </span>
                    )}
                    {w.duration && (
                      <span className="absolute bottom-3 left-3 text-[11px] font-semibold bg-black/65 text-white px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                        ⏱️ {w.duration}
                      </span>
                    )}
                  </Link>

                  {/* Content: Title & Description */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-1">
                        {w.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {w.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                        <Youtube size={14} /> Free Video
                      </span>
                      <Link
                        to="/workshops"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform"
                      >
                        <Play size={12} className="fill-current" /> Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Drone Technology in Agriculture", desc: "Master drone operations, precision aerial spraying, NDVI mapping, and automated crop health monitoring.", category: "AgriTech", key: "drone", duration: "3 Days" },
                { title: "Hydroponics & Vertical Farming", desc: "Commercial soil-less cultivation techniques, nutrient management, and climate-controlled greenhouse setups.", category: "Modern Farming", key: "hydroponics", duration: "2 Days" },
                { title: "Mushroom Cultivation & Processing", desc: "Step-by-step training on oyster and button mushroom spawning, farm shed setup, and profitable market linkages.", category: "Horticulture", key: "mushroom", duration: "2 Days" },
                { title: "Commercial Beekeeping (Apiculture)", desc: "Comprehensive hive management, seasonal flora migration, honey extraction, and natural beeswax value addition.", category: "Farming", key: "beekeeping", duration: "3 Days" },
                { title: "Biofloc Fish Farming System", desc: "Sustainable intensive aquaculture, zero water discharge methods, biofloc microbial balance, and commercial tanks.", category: "Aquaculture", key: "biofloc", duration: "3 Days" },
                { title: "Precision Agriculture & Satellite GIS", desc: "Harness IoT sensors, soil telemetry, variable rate applications, and satellite analytics for yield maximization.", category: "AgriTech", key: "precision", duration: "4 Days" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-xs"
                >
                  <Link to="/workshops" className="relative h-48 w-full overflow-hidden bg-gray-100 block group/thumb">
                    <img
                      src={defaultWorkshopImages[item.key]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-115">
                        <Play size={18} className="fill-current ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/95 text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold bg-black/65 text-white px-2.5 py-0.5 rounded-md">
                      ⏱️ {item.duration}
                    </span>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                        <Youtube size={14} /> Free Video
                      </span>
                      <Link
                        to="/workshops"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <Play size={12} className="fill-current" /> Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/workshops"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              View All Workshops <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Left heading */}
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  ⭐ Testimonial
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                  What Our Agri Youth <span className="text-emerald-600">Said...</span>
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Our doors are always open for you, no matter how high we rise.
                </p>
                {/* Navigation dots */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="text-xs text-gray-400 ml-2">
                    {activeTestimonial + 1} / {testimonials.length}
                  </span>
                </div>
              </div>

              {/* Right testimonial card */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                  <div className="absolute top-4 right-6 text-6xl text-emerald-200 font-serif">"</div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonials[activeTestimonial]?.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                    {testimonials[activeTestimonial]?.content}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                      {testimonials[activeTestimonial]?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonials[activeTestimonial]?.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {testimonials[activeTestimonial]?.role || "Agriculture Student"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════ BLOG ════════════════════════ */}
      {(() => {
        const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;
        const featuredBlog = displayBlogs[0];
        const sideBlogs = displayBlogs.slice(1, 4);

        const formatDate = (dateStr) => {
          if (!dateStr) return "Recently";
          try {
            return new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch {
            return "Recently";
          }
        };

        const getBlogImg = (b, idx) => {
          return b.coverImage || defaultBlogImages[idx % defaultBlogImages.length];
        };

        return (
          <section className="py-20 bg-gray-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                    ⭐ Agriculture Insights & News
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Latest Agri <span className="text-emerald-600">Articles</span>
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  View All Blogs <ArrowRight size={15} />
                </Link>
              </div>

              {/* 2-Column Grid: Featured Big Blog (Left) + 3 Small Blogs (Right) */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* ── LEFT: BIG FEATURED BLOG (7 cols) ── */}
                {featuredBlog && (
                  <div className="lg:col-span-7">
                    <Link
                      to={`/blog/${featuredBlog.slug || featuredBlog._id}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-100 mb-5 shadow-xs group-hover:shadow-xl transition-all duration-300">
                        <img
                          src={getBlogImg(featuredBlog, 0)}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                            {featuredBlog.category || featuredBlog.tags?.[0] || "AI"}
                          </span>
                          <span>
                            {formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock size={13} /> {featuredBlog.readTime || "6 min"}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">
                          {featuredBlog.title}
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                          {featuredBlog.excerpt ||
                            (featuredBlog.content
                              ? featuredBlog.content.substring(0, 160).replace(/<[^>]+>/g, "")
                              : "Read the full article on AgriYuvaa for career insights and latest technology updates in Indian agriculture.")}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* ── RIGHT: 3 SMALLER SIDE BLOGS (5 cols) ── */}
                <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                  {sideBlogs.map((b, idx) => (
                    <Link
                      key={b._id || idx}
                      to={`/blog/${b.slug || b._id}`}
                      className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex items-center gap-4 group cursor-pointer"
                    >
                      {/* 16:9 Thumbnail */}
                      <div className="w-28 sm:w-32 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={getBlogImg(b, idx + 1)}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                            {b.category || b.tags?.[0] || "Articles"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {formatDate(b.publishedAt || b.createdAt)}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                          {b.title}
                        </h4>

                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {b.readTime || "4 min"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════ JOB PORTAL CTA ═════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 rounded-3xl px-8 sm:px-12 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-lime-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                🌾 Agriculture Job Portal
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Find Your Dream Agriculture Career
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
                Browse thousands of verified agriculture job openings across India. Build your resume,
                apply with one click, and connect directly with top agri-employers.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <a
                  href="https://job.agriyuvaa.com"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 text-sm group"
                >
                  Explore Agriculture Jobs
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://job.agriyuvaa.com/register"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-2xl transition-all backdrop-blur-sm border border-white/10 text-sm"
                >
                  Post a Job (Employers)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONTACT ═════════════════════ */}
      <section className="py-20 bg-gray-50" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ⭐ Contact Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Get In <span className="text-emerald-600">Touch</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Have questions about our workshops, job portal, or partnerships? We'd love to hear from you.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Email</h4>
                    <p className="text-sm text-gray-500">agriyuvaa@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Phone</h4>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Office</h4>
                    <p className="text-sm text-gray-500">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              {contactSent ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500">Thanks for reaching out. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4"
                  onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <input
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                  <textarea
                    required
                    placeholder="Your message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.3; }
          100% { transform: translateY(-20px); opacity: 0.6; }
        }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default LandingPage;
