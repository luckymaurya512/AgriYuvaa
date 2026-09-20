import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Play, Youtube, X, ArrowRight } from "lucide-react";
import { fetchWorkshops } from "../services/landingService.js";
import SEO from "../components/SEO.jsx";

/* ─── Workshop Thumbnails ─────────────────────────── */
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

const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchWorkshops()
      .then((data) => setWorkshops(data || []))
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  }, []);

  const handleWatch = (w) => {
    const url = w.videoUrl || w.youtubeUrl || w.registrationUrl || "https://www.youtube.com/@agri_yuvaa";
    const ytId = getYoutubeId(url);
    if (ytId) {
      setActiveVideo({ id: ytId, title: w.title, url });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Hands-on Agriculture Workshops & Practical Training"
        description="Explore practical agricultural workshops on hydroponics, drone technology, beekeeping, biofloc, and precision farming for students and youth."
        canonical="/workshops"
      />
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Workshops & <span className="text-emerald-400">Trainings</span>
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Hands-on workshops designed to equip young farmers with cutting-edge skills in modern agriculture.
          </p>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🎓</span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No workshops available</h3>
            <p className="text-sm text-gray-500">Check back soon for upcoming trainings!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((w) => (
              <div
                key={w._id}
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
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{w.title}</h3>
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

                  {/* Action Row: Watch Now Button */}
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
        )}
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-lime-600 rounded-2xl px-8 py-10 text-center text-white">
          <h3 className="text-2xl font-extrabold mb-2">Interested in hosting a workshop?</h3>
          <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
            We partner with agricultural organizations, NGOs, and educational institutions.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all text-sm"
          >
            Contact Us <ArrowRight size={15} />
          </Link>
        </div>
      </div>

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
            <div className="p-3.5 bg-gray-950 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                <span>🌾 Free Video Workshop by AgriYuvaa</span>
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
