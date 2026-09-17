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

/* ─── Workshop Icon by Category ──────────────────── */
const workshopEmojis = {
  beekeeping: "🐝",
  biofloc: "🐟",
  drone: "🚁",
  hydroponics: "🌱",
  mushroom: "🍄",
  saffron: "🌸",
  precision: "📡",
};

const getWorkshopEmoji = (title = "") => {
  const t = title.toLowerCase();
  for (const [key, emoji] of Object.entries(workshopEmojis)) {
    if (t.includes(key)) return emoji;
  }
  return "🌾";
};

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
    fetchTestimonials()
      .then((data) => setTestimonials(data || []))
      .catch(() => setTestimonials([]));
    fetchBlogs({ limit: 3 })
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
        {/* Background Image Layer with Cinematic Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="AgriYuvaa Modern Agriculture"
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-40 scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop";
            }}
          />
          {/* Radial & directional gradient overlays for pristine text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80" />
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Empowering the{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                  Next Generation
                </span>
              </span>{" "}
              of Agriculture
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {workshops.map((w) => (
                <div
                  key={w._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-lime-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform">
                    {getWorkshopEmoji(w.title)}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-2">{w.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{w.description}</p>
                  {w.duration && (
                    <span className="inline-block mt-3 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                      {w.duration}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {["Beekeeping", "Biofloc Fish", "Drone Tech", "Hydroponics", "Mushroom", "Saffron", "Precision"].map((name) => (
                <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-lime-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                    {getWorkshopEmoji(name)}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{name} Farming</h3>
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
      {blogs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ⭐ Our Blogs
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Agri News & <span className="text-emerald-600">Updates</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-lime-50 flex items-center justify-center overflow-hidden">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span className="text-5xl" style={{ display: blog.coverImage ? "none" : "block" }}>📰</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {blog.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : ""}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        Read More <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
              >
                View All Blogs <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

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
