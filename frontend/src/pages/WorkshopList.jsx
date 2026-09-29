import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Play, Youtube, X, ArrowRight, BookOpen, Calendar, Search, Sparkles, GraduationCap } from "lucide-react";
import { fetchWorkshops, fetchBlogs } from "../services/landingService.js";
import { getWorkshopThumbnail } from "../utils/fallbackData.js";
import SEO from "../components/SEO.jsx";

const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Drone Tech", "Hydroponics", "Mushroom Farming", "Beekeeping", "Biofloc", "Precision Farming"];

  useEffect(() => {
    fetchWorkshops()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workshops || [];
        setWorkshops(list);
      })
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));

    fetchBlogs({ limit: 4 })
      .then((data) => {
        const list = Array.isArray(data?.blogs) ? data.blogs : [];
        setBlogs(list.slice(0, 3));
      })
      .catch(() => setBlogs([]));
  }, []);


  const handleWatch = (w) => {
    const url = w.videoUrl || w.youtubeUrl || w.registrationUrl || "https://www.youtube.com/@agri_yuvaa";
    const ytId = getYoutubeId(url);
    if (ytId) {
      setActiveVideo({ id: ytId, title: w.title, url, category: w.category, instructor: w.instructor, currentId: w._id });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const filteredWorkshops = workshops.filter((w) => {
    const matchesCat = selectedCategory === "All" || (w.category || "").toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search.trim() || `${w.title || ""} ${w.description || ""} ${w.category || ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const otherWorkshops = filteredWorkshops.length === 0 ? workshops : [];

  return (
    <div className="pb-20">
      <SEO
        title="Hands-on Agriculture Workshops & Practical Training | AgriYuvaa"
        description="Explore practical agricultural workshops on hydroponics, drone technology, beekeeping, biofloc, and precision farming for students and youth."
        canonical="/workshops"
      />
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-12 sm:py-16 text-center text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <GraduationCap size={14} /> Practical Agricultural Training
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Workshops & <span className="text-emerald-400">Masterclasses</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Hands-on masterclasses designed to equip agriculture students and professionals with modern field skills.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search trainings by skill, topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* If filtered has no direct matches, show fallback alert and other workshops */}
            {filteredWorkshops.length === 0 && otherWorkshops.length > 0 && (
              <div className="p-4 sm:p-5 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-600" />
                    No direct matches found {search ? `for "${search}"` : `in "${selectedCategory}"`}
                  </h3>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    Don't worry! Here are other high-demand practical agricultural trainings you can watch below:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredWorkshops.length > 0 ? filteredWorkshops : otherWorkshops).map((w) => (
                <div
                  key={w._id || w.title}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col shadow-xs"
                >
                  {/* Thumbnail with Play Trigger */}
                  <div
                    onClick={() => handleWatch(w)}
                    className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer group/thumb"
                    title="Click to Watch Workshop"
                  >
                    <img
                      src={getWorkshopThumbnail(w)}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-115">
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
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {w.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                        {w.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        {w.duration && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {w.duration}
                          </span>
                        )}
                        {w.instructor && (
                          <span>By {w.instructor}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                        <Youtube size={14} /> Free Video
                      </span>

                      <button
                        type="button"
                        onClick={() => handleWatch(w)}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                      >
                        <Play size={13} className="fill-current" /> Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RELATED AGRICULTURE ARTICLES & BLOGS ── */}
      {blogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" /> Agriculture Career Guides & Blogs
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Explore in-depth articles on ICAR preparation, career opportunities, and agri-business trends.
              </p>
            </div>
            <Link
              to="/blog"
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
            >
              All articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b._id || b.slug}
                to={`/blog/${b.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
              >
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {b.tags?.[0] || "Career Insights"}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{b.author || "AgriYuvaa Team"}</span>
                    <span className="font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Read <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 text-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <Youtube className="text-red-500 shrink-0" size={20} />
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Iframe */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-950 border-t border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-emerald-400" />
                  <span>Free Video Workshop by AgriYuvaa</span>
                </span>
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
                >
                  Watch on YouTube ↗
                </a>
              </div>

              {/* Other Workshops within Modal */}
              <div className="pt-3 border-t border-gray-800/80 space-y-2">
                <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-400" /> More Workshops You May Like:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {workshops
                    .filter((w) => w._id !== activeVideo.currentId && w.title !== activeVideo.title)
                    .slice(0, 4)

                    .map((otherW) => (
                      <button
                        key={otherW._id || otherW.title}
                        type="button"
                        onClick={() => handleWatch(otherW)}
                        className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={getWorkshopThumbnail(otherW)}
                          alt={otherW.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">{otherW.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{otherW.category} • {otherW.duration}</p>
                        </div>
                        <Play size={12} className="text-emerald-400 shrink-0" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Related Blogs within Modal */}
              {blogs.length > 0 && (
                <div className="pt-3 border-t border-gray-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <BookOpen size={13} className="text-emerald-400" /> Related Career Guides & Blogs:
                    </p>
                    <Link
                      to="/blog"
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      All articles ↗
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {blogs.slice(0, 2).map((b) => (
                      <Link
                        key={b._id || b.slug}
                        to={`/blog/${b.slug}`}
                        className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 flex items-center gap-2.5 text-left transition-colors group/blog"
                      >
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white group-hover/blog:text-emerald-400 truncate transition-colors">
                            {b.title}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">{b.tags?.[0] || "Career Advice"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default WorkshopList;
