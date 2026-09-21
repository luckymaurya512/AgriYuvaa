import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Calendar, User, BookOpen, Tag, Sprout } from "lucide-react";
import { fetchBlogs } from "../services/landingService.js";
import SEO from "../components/SEO.jsx";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchBlogs({
      page,
      limit: 9,
      search,
      tag: activeTag || undefined,
      targetSite: "jobs",
    })
      .then((data) => {
        setBlogs(data.blogs || []);
        setTotalPages(data.pages || 1);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [page, search, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? "" : tag);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <SEO
        title="Agriculture Blogs, Career Advice & AgriTech Trends | AgriYuvaa Jobs"
        description="Explore agricultural career insights, interview tips, ICAR exam guides, and agritech industry news curated for agriculture students and professionals."
        canonical="/blog"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <BookOpen size={14} /> Career Insights & Agriculture Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            AgriYuvaa <span className="text-emerald-400">Blog & Insights</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Latest career guidance, agri-business opportunities, exam preparation strategies, and industry developments.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-4 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Active Tag Filter Indicator */}
        {activeTag && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-gray-500">Filtered by tag:</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg">
              #{activeTag}
              <button
                onClick={() => setActiveTag("")}
                className="ml-1 text-emerald-600 hover:text-emerald-900 font-bold"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                <div className="h-44 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-4/5" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <BookOpen size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No articles found</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              {search || activeTag
                ? "No published articles matched your search filters. Try clearing tags or searching broader keywords."
                : "Check back soon for new agricultural career guides and recruitment updates."}
            </p>
            {(search || activeTag) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setActiveTag("");
                }}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors shadow-2xs"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
                >
                  <Link to={`/blog/${blog.slug}`} className="block relative aspect-[16/9] bg-gray-100 overflow-hidden">
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
                      className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-50 to-emerald-50/60 text-emerald-800/40"
                      style={{ display: blog.coverImage ? "none" : "flex" }}
                    >
                      <Sprout size={32} />
                      <span className="text-[10px] font-bold tracking-wider text-emerald-900/50 uppercase">AgriYuvaa Insights</span>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagClick(tag);
                              }}
                              className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2.5 py-0.5 rounded-md transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}

                      <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {blog.excerpt || (blog.content ? blog.content.substring(0, 130).replace(/<[^>]+>/g, "").trim() + "..." : "Explore this article for career insights, industry hiring patterns, and preparation tips.")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : new Date(blog.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform"
                      >
                        Read Article <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-2xs"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-2xs"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
