import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Calendar, BookOpen, Sparkles, Play, GraduationCap, AlertCircle } from "lucide-react";
import { fetchBlogs, fetchWorkshops } from "../services/landingService.js";
import SEO from "../components/SEO.jsx";
import { getWorkshopThumbnail } from "../utils/fallbackData.js";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchWorkshops()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workshops || [];
        setWorkshops(list.slice(0, 3));
      })
      .catch(() => setWorkshops([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBlogs({ page, limit: 9, search, targetSite: "landing" })
      .then((data) => {
        const fetched = data.blogs || [];
        setBlogs(fetched);
        setTotalPages(data.pages || 1);

        if (fetched.length === 0) {
          fetchBlogs({ limit: 6, targetSite: "landing" })
            .then((fallbackData) => {
              setOtherBlogs(fallbackData.blogs || []);
            })
            .catch(() => setOtherBlogs([]));
        } else {
          setOtherBlogs([]);
        }
      })
      .catch(() => {
        setBlogs([]);
        setOtherBlogs([]);
      })
      .finally(() => setLoading(false));
  }, [page, search]);


  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };


  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Agriculture Blogs, News & Career Insights"
        description="Read the latest news, technological trends, precision farming updates, and expert career insights for agriculture youth in India."
        canonical="/blogs"
      />
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Agri News & <span className="text-emerald-400">Updates</span>
          </h1>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Stay updated with the latest in agriculture, farming technology, and career insights.
          </p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 backdrop-blur-sm"
              />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading blogs...</div>
        ) : blogs.length === 0 && otherBlogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No blogs found.</p>
            {search && (
              <button
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="mt-3 text-emerald-600 font-semibold text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : blogs.length === 0 ? (
          <div className="space-y-8">
            {/* Informative Alert Banner */}
            <div className="p-4 sm:p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm sm:text-base">
                  <AlertCircle size={18} className="text-amber-600 shrink-0" />
                  <span>
                    No published articles found {search ? `matching "${search}"` : ""}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900/80">
                  Don't worry! Here are other agriculture career guides, interview insights, and articles you can read below:
                </p>
              </div>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Other Blogs Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600" /> Recommended Agriculture Career Guides
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  Showing {otherBlogs.length} articles
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {otherBlogs.map((blog) => (
                  <Link
                    key={blog._id || blog.slug}
                    to={`/blog/${blog.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col shadow-xs"
                  >

                    <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-emerald-100 to-lime-50 flex items-center justify-center overflow-hidden">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-50 to-emerald-50 text-emerald-800/40"
                        style={{ display: blog.coverImage ? "none" : "flex" }}
                      >
                        <BookOpen size={28} />
                        <span className="text-[10px] font-bold tracking-wider text-emerald-900/50 uppercase">AgriYuvaa Insights</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {blog.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-50">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          Read More <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-emerald-100 to-lime-50 flex items-center justify-center overflow-hidden">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-50 to-emerald-50 text-emerald-800/40"
                      style={{ display: blog.coverImage ? "none" : "flex" }}
                    >
                      <BookOpen size={28} />
                      <span className="text-[10px] font-bold tracking-wider text-emerald-900/50 uppercase">AgriYuvaa Insights</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {blog.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-50">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Practical Workshops & Masterclasses Section at Bottom */}
        {workshops.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <GraduationCap size={15} /> Practical Skills & Training
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Agriculture Workshops & Video Masterclasses
                </h2>
              </div>
              <Link
                to="/workshops"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                All workshops <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((w) => (
                <Link
                  key={w._id || w.title}
                  to="/workshops"
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
                >
                  <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                    <img
                      src={getWorkshopThumbnail(w)}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                    {w.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {w.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {w.category || "Workshop"}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {w.title}
                      </h3>
                      {w.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{w.description}</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 text-[11px] truncate max-w-[170px]">
                        {w.instructor || "Expert Masterclass"}
                      </span>
                      <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                        Watch <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogList;
