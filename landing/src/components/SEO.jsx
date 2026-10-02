import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "AgriYuvaa";
const BASE_URL = "https://agriyuvaa.com";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  "India's premier platform for agriculture students. Workshops, blogs, career guidance & community for the next generation of agricultural leaders.";

/**
 * Reusable SEO head component for the Landing site.
 *
 * @param {string}  title        – Page title (auto-appends " | AgriYuvaa" if missing)
 * @param {string}  description  – Meta description (max ~160 chars recommended)
 * @param {string}  path         – Path portion, e.g. "/about"
 * @param {string}  image        – Absolute URL to OG image
 * @param {string}  type         – OG type: "website" | "article"
 * @param {boolean} noindex      – If true, tells search engines not to index this page
 * @param {object}  jsonLd       – Optional JSON-LD structured data object
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
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Where Youth Meets Agriculture`;
  const canonicalUrl = canonical || `${BASE_URL}${path}`;

  const keywordsString = Array.isArray(keywords)
    ? keywords.filter(Boolean).join(", ")
    : typeof keywords === "string"
    ? keywords
    : "";

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
