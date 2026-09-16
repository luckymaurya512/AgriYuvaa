import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BLOG_ARTICLES = [
  {
    id: 1,
    title: "Commercial Hydroponics: Scaling from College Project to 10L/Year Revenue",
    category: "Hydroponics & Urban Farming",
    badgeCategory: "Hydroponics",
    readTime: "4 min read",
    author: "Dr. Amit Sharma",
    description: "Capital outlay analysis, nutrient formulations, and direct B2B supply chains to gourmet culinary chains.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA16PMItmAO-6i3dO6t8YVDtPZ1_Mhix62h0hlAfDcchh9jlz_MJgVwSu4Wt-aJf_DEsL4oOTcJ1mcF2T9sdIV8NocwdchkxtHQNsWb9yzUXcRVxoXkdrrdi0Y6LjPTkgStfnaX9_oPTiLM4TL6VUg9ZRPcaKOILCsmriDK3gbFTahGEJ8HRskVqBxdrO2PqsdC1ZIXFzc86zUp_qKGz-PBEXrnD4WP2spcI_n9UokstGppsTMg5n8p-A"
  },
  {
    id: 2,
    title: "How Drones & Multispectral Imaging Are Revolutionizing Indian Farming",
    category: "Drone Technology",
    badgeCategory: "Drone Tech",
    readTime: "6 min read",
    author: "Priya Patel",
    description: "Step-by-step DGCA pilot certification pathways and real-time NDVI crop health monitoring workflows.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUASGhxMwI5rxYaslIMYQOyrariE10lP9Vgoz9vbiGAF3alLXCF5kYtM1oocogmN0_SYNBXmpLh5jorywRM7soOr8b03WodnEWxwr6HjGJ6XTsrRRW3n_I_arI7BjHeDAC01puE58TucF7DHO5C6zitDaqtlIvFCPNybfTtpYzDqGhpyswo5-q6b4MeaEZiwb0khp_9yoA2Bx6MthBV1xPpEIA_Z1rjlskF_gVlst44y9g6SZ3k21KLw"
  },
  {
    id: 3,
    title: "A Beginner's Guide to Starting Commercial Apiculture & Honey Export",
    category: "Agri-Business & Schemes",
    badgeCategory: "Agri-Business",
    readTime: "5 min read",
    author: "Dr. Ramesh Kumar",
    description: "Navigating FSSAI compliance, APEDA export certifications, and modern disease-resistant Langstroth hives.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeTRMUf3hAFBtZGsUAJN6hS97_MsNo0c0P1cxbgp6bhMJoy-gEQFNKhGuD2NXAKajUFmUrMV0Rvgnco17CHyYdZlARiKcuByqscJO0sIhL_nbiXU54Q4t2R7-mvgNi2gs9a9jKYaUbcS3t_op9myJDaFBREM9OTKMYJZLon4AYqy4LhfS9UpS6c5aOlIjHp8WwJHR6aHJfFyPo5P67Co2hOH-R72rX6zt8wp4P_SSPjc7mTJaxbPMZAQ"
  },
  {
    id: 4,
    title: "Cracking Agri-Bank SO & ICAR Competitive Exams: Study Blueprint",
    category: "Career Guides",
    badgeCategory: "Career Guide",
    readTime: "8 min read",
    author: "Rahul Deshpande",
    description: "6-month schedule, subject-wise weightage analysis, and curated mock resources for aspiring officers.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa_CI2_rK5M1b6Zgp3eFhAHDyPGwqkQH7WFdWMHlCi2VXiNtwzUifXTRal_GNv2evxqpIt3U_UQkhe_NW3E-FE5nHWeUzVRib2uXTWuMeJ-4sHc6dDpq3P1_GJwUN4XxKYHKa96iS4r6oEZXm5gq8E_GXre5-7u0hf7zOTrJlKyUbYzeqCEy_SynGI1z-xoepZTj12avpp0XHBrl7jkt769y79UEA45t-6PAAD6yi8iR8kVuYsHIB9DQ"
  },
  {
    id: 5,
    title: "Biofloc Aquaculture: Sustainable Protein Farming for Young Entrepreneurs",
    category: "Precision Farming",
    badgeCategory: "Aquaculture",
    readTime: "5 min read",
    author: "Er. Rajesh Nair",
    description: "Zero-water exchange technology, C:N ratio calculations, and high-density tilapia harvesting economics.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4U4vMBiR2gbQDYwWD9TeGQZr42Nbzi3fYmKS6SDzIsUuwAuO6q6B-zCJK1jUr5eMmP8T8vhtKnEGVuca1s2rDnWS9Rqj9lUrDlAY1iXTXmCJtQfGA3GZ8I_vRJgKAd79yC93Vy5Jl8zt4_ckN6PX1ITzy6Fa0DNdMaOzc2akWNcv4a1Cd5JF9_1AEuN3RO_fi0JzGVTmPO5Z7gl1zGP-phViVdmvDNsT0FT2SfrgctEZM3JvjEU-v0A"
  },
  {
    id: 6,
    title: "Understanding Carbon Credits and Agri-Fintech in India",
    category: "Agri-Business & Schemes",
    badgeCategory: "Fintech & Policy",
    readTime: "7 min read",
    author: "AgriYuvaa Research Desk",
    description: "Demystifying voluntary carbon markets, soil organic carbon verification protocols, and farmer monetization.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzUjLDh_yJ48Eeu1tElsipXRURPxStSG2Q82uTpqvgO9WLS74_7IYSWCrVncOtXDgwp88YdX0_EYHnGflRsRIBffiB6Y3Gg_dbCuxQShW3DBwExowyoodOzvSphzB382jRyddyqludZjvRmiboi5tLAGdErwnrVXHkvszaa6xs5Mfv9eD1P9hmwVlaZHlXWpacqSSBRr68H1uJ20L-BaoSCWb1HNlrvbwbmoe2edKis-ZNfA6Ku6Twog"
  }
];

const TOPICS = [
  "All Articles",
  "Drone Technology",
  "Career Guides",
  "Hydroponics & Urban Farming",
  "Agri-Business & Schemes",
  "Precision Farming"
];

export default function BlogPage() {
  const [selectedTopic, setSelectedTopic] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesTopic = selectedTopic === "All Articles" || article.category === selectedTopic;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 5000);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-secondary-container selection:text-primary min-h-screen flex flex-col font-body-md">
      {/* Main Canvas Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-10">
        {/* Hero & Search Header Section */}
        <section className="relative rounded-2xl bg-gradient-to-b from-mint-surface/80 to-surface-container-low/50 border border-card-border p-6 sm:p-10 md:p-12 overflow-hidden">
          {/* High-Tech Glow Accent */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl flex flex-col gap-4">
            {/* Live Status Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-surface border border-secondary-fixed text-primary font-label-badge text-label-badge w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>DISPATCHES FROM MODERN AGRI-TECH</span>
            </div>

            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              AgriTech Insights, Guides &amp; Career Roadmaps
            </h1>

            <p className="font-body-lg text-body-lg text-slate-muted">
              Stay ahead of agricultural trends, modern farming techniques, government schemes, and high-paying careers.
            </p>

            {/* Search Input with Ambient Focus */}
            <div className="mt-4 relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-muted">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, drone tech, soil science, agri-business..."
                className="w-full pl-12 pr-28 py-3.5 bg-surface-container-lowest border border-card-border rounded-lg text-body-md font-body-md text-on-surface placeholder:text-slate-muted focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/15 transition-all shadow-sm"
              />
              <button
                type="button"
                className="absolute inset-y-1.5 right-1.5 px-4 rounded-lg bg-primary text-surface-container-lowest font-label-interactive text-label-interactive hover:bg-primary-container transition-colors flex items-center gap-1"
              >
                <span>Filter</span>
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>
        </section>

        {/* Topic Filter Tags (Horizontal Scroll / Wrap) */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TOPICS.map((topic) => {
            const isActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-full font-label-badge text-label-badge whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-surface-container-lowest shadow-sm'
                    : 'bg-surface-container-lowest border border-card-border text-slate-muted hover:border-secondary hover:text-primary'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </section>

        {/* Featured / Editor's Pick Hero Card */}
        <section className="rounded-xl border border-card-border bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Container */}
            <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD86g0Jp6jl5HY2PDWSPj-8NqxTxbMUsRAL36pALNfPYyEr-xvUqBHz_FAOSW1Den4ZtToY0v_LQLy0FKbYfphkDH6690mcr2BL6QPbq2lKcX0E6JzfAiwLqHA94L4DABRvbRQ0EVFxZqEoLE2oXgnxOImgwFCGNxfdr3XpzgdTeyiKXBJgz2_8zrQxX-F7qAqggObu-f_GU1blhHTQGjCKm2cqpdltwI38SCA3sToX8rVekckz7t-8Sg"
                alt="Young Indian scientists inspecting genetically optimized crop seedlings in a modern laboratory setting"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-deep-canopy/90 backdrop-blur-md text-electric-lime font-label-badge text-label-badge flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  Featured • 6 min read
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-surface-container-lowest">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-mint-surface border border-secondary-fixed text-primary font-label-badge text-label-badge">
                    CAREER FORECAST
                  </span>
                  <span className="text-slate-muted text-body-sm font-body-sm">• September 11, 2026</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors cursor-pointer">
                  Top High-Paying Skills in Modern Agriculture for 2026
                </h2>
                <p className="font-body-md text-body-md text-slate-muted leading-relaxed">
                  A breakdown of industry demand from biological seed tech to drone operation and smart telemetry specialists. Discover what agribusiness recruiters are looking for.
                </p>
              </div>

              {/* Author & Action Footer */}
              <div className="pt-6 border-t border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-electric-lime flex items-center justify-center font-bold font-headline-sm">
                    SR
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-interactive text-label-interactive text-primary">Swati Raj</span>
                    <span className="font-body-sm text-body-sm text-slate-muted">Lead Talent Analyst</span>
                  </div>
                </div>
                <a
                  href="#read"
                  className="inline-flex items-center gap-1 font-label-interactive text-label-interactive text-secondary hover:text-primary transition-colors group/link"
                >
                  <span>Read Blueprint</span>
                  <span className="material-symbols-outlined text-[20px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Grid of Blog Articles (6 rich cards) */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-primary">Latest Articles &amp; Roadmaps</h3>
            <span className="font-body-sm text-body-sm text-slate-muted">
              Showing {filteredArticles.length} of {BLOG_ARTICLES.length} curated publications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col bg-surface-container-lowest rounded-xl border border-card-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-mint-surface/90 backdrop-blur-md border border-secondary-fixed text-primary font-label-badge text-label-badge">
                    {article.badgeCategory}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-muted font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-primary line-clamp-2 hover:text-secondary transition-colors cursor-pointer">
                      {article.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-slate-muted line-clamp-2">
                      {article.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-card-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">account_circle</span>
                      <span className="font-label-interactive text-label-interactive text-on-surface">{article.author}</span>
                    </div>
                    <button
                      aria-label="Bookmark article"
                      className="material-symbols-outlined text-slate-muted hover:text-primary transition-colors text-[20px]"
                    >
                      bookmark
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pagination Controls */}
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-4">
          <button
            disabled
            aria-label="Previous Page"
            className="w-10 h-10 rounded-lg border border-card-border bg-surface-container-lowest flex items-center justify-center text-slate-muted hover:text-primary hover:border-secondary transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button className="w-10 h-10 rounded-lg bg-primary text-surface-container-lowest font-label-interactive text-label-interactive shadow-sm">
            1
          </button>
          <button className="w-10 h-10 rounded-lg border border-card-border bg-surface-container-lowest text-slate-muted hover:text-primary hover:border-secondary font-label-interactive text-label-interactive transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-lg border border-card-border bg-surface-container-lowest text-slate-muted hover:text-primary hover:border-secondary font-label-interactive text-label-interactive transition-colors">
            3
          </button>
          <span className="px-2 text-slate-muted font-bold">...</span>
          <button className="w-10 h-10 rounded-lg border border-card-border bg-surface-container-lowest text-slate-muted hover:text-primary hover:border-secondary font-label-interactive text-label-interactive transition-colors">
            5
          </button>
          <button
            aria-label="Next Page"
            className="w-10 h-10 rounded-lg border border-card-border bg-surface-container-lowest flex items-center justify-center text-slate-muted hover:text-primary hover:border-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </nav>

        {/* Newsletter Subscription Card (Tactile High-Tech Treatment) */}
        <section className="relative rounded-2xl bg-deep-canopy text-surface-container-lowest p-8 sm:p-12 overflow-hidden border border-primary-container">
          {/* Glow ambient backdrop */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-electric-lime/15 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container/80 border border-electric-lime/30 text-electric-lime flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
            </div>

            <h3 className="font-headline-md text-headline-md text-surface-container-lowest">
              Get Weekly Agri-Career Insights &amp; Workshop Discounts
            </h3>

            <p className="font-body-md text-body-md text-outline-variant max-w-lg">
              Join 24,000+ agriculture students and young professionals receiving industry breakdowns, hiring alerts, and early-bird course discounts directly in your inbox.
            </p>

            {newsletterSuccess && (
              <div className="px-4 py-2 bg-electric-lime text-deep-canopy rounded-lg font-bold text-body-sm animate-pulse">
                ✓ Thank you for subscribing to AgriYuvaa Dispatches!
              </div>
            )}

            <form onSubmit={handleSubscribe} className="w-full mt-3 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your university or work email"
                className="flex-grow px-4 py-3 rounded-lg bg-surface-container-lowest/10 border border-outline-variant/30 text-surface-container-lowest placeholder:text-outline-variant focus:outline-none focus:border-electric-lime focus:ring-2 focus:ring-electric-lime/20 transition-all font-body-sm text-body-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-electric-lime text-deep-canopy font-label-interactive text-label-interactive hover:bg-secondary-fixed transition-all duration-200 active:scale-95 whitespace-nowrap font-bold"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center gap-4 text-outline-variant text-[12px] pt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-electric-lime">check_circle</span> No Spam Guaranteed
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-electric-lime">check_circle</span> Unsubscribe Anytime
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
