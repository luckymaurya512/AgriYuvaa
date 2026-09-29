import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2, Briefcase, Check, Sparkles, Clock, BookOpen, GraduationCap, Play, ArrowRight } from "lucide-react";
import { fetchBlogBySlug, fetchBlogs, fetchWorkshops } from "../services/landingService.js";
import { getWorkshopThumbnail } from "../utils/fallbackData.js";
import RichTextRenderer from "../components/common/RichTextRenderer.jsx";
import SEO from "../components/SEO.jsx";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
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


  const readTime = useMemo(() => {
    if (!blog?.content) return 3;
    const wordCount = blog.content.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
    return Math.max(2, Math.ceil(wordCount / 180));
  }, [blog?.content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-10 bg-gray-200 rounded-xl w-4/5" />
            <div className="h-5 bg-gray-100 rounded w-1/2" />
            <div className="h-72 bg-gray-200 rounded-2xl" />
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-11/12" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 py-20">
        <div className="card max-w-md w-full p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600">
            <BookOpen size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Article Not Found</h2>
          <p className="text-sm text-gray-500">
            This article may have been moved, updated, or unpublished.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.title,
    image: blog.coverImage || "https://job.agriyuvaa.com/og-banner.png",
    datePublished: blog.publishedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "AgriYuvaa Team",
    },
    publisher: {
      "@type": "Organization",
      name: "AgriYuvaa Jobs",
      url: "https://job.agriyuvaa.com",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <SEO
        title={`${blog.title} | AgriYuvaa Blog`}
        description={
          blog.excerpt ||
          (blog.content ? blog.content.substring(0, 160).replace(/<[^>]+>/g, "") : blog.title)
        }
        image={blog.coverImage}
        canonical={`/blog/${slug}`}
        type="article"
        jsonLd={articleSchema}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto space-y-5">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300/80 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to all articles
          </Link>

          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-emerald-400" />
              {blog.author || "AgriYuvaa Team"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-400" />
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300/90 font-medium">
              <Clock size={13} className="text-emerald-400" />
              {readTime} min read
            </span>
            <button
              onClick={handleCopyLink}
              className="ml-auto inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition-all text-xs"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Share2 size={13} /> Share Link
                </>
              )}
            </button>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag size={13} className="text-emerald-400/80" />
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-2.5 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
          {blog.coverImage && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-gray-100 shadow-2xs bg-gray-100">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {blog.excerpt && (
            <div className="border-l-4 border-emerald-600 pl-4 py-1 italic text-gray-700 bg-emerald-50/50 rounded-r-lg text-sm sm:text-base leading-relaxed">
              {blog.excerpt}
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-emerald max-w-none text-gray-800 text-sm sm:text-base leading-relaxed">
            <RichTextRenderer content={blog.content} />
          </div>

          {/* Call to Action Box */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
                <Sparkles size={16} className="text-emerald-400" /> Looking for Agriculture Jobs?
              </h3>
              <p className="text-xs text-gray-300">
                Explore private agri-business roles and government recruitments matching your skills.
              </p>
            </div>
            <Link
              to="/jobs"
              className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Briefcase size={14} /> Explore Jobs
            </Link>
          </div>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft size={14} /> Back to all articles
            </Link>
            <span className="text-xs text-gray-400 font-medium">
              AgriYuvaa Knowledge Hub
            </span>
          </div>
        </div>
      </div>

      {/* ── OTHER BLOGS / ARTICLES ── */}
      {otherBlogs.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
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
                className="card bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
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
                className="card bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group"
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
                    <a
                      href={w.videoUrl || w.youtubeUrl || "https://agriyuvaa.com/workshops"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <Play size={11} className="fill-current" /> Watch
                    </a>
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
