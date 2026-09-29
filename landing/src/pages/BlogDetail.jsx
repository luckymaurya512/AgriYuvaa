import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, BookOpen, ArrowRight, GraduationCap, Play } from "lucide-react";
import { fetchBlogBySlug, fetchBlogs, fetchWorkshops } from "../services/landingService.js";
import { getWorkshopThumbnail } from "../utils/fallbackData.js";
import RichTextRenderer from "../components/RichTextRenderer.jsx";
import SEO from "../components/SEO.jsx";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchBlogBySlug(slug)
      .then((data) => setBlog(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetchBlogs({ limit: 6 })
      .then((data) => {
        const list = (data.blogs || []).filter((b) => b.slug !== slug);
        setOtherBlogs(list.slice(0, 3));
      })
      .catch(() => setOtherBlogs([]));

    fetchWorkshops()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workshops || [];
        setWorkshops(list.slice(0, 3));
      })
      .catch(() => setWorkshops([]));
  }, [slug]);


  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-64 bg-gray-100 rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">
          <BookOpen size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">This article may have been removed or the link is invalid.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm">
          <ArrowLeft size={14} /> Back to Articles
        </Link>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.title,
    image: blog.coverImage || blog.image || "https://agriyuvaa.com/og-banner.png",
    datePublished: blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "AgriYuvaa Team"
    },
    publisher: {
      "@type": "Organization",
      name: "AgriYuvaa",
      logo: {
        "@type": "ImageObject",
        url: "https://agriyuvaa.com/logo.svg"
      }
    }
  };

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={blog.title}
        description={blog.excerpt || (blog.content ? blog.content.substring(0, 150).replace(/<[^>]+>/g, "") : blog.title)}
        image={blog.coverImage || blog.image}
        canonical={`/blog/${slug}`}
        type="article"
        jsonLd={articleSchema}
      />
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/50 flex-wrap">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {blog.author || "AgriYuvaa Team"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                : ""}
            </span>
          </div>
          {blog.tags?.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag size={13} className="text-white/40" />
              {blog.tags.map((tag) => (
                <span key={tag} className="text-xs bg-white/10 text-white/70 px-2.5 py-0.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blog.coverImage && (
          <div className="relative w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}
        <article className="prose prose-lg max-w-none">
          <RichTextRenderer
            content={blog.content}
            className="text-gray-700 leading-relaxed text-base"
          />
        </article>

        {/* Share & Back */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
            <ArrowLeft size={16} /> More Articles
          </Link>
          <div className="text-xs text-gray-400">
            Published by {blog.author || "AgriYuvaa Team"}
          </div>
        </div>
      </div>

      {/* ── OTHER BLOGS / ARTICLES ── */}
      {otherBlogs.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" /> More Agriculture Articles & Guides
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Explore insightful guides on careers, ICAR exam prep, and modern agricultural technology.
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
            {otherBlogs.map((item) => (
              <Link
                key={item._id || item.slug}
                to={`/blog/${item.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
              >
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {item.tags?.[0] || "Agriculture"}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{item.author || "AgriYuvaa Team"}</span>
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

      {/* ── RECOMMENDED WORKSHOPS ── */}
      {workshops.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap size={22} className="text-emerald-600" /> Practical Workshops & Trainings
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Hands-on skill development video sessions in drones, hydroponics, and agribusiness.
              </p>
            </div>
            <Link
              to="/workshops"
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
            >
              All workshops <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((w) => (
              <div
                key={w._id || w.title}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
              >
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={getWorkshopThumbnail(w)}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-white/95 text-emerald-800 px-2 py-0.5 rounded-full shadow-xs">
                    {w.category}
                  </span>
                  {w.duration && (
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-md">
                      ⏱️ {w.duration}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {w.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {w.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 truncate max-w-[140px]">
                      {w.instructor}
                    </span>
                    <Link
                      to="/workshops"
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      <Play size={11} className="fill-current" /> Watch
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
