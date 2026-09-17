import React from "react";
import SEO from "../components/SEO.jsx";

const About = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SEO
      title="About Us"
      description="AgriYuvaa connects youth with verified agricultural careers in India across farming, agritech, and agribusiness."
      canonical="/about"
    />
    <h1 className="text-3xl font-display font-bold mb-4">About AgriYuvaa</h1>
    <p className="text-brand-grey mb-4">
      AgriYuvaa ("Yuvaa" meaning youth) exists to connect the next generation with real careers in
      agriculture — from farming and livestock to agri-tech, food processing, and agri-business.
    </p>
    <p className="text-brand-grey mb-4">
      We work with farms, agri-input companies, Farmer Producer Organizations (FPOs), NGOs, government
      agriculture bodies, and agri-startups to bring verified, relevant opportunities to young job seekers
      across the country — on a platform built mobile-first, for how our users actually search for work.
    </p>
    <p className="text-brand-grey">
      Every job listing on AgriYuvaa is carefully reviewed and moderated by our team before going live
      — so job seekers can search with complete confidence.
    </p>
  </div>
);

export default About;
