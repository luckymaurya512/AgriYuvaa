import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_NAME = "AgriYuvaa Jobs";
const BASE_URL = "https://jobs.agriyuvaa.com";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  "Find 5,000+ agriculture jobs across India. Search farm manager, agronomist, agri-tech & more roles. India's #1 agriculture job portal.";

// Module-level cache so we only fetch the page SEO list once per session
let pageSeoCache = null;
let pageSeoPromise = null;

const fetchPageSeoCache = async () => {
  if (pageSeoCache) return pageSeoCache;
  if (!pageSeoPromise) {
    const apiBase = (
      import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com/api"
    ).replace(/\/+$/, "");

    pageSeoPromise = fetch(`${apiBase}/page-seo`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const map = new Map();
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.route && item.isCustomized) {
              map.set(item.route.toLowerCase(), item);
            }
          });
        }
        pageSeoCache = map;
        return map;
      })
      .catch(() => {
        pageSeoCache = new Map();
        return pageSeoCache;
      })
      .finally(() => {
        pageSeoPromise = null;
      });
  }
  return pageSeoPromise;
};

/**
 * Reusable SEO head component for the Job Portal.
 * Automatically checks SuperAdmin dynamic Page SEO overrides, falling back to page defaults.
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
  keywords = "",
  canonical = "",
}) => {
  const location = useLocation();
  const [customSeo, setCustomSeo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const currentPath = (path || location.pathname || "").toLowerCase();

    fetchPageSeoCache().then((cache) => {
      if (isMounted && cache && cache.has(currentPath)) {
        setCustomSeo(cache.get(currentPath));
      }
    });

    const handleUpdate = () => {
      pageSeoCache = null;
      fetchPageSeoCache().then((cache) => {
        if (isMounted && cache && cache.has(currentPath)) {
          setCustomSeo(cache.get(currentPath));
        } else if (isMounted) {
          setCustomSeo(null);
        }
      });
    };

    window.addEventListener("agriyuvaa_page_seo_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("agriyuvaa_page_seo_updated", handleUpdate);
    };
  }, [location.pathname, path]);

  // Merge SuperAdmin customizations with component props
  const effectiveTitle = customSeo?.metaTitle?.trim() || title;
  const effectiveDescription =
    customSeo?.metaDescription?.trim() || description || DEFAULT_DESCRIPTION;
  const effectiveImage = customSeo?.ogImage?.trim() || image || DEFAULT_IMAGE;
  const effectiveNoindex = customSeo ? Boolean(customSeo.noindex) : noindex;

  const rawKeywords =
    customSeo?.metaKeywords?.length > 0 ? customSeo.metaKeywords : keywords;
  const keywordsString = Array.isArray(rawKeywords)
    ? rawKeywords.filter(Boolean).join(", ")
    : typeof rawKeywords === "string"
    ? rawKeywords
    : "";

  const fullTitle = effectiveTitle
    ? effectiveTitle.includes("AgriYuvaa")
      ? effectiveTitle
      : `${effectiveTitle} | ${SITE_NAME}`
    : `${SITE_NAME} — Agriculture Jobs in India`;

  const canonicalUrl = canonical || `${BASE_URL}${path || location.pathname || ""}`;

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={effectiveDescription} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {effectiveNoindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={effectiveImage} />
      <meta property="og:image:secure_url" content={effectiveImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={effectiveImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
