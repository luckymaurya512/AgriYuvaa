import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "AgriYuvaa Jobs";
const BASE_URL = "https://job.agriyuvaa.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-banner.png`;
const DEFAULT_DESCRIPTION =
  "Find 5,000+ agriculture jobs across India. Search farm manager, agronomist, agri-tech & more roles. India's #1 agriculture job portal.";

/**
 * Reusable SEO head component for the Job Portal.
 *
 * @param {string}  title        – Page title (auto-appends " | AgriYuvaa Jobs" if missing)
 * @param {string}  description  – Meta description (max ~160 chars recommended)
 * @param {string}  path         – Path portion, e.g. "/jobs"
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
}) => {
  const fullTitle = title
    ? title.includes("AgriYuvaa")
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Agriculture Jobs in India`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
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
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
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
