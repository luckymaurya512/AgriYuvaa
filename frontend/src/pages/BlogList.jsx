import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Calendar } from "lucide-react";
import { fetchBlogs } from "../services/landingService.js";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchBlogs({ page, limit: 9, search })
      .then((data) => {
        setBlogs(data.blogs || []);
        setTotalPages(data.pages || 1);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="pt-24 pb-20">
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
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No blogs found</h3>
            <p className="text-sm text-gray-500">Check back soon for new articles!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-lime-50 flex items-center justify-center">
                  <span className="text-5xl">📰</span>
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
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : ""}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  page === i + 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-emerald-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default BlogList;
