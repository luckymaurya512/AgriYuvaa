import React from "react";
import { Link } from "react-router-dom";
import { Users, Target, Award, ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";

const About = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 py-16 -mt-24 pt-36 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <img src={logo} alt="AgriYuvaa" className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md" />
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            🌾 About AgriYuvaa
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Where Youth Meets <span className="text-emerald-400">Agriculture</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Committed to inspiring and empowering the next generation of agricultural leaders across India.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              AgriYuvaa ("Yuvaa" meaning youth) exists to connect the next generation with real careers
              in agriculture — from modern farming and livestock to agri-tech, food processing, precision
              farming, and agri-business. We bridge the gap between academic learning and high-impact careers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              We envision an India where agriculture is recognized as a high-tech, profitable, and respected
              career path for educated youth. Through practical skill workshops, industry mentorship, and
              verified employment connections, we empower thousands of agriculture graduates each year.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                🎓
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Hands-on Workshops</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Practical training in drone technology, hydroponics, beekeeping, biofloc, and mushroom cultivation.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                💼
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Agriculture Job Portal</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated employment network connecting students with farms, agri-startups, FPOs, and corporate agri-businesses.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                🌱
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Knowledge & Community</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Blogs, industry news, expert insights, and mentorship to guide agri-students every step of their journey.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Start Your Journey in Agriculture?</h3>
          <p className="text-emerald-100 max-w-xl mx-auto mb-6 text-sm">
            Explore verified job openings or upskill yourself with one of our specialized hands-on workshops.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://job.agriyuvaa.com"
              className="bg-white text-emerald-800 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all text-sm inline-flex items-center gap-2"
            >
              Visit Job Portal <ArrowRight size={15} />
            </a>
            <Link
              to="/workshops"
              className="bg-emerald-700/60 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all text-sm"
            >
              Browse Workshops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
