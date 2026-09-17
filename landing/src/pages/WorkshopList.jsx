import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ExternalLink, ArrowRight } from "lucide-react";
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

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops()
      .then((data) => setWorkshops(data || []))
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  }, []);

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
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={getWorkshopThumbnail(w)}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
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

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    {w.price > 0 ? (
                      <span className="text-sm font-bold text-emerald-600">₹{w.price.toLocaleString()}</span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Free</span>
                    )}

                    {w.registrationUrl ? (
                      <a
                        href={w.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Register <ExternalLink size={13} />
                      </a>
                    ) : (
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Enquire <ArrowRight size={13} />
                      </Link>
                    )}
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

      <style>{`
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default WorkshopList;
