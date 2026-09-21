import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { fetchBlogBySlug } from "../services/landingService.js";
import RichTextRenderer from "../components/RichTextRenderer.jsx";
import SEO from "../components/SEO.jsx";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBlogBySlug(slug)
      .then((data) => setBlog(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4">
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
      <div className="pt-32 pb-20 text-center">
        <span className="text-5xl block mb-4">😕</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
        <p className="text-gray-500 mb-6">This article may have been removed or the URL is incorrect.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
          <ArrowLeft size={16} /> Back to Blogs
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    </div>
  );
};

export default BlogDetail;
