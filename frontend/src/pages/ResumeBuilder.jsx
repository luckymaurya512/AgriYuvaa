import React, { useState } from "react";
import {
  Printer,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  FileCheck,
  BookText,
  FileBadge2,
  FolderPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const sampleData = {
  fullName: "Rahul Sharma",
  title: "Agriculture Professional & Agronomist",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  location: "New Delhi, India",
  website: "linkedin.com/in/rahul-agri",
  objective:
    "Passionate agriculture graduate with hands-on field experience in agronomy, precision farming, and crop protection. Seeking a role where I can contribute to farmer advisory, sustainable agriculture practices, and agribusiness growth.",
  education: [
    {
      degree: "M.Sc. Agronomy",
      institution: "Punjab Agricultural University (PAU), Ludhiana",
      year: "2022 - 2024",
      score: "8.6 OGPA",
    },
    {
      degree: "B.Sc. (Hons) Agriculture",
      institution: "Govind Ballabh Pant University of Agriculture & Technology",
      year: "2018 - 2022",
      score: "8.4 OGPA",
    },
  ],
  experience: [
    {
      role: "Field Agronomy Intern",
      company: "National Agro Solutions Pvt Ltd",
      duration: "May 2023 - Jul 2023",
      description:
        "Conducted 50+ farmer advisory sessions and product efficacy trials across Ludhiana. Analyzed soil health cards and formulated customized nutrient management plans.",
    },
    {
      role: "RAWE (Rural Agricultural Work Experience) Trainee",
      company: "Krishi Vigyan Kendra (KVK)",
      duration: "Aug 2021 - Dec 2021",
      description:
        "Demonstrated Integrated Pest Management (IPM) techniques for paddy and wheat crops. Organized farmer training workshops on drip irrigation adoption.",
    },
  ],
  skills:
    "Agronomy, Crop Management, Integrated Pest Management (IPM), Soil Health Analysis, Precision Farming, GIS & Remote Sensing, Hydroponics, Farmer Training & Advisory, MS Office",
  certificationsList: [
    {
      name: "ICAR National Eligibility Test (NET) in Agronomy",
      issuer: "Agricultural Scientists Recruitment Board (ASRB)",
      year: "2024",
    },
    {
      name: "Certificate in Digital Agriculture & Drone Applications",
      issuer: "Coursera / PAU",
      year: "2023",
    },
    {
      name: "Organic Farming & Certification Standards",
      issuer: "National Centre of Organic Farming (NCOF)",
      year: "2022",
    },
  ],
  publications: [
    {
      title: "Optimization of Nitrogen Use Efficiency in Direct-Seeded Rice",
      journal: "Indian Journal of Agronomy (Vol. 68, Issue 3)",
      year: "2023",
      link: "https://doi.org/10.1234/ija.2023.045",
      description:
        "Evaluated leaf color chart (LCC) based nitrogen management, reducing fertilizer inputs by 18% while maintaining optimal grain yield.",
    },
  ],
  projects: [
    {
      title: "Automated Drip Fertigation & Soil Moisture Monitoring",
      description:
        "Developed an IoT-assisted sensor prototype for real-time root-zone moisture tracking in vegetable polyhouses.",
    },
  ],
  languages: "English (Fluent), Hindi (Native), Punjabi (Conversational)",
  customSections: [
    {
      id: "sec_1",
      heading: "Workshops & Field Demonstrations",
      items: [
        {
          title: "National Seminar on Climate Resilient Agriculture",
          subtitle: "IARI, New Delhi",
          year: "2023",
          description: "Presented research poster on direct-seeded rice water-saving techniques.",
        },
      ],
    },
  ],
};

const initialEmptyData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  objective: "",
  education: [{ degree: "", institution: "", year: "", score: "" }],
  experience: [{ role: "", company: "", duration: "", description: "" }],
  skills: "",
  certificationsList: [{ name: "", issuer: "", year: "" }],
  publications: [{ title: "", journal: "", year: "", link: "", description: "" }],
  projects: [{ title: "", description: "" }],
  languages: "",
  customSections: [],
};

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [template, setTemplate] = useState("agri_clean"); // "agri_clean" | "modern_green" | "classic_serif"
  const [activeTab, setActiveTab] = useState("editor"); // For mobile: "editor" | "preview"

  const [data, setData] = useState(() => {
    if (user) {
      return {
        ...sampleData,
        fullName: user.name || sampleData.fullName,
        email: user.email || sampleData.email,
        phone: user.phone || sampleData.phone,
      };
    }
    return sampleData;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAutofill = () => {
    setData(sampleData);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all fields?")) {
      setData(initialEmptyData);
    }
  };

  // ── Dynamic Array Handlers: Education ──
  const handleEduChange = (index, field, value) => {
    const updated = [...data.education];
    updated[index][field] = value;
    setData({ ...data, education: updated });
  };
  const addEdu = () => {
    setData({
      ...data,
      education: [...data.education, { degree: "", institution: "", year: "", score: "" }],
    });
  };
  const removeEdu = (index) => {
    setData({ ...data, education: data.education.filter((_, i) => i !== index) });
  };

  // ── Dynamic Array Handlers: Experience ──
  const handleExpChange = (index, field, value) => {
    const updated = [...data.experience];
    updated[index][field] = value;
    setData({ ...data, experience: updated });
  };
  const addExp = () => {
    setData({
      ...data,
      experience: [...data.experience, { role: "", company: "", duration: "", description: "" }],
    });
  };
  const removeExp = (index) => {
    setData({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };

  // ── Dynamic Array Handlers: Projects ──
  const handleProjChange = (index, field, value) => {
    const updated = [...data.projects];
    updated[index][field] = value;
    setData({ ...data, projects: updated });
  };
  const addProj = () => {
    setData({ ...data, projects: [...data.projects, { title: "", description: "" }] });
  };
  const removeProj = (index) => {
    setData({ ...data, projects: data.projects.filter((_, i) => i !== index) });
  };

  // ── Dynamic Array Handlers: Publications / Research Papers ──
  const handlePubChange = (index, field, value) => {
    const updated = [...(data.publications || [])];
    updated[index][field] = value;
    setData({ ...data, publications: updated });
  };
  const addPub = () => {
    setData({
      ...data,
      publications: [...(data.publications || []), { title: "", journal: "", year: "", link: "", description: "" }],
    });
  };
  const removePub = (index) => {
    setData({ ...data, publications: data.publications.filter((_, i) => i !== index) });
  };

  // ── Dynamic Array Handlers: Certifications ──
  const handleCertChange = (index, field, value) => {
    const updated = [...(data.certificationsList || [])];
    updated[index][field] = value;
    setData({ ...data, certificationsList: updated });
  };
  const addCert = () => {
    setData({
      ...data,
      certificationsList: [...(data.certificationsList || []), { name: "", issuer: "", year: "" }],
    });
  };
  const removeCert = (index) => {
    setData({ ...data, certificationsList: data.certificationsList.filter((_, i) => i !== index) });
  };

  // ── Dynamic Custom Sections ──
  const addCustomSection = () => {
    const newSection = {
      id: `sec_${Date.now()}`,
      heading: "New Custom Section",
      items: [{ title: "", subtitle: "", year: "", description: "" }],
    };
    setData({ ...data, customSections: [...(data.customSections || []), newSection] });
  };

  const removeCustomSection = (secId) => {
    setData({
      ...data,
      customSections: data.customSections.filter((s) => s.id !== secId),
    });
  };

  const updateSectionHeading = (secId, heading) => {
    const updated = data.customSections.map((s) => (s.id === secId ? { ...s, heading } : s));
    setData({ ...data, customSections: updated });
  };

  const addCustomSectionItem = (secId) => {
    const updated = data.customSections.map((s) => {
      if (s.id === secId) {
        return {
          ...s,
          items: [...s.items, { title: "", subtitle: "", year: "", description: "" }],
        };
      }
      return s;
    });
    setData({ ...data, customSections: updated });
  };

  const removeCustomSectionItem = (secId, itemIdx) => {
    const updated = data.customSections.map((s) => {
      if (s.id === secId) {
        return {
          ...s,
          items: s.items.filter((_, i) => i !== itemIdx),
        };
      }
      return s;
    });
    setData({ ...data, customSections: updated });
  };

  const updateCustomSectionItem = (secId, itemIdx, field, value) => {
    const updated = data.customSections.map((s) => {
      if (s.id === secId) {
        const newItems = [...s.items];
        newItems[itemIdx][field] = value;
        return { ...s, items: newItems };
      }
      return s;
    });
    setData({ ...data, customSections: updated });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ── TOP CONTROL BAR ── */}
        <div className="card p-5 no-print flex flex-wrap items-center justify-between gap-4">
          {/* Template Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-grey block mb-2">
              Choose Template
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setTemplate("agri_clean")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 flex items-center gap-2 transition-all ${
                  template === "agri_clean"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                    : "border-brand-border text-brand-grey hover:border-gray-300"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Agri Clean
              </button>

              <button
                onClick={() => setTemplate("modern_green")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 flex items-center gap-2 transition-all ${
                  template === "modern_green"
                    ? "border-emerald-800 bg-emerald-950 text-white shadow-sm"
                    : "border-brand-border text-brand-grey hover:border-gray-300"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Modern Green
              </button>

              <button
                onClick={() => setTemplate("classic_serif")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 flex items-center gap-2 transition-all ${
                  template === "classic_serif"
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                    : "border-brand-border text-brand-grey hover:border-gray-300"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Classic Serif
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutofill}
              className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5"
              title="Load agriculture graduate sample data"
            >
              <Sparkles size={14} className="text-brand-green" /> Autofill Sample
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl border border-brand-border text-xs text-brand-grey hover:text-red-600 hover:border-red-200 transition-colors"
              title="Clear all fields"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={15} /> Download PDF / Print
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden gap-2 no-print">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
              activeTab === "editor"
                ? "bg-brand-black text-white border-brand-black"
                : "bg-white text-brand-grey border-brand-border"
            }`}
          >
            <Edit3 size={14} /> Edit Information
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white text-brand-grey border-brand-border"
            }`}
          >
            <Eye size={14} /> Live Preview
          </button>
        </div>

        {/* ── MAIN TWO-COLUMN WORKSPACE ── */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* ══ LEFT: FORM EDITOR ══ */}
          <div
            className={`md:col-span-6 space-y-6 no-print ${
              activeTab === "preview" ? "hidden md:block" : "block"
            }`}
          >
            {/* Personal Info */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-brand-green" /> Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">Full Name *</label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">
                    Professional Title *
                  </label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="Agronomist / Agriculture Graduate"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">Email *</label>
                  <input
                    type="email"
                    className="input-field mt-1 text-sm"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="rahul@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">Phone *</label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">Location</label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    placeholder="New Delhi, India"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase">
                    LinkedIn / Portfolio URL
                  </label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    placeholder="linkedin.com/in/profile"
                  />
                </div>
              </div>
            </div>

            {/* Career Objective */}
            <div className="card p-6 space-y-3">
              <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={16} className="text-brand-green" /> Career Objective / Summary
              </h2>
              <textarea
                rows={3}
                className="input-field text-sm"
                value={data.objective}
                onChange={(e) => setData({ ...data, objective: e.target.value })}
                placeholder="Brief summary of your background, strengths, and career goals in agriculture..."
              />
            </div>

            {/* Education */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-brand-green" /> Education
                </h2>
                <button
                  type="button"
                  onClick={addEdu}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              {data.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-brand-border rounded-xl space-y-3 relative">
                  {data.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(idx)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">
                        Degree / Program
                      </label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                        placeholder="M.Sc. Agronomy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">
                        University / College
                      </label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={edu.institution}
                        onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                        placeholder="PAU Ludhiana"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">
                        Year / Duration
                      </label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={edu.year}
                        onChange={(e) => handleEduChange(idx, "year", e.target.value)}
                        placeholder="2022 - 2024"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">
                        Grade / OGPA / %
                      </label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={edu.score}
                        onChange={(e) => handleEduChange(idx, "score", e.target.value)}
                        placeholder="8.5 OGPA"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience / Internships */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-brand-green" /> Experience & Internships
                </h2>
                <button
                  type="button"
                  onClick={addExp}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              {data.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-brand-border rounded-xl space-y-3 relative">
                  {data.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExp(idx)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Job Title / Role</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={exp.role}
                        onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                        placeholder="Field Agronomist / Intern"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Company / Farm</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={exp.company}
                        onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                        placeholder="Agro Solutions Pvt Ltd"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Duration</label>
                    <input
                      className="input-field mt-1 text-xs bg-white"
                      value={exp.duration}
                      onChange={(e) => handleExpChange(idx, "duration", e.target.value)}
                      placeholder="May 2023 - Present"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">
                      Key Responsibilities & Achievements
                    </label>
                    <textarea
                      rows={2}
                      className="input-field mt-1 text-xs bg-white"
                      value={exp.description}
                      onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                      placeholder="Conducted field trials, managed farm inputs, trained 30+ farmers..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Research Papers & Publications */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                    <BookText size={16} className="text-brand-green" /> Research Papers & Publications
                  </h2>
                  <p className="text-xs text-brand-grey mt-0.5">Add published research, journal articles, or conference proceedings</p>
                </div>
                <button
                  type="button"
                  onClick={addPub}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} /> Add Paper
                </button>
              </div>

              {(data.publications || []).map((pub, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-brand-border rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removePub(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="pr-6">
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Paper / Article Title</label>
                    <input
                      className="input-field mt-1 text-xs bg-white"
                      value={pub.title}
                      onChange={(e) => handlePubChange(idx, "title", e.target.value)}
                      placeholder="e.g. Assessment of Soil Fertility under Organic Regimes"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Journal / Conference Name</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={pub.journal}
                        onChange={(e) => handlePubChange(idx, "journal", e.target.value)}
                        placeholder="Indian Journal of Agricultural Sciences"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Year / DOI / Link</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={pub.year}
                        onChange={(e) => handlePubChange(idx, "year", e.target.value)}
                        placeholder="2023 / https://doi.org/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Brief Summary / Findings (Optional)</label>
                    <textarea
                      rows={2}
                      className="input-field mt-1 text-xs bg-white"
                      value={pub.description}
                      onChange={(e) => handlePubChange(idx, "description", e.target.value)}
                      placeholder="Summary of research impact, methodology, or key findings..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications & Trainings */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                    <FileBadge2 size={16} className="text-brand-green" /> Certifications & Trainings
                  </h2>
                  <p className="text-xs text-brand-grey mt-0.5">ICAR NET, licenses, technical courses, or specialized agri-trainings</p>
                </div>
                <button
                  type="button"
                  onClick={addCert}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} /> Add Certificate
                </button>
              </div>

              {(data.certificationsList || []).map((cert, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-brand-border rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeCert(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="pr-6">
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Certificate / License Name</label>
                    <input
                      className="input-field mt-1 text-xs bg-white"
                      value={cert.name}
                      onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                      placeholder="e.g. ICAR NET in Soil Science / Drone Pilot License"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Issuing Institute / Body</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={cert.issuer}
                        onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                        placeholder="e.g. ASRB, ICAR, Coursera"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-brand-grey uppercase">Year / Validity</label>
                      <input
                        className="input-field mt-1 text-xs bg-white"
                        value={cert.year}
                        onChange={(e) => handleCertChange(idx, "year", e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="card p-6 space-y-3">
              <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={16} className="text-brand-green" /> Skills & Agri Expertise
              </h2>
              <p className="text-xs text-brand-grey">Enter your skills separated by commas.</p>
              <textarea
                rows={2}
                className="input-field text-sm"
                value={data.skills}
                onChange={(e) => setData({ ...data, skills: e.target.value })}
                placeholder="Agronomy, Crop Protection, Soil Analysis, GIS, Hydroponics..."
              />
            </div>

            {/* Projects & Field Research */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider">
                  Field Projects & Practical Work
                </h2>
                <button
                  type="button"
                  onClick={addProj}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {data.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-brand-border rounded-xl space-y-3 relative">
                  {data.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProj(idx)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <div>
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Project Title</label>
                    <input
                      className="input-field mt-1 text-xs bg-white"
                      value={proj.title}
                      onChange={(e) => handleProjChange(idx, "title", e.target.value)}
                      placeholder="e.g. Nitrogen Efficiency in Paddy"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-brand-grey uppercase">Description / Outcome</label>
                    <textarea
                      rows={2}
                      className="input-field mt-1 text-xs bg-white"
                      value={proj.description}
                      onChange={(e) => handleProjChange(idx, "description", e.target.value)}
                      placeholder="Brief summary of findings, trial results, or methods used..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="card p-6 space-y-3">
              <h2 className="font-display font-bold text-sm text-brand-black uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-brand-green" /> Languages Known
              </h2>
              <input
                className="input-field text-sm"
                value={data.languages}
                onChange={(e) => setData({ ...data, languages: e.target.value })}
                placeholder="English, Hindi, Punjabi"
              />
            </div>

            {/* ── CUSTOM SECTIONS (ADD ANY OTHER FIELD) ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-brand-grey uppercase tracking-wider">Custom Sections</h3>
                  <p className="text-xs text-brand-grey">Add custom categories like Awards, Field Demonstrations, Patents, etc.</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomSection}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <FolderPlus size={14} /> + Add Custom Section
                </button>
              </div>

              {(data.customSections || []).map((sec) => (
                <div key={sec.id} className="card p-6 space-y-4 border-2 border-emerald-100 bg-emerald-50/20">
                  <div className="flex items-center justify-between gap-3 border-b border-brand-border pb-3">
                    <div className="flex-1">
                      <label className="text-[11px] font-bold text-emerald-800 uppercase">Section Heading</label>
                      <input
                        className="input-field mt-1 text-sm font-bold bg-white"
                        value={sec.heading}
                        onChange={(e) => updateSectionHeading(sec.id, e.target.value)}
                        placeholder="e.g. Workshops, Awards, Field Trials"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomSection(sec.id)}
                      className="text-gray-400 hover:text-red-600 p-2 shrink-0 transition-colors"
                      title="Delete Entire Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-4 bg-white border border-brand-border rounded-xl space-y-3 relative shadow-xs">
                        <button
                          type="button"
                          onClick={() => removeCustomSectionItem(sec.id, itemIdx)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid sm:grid-cols-2 gap-3 pr-6">
                          <div>
                            <label className="text-[11px] font-semibold text-brand-grey uppercase">Title / Topic</label>
                            <input
                              className="input-field mt-1 text-xs"
                              value={item.title}
                              onChange={(e) => updateCustomSectionItem(sec.id, itemIdx, "title", e.target.value)}
                              placeholder="Title / Event / Award name"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-brand-grey uppercase">Organization / Year</label>
                            <input
                              className="input-field mt-1 text-xs"
                              value={item.year}
                              onChange={(e) => updateCustomSectionItem(sec.id, itemIdx, "year", e.target.value)}
                              placeholder="e.g. IARI New Delhi, 2023"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-brand-grey uppercase">Description</label>
                          <textarea
                            rows={2}
                            className="input-field mt-1 text-xs"
                            value={item.description}
                            onChange={(e) => updateCustomSectionItem(sec.id, itemIdx, "description", e.target.value)}
                            placeholder="Details, accomplishments, or outcomes..."
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addCustomSectionItem(sec.id)}
                      className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus size={13} /> Add item to {sec.heading || "this section"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT: LIVE PREVIEW CANVAS ══ */}
          <div
            className={`md:col-span-6 sticky top-20 print:static print:block print:w-full print:m-0 print:p-0 ${
              activeTab === "editor" ? "hidden md:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between mb-3 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-grey flex items-center gap-1.5">
                <Eye size={14} className="text-brand-green" /> Live Preview
              </span>
              <span className="text-[11px] text-brand-grey">Standard A4 Format</span>
            </div>

            {/* Resume Sheet Container */}
            <div className="bg-white border border-gray-300 shadow-xl rounded-xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0 print:w-full">
              <div id="resume-canvas" className="min-h-[800px] p-8 sm:p-10 text-gray-800">
                {/* Render Selected Template */}
                {template === "agri_clean" && <TemplateAgriClean data={data} />}
                {template === "modern_green" && <TemplateModernGreen data={data} />}
                {template === "classic_serif" && <TemplateClassicSerif data={data} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1: AGRI CLEAN (Minimalist, Crisp Green Accents, Clean Dividers)
// ═══════════════════════════════════════════════════════════════════════════════
const TemplateAgriClean = ({ data }) => {
  const skillList = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="font-sans text-[13px] leading-relaxed space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-800 tracking-tight">
          {data.fullName || "Your Full Name"}
        </h1>
        <p className="text-base font-semibold text-gray-800 mt-0.5">
          {data.title || "Professional Title"}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>· {data.phone}</span>}
          {data.location && <span>· {data.location}</span>}
          {data.website && <span>· {data.website}</span>}
        </div>
        <hr className="border-t-2 border-emerald-700 mt-3" />
      </div>

      {/* Career Objective */}
      {data.objective && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Career Objective
          </h2>
          <p className="text-gray-700 text-xs leading-relaxed">{data.objective}</p>
        </div>
      )}

      {/* Education */}
      {data.education?.some((e) => e.degree || e.institution) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, i) =>
              edu.degree || edu.institution ? (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{edu.degree}</span>
                    <span className="font-normal text-gray-600">{edu.year}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{edu.institution}</span>
                    {edu.score && <span className="font-medium text-emerald-800">{edu.score}</span>}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience?.some((e) => e.role || e.company) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            Experience & Internships
          </h2>
          <div className="space-y-2.5">
            {data.experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>
                      {exp.role} {exp.company && <span className="font-semibold text-gray-700">· {exp.company}</span>}
                    </span>
                    <span className="font-normal text-gray-600 shrink-0">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Research Papers & Publications */}
      {data.publications?.some((p) => p.title) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            Research Papers & Publications
          </h2>
          <div className="space-y-2">
            {data.publications.map((pub, i) =>
              pub.title ? (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{pub.title}</span>
                    <span className="font-normal text-gray-600 shrink-0">{pub.year}</span>
                  </div>
                  {pub.journal && <p className="text-emerald-800 italic font-medium">{pub.journal}</p>}
                  {pub.description && <p className="text-gray-700 text-xs">{pub.description}</p>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Certifications & Trainings */}
      {data.certificationsList?.some((c) => c.name) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            Certifications & Accreditations
          </h2>
          <div className="space-y-1.5">
            {data.certificationsList.map((cert, i) =>
              cert.name ? (
                <div key={i} className="text-xs flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
                  </div>
                  {cert.year && <span className="text-gray-500 font-medium shrink-0 ml-2">{cert.year}</span>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Key Skills & Expertise
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">{skillList.join(" · ")}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects?.some((p) => p.title) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            Projects & Practical Work
          </h2>
          <div className="space-y-1.5">
            {data.projects.map((proj, i) =>
              proj.title ? (
                <div key={i} className="text-xs">
                  <p className="font-bold text-gray-900">{proj.title}</p>
                  {proj.description && <p className="text-gray-700">{proj.description}</p>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Dynamic Custom Sections */}
      {(data.customSections || []).map((sec) =>
        sec.items?.some((it) => it.title || it.description) ? (
          <div key={sec.id}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
              {sec.heading || "Additional Information"}
            </h2>
            <div className="space-y-2">
              {sec.items.map((it, i) =>
                it.title || it.description ? (
                  <div key={i} className="text-xs space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{it.title}</span>
                      <span className="font-normal text-gray-600 shrink-0">{it.year}</span>
                    </div>
                    {it.description && <p className="text-gray-700 text-xs">{it.description}</p>}
                  </div>
                ) : null
              )}
            </div>
          </div>
        ) : null
      )}

      {/* Languages */}
      {data.languages && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Languages Known
          </h2>
          <p className="text-xs text-gray-700">{data.languages}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2: MODERN GREEN (Dark Emerald Header Banner, Pill Tags, Modern Layout)
// ═══════════════════════════════════════════════════════════════════════════════
const TemplateModernGreen = ({ data }) => {
  const skillList = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="font-sans text-[13px] leading-relaxed space-y-4">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-5 -mx-4 -mt-4 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          {data.fullName || "Your Full Name"}
        </h1>
        <p className="text-sm font-medium text-emerald-200 mt-0.5">
          {data.title || "Professional Title"}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-100/90 mt-3 pt-3 border-t border-emerald-800">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>· {data.phone}</span>}
          {data.location && <span>· {data.location}</span>}
          {data.website && <span>· {data.website}</span>}
        </div>
      </div>

      {/* Career Objective */}
      {data.objective && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-xs leading-relaxed pl-3">{data.objective}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.some((e) => e.role || e.company) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-2">
            Work Experience
          </h2>
          <div className="space-y-2.5 pl-3">
            {data.experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{exp.role}</span>
                    <span className="font-medium text-emerald-800 shrink-0">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line mt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.some((e) => e.degree || e.institution) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-1.5">
            Education
          </h2>
          <div className="space-y-2 pl-3">
            {data.education.map((edu, i) =>
              edu.degree || edu.institution ? (
                <div key={i} className="text-xs flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{edu.degree}</span>
                    <span className="text-gray-600 ml-2">· {edu.institution}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-gray-600">{edu.year}</span>
                    {edu.score && <span className="ml-2 font-bold text-emerald-900">({edu.score})</span>}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Research Papers & Publications */}
      {data.publications?.some((p) => p.title) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-2">
            Research Publications
          </h2>
          <div className="space-y-2 pl-3">
            {data.publications.map((pub, i) =>
              pub.title ? (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{pub.title}</span>
                    <span className="font-normal text-gray-600 shrink-0">{pub.year}</span>
                  </div>
                  {pub.journal && <p className="text-emerald-800 text-[11px] font-semibold">{pub.journal}</p>}
                  {pub.description && <p className="text-gray-700 text-xs mt-0.5">{pub.description}</p>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Certifications & Trainings */}
      {data.certificationsList?.some((c) => c.name) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-1.5">
            Certifications
          </h2>
          <div className="space-y-1 pl-3">
            {data.certificationsList.map((cert, i) =>
              cert.name ? (
                <div key={i} className="text-xs flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
                  </div>
                  {cert.year && <span className="text-gray-500 font-medium shrink-0 ml-2">{cert.year}</span>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Skills Pill Badges */}
      {skillList.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-1.5">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5 pl-3">
            {skillList.map((s, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-md"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {(data.customSections || []).map((sec) =>
        sec.items?.some((it) => it.title || it.description) ? (
          <div key={sec.id}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-l-3 border-emerald-600 pl-2 mb-1.5">
              {sec.heading}
            </h2>
            <div className="space-y-1.5 pl-3">
              {sec.items.map((it, i) =>
                it.title || it.description ? (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{it.title}</span>
                      <span className="font-normal text-gray-600 shrink-0">{it.year}</span>
                    </div>
                    {it.description && <p className="text-gray-700 text-xs">{it.description}</p>}
                  </div>
                ) : null
              )}
            </div>
          </div>
        ) : null
      )}

      {/* Languages */}
      {data.languages && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-700">
            <span className="font-bold text-emerald-900">Languages: </span>
            {data.languages}
          </p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3: CLASSIC SERIF (Formal, Academic / Government / Traditional CV)
// ═══════════════════════════════════════════════════════════════════════════════
const TemplateClassicSerif = ({ data }) => {
  const skillList = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="font-serif text-[13px] leading-relaxed text-gray-900 space-y-3.5">
      {/* Centered Header */}
      <div className="text-center pb-2 border-b-2 border-gray-900">
        <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
          {data.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs font-semibold italic text-gray-700 mt-0.5">
          {data.title || "Professional Title"}
        </p>

        <div className="flex justify-center flex-wrap gap-x-3 text-xs text-gray-700 mt-1.5 font-sans">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>| {data.phone}</span>}
          {data.email && <span>| {data.email}</span>}
          {data.website && <span>| {data.website}</span>}
        </div>
      </div>

      {/* Career Objective */}
      {data.objective && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Career Objective
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">{data.objective}</p>
        </div>
      )}

      {/* Education */}
      {data.education?.some((e) => e.degree || e.institution) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu, i) =>
              edu.degree || edu.institution ? (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>{edu.institution}</span>
                    <span className="font-normal font-sans text-gray-700">{edu.year}</span>
                  </div>
                  <div className="flex justify-between italic text-gray-800">
                    <span>{edu.degree}</span>
                    {edu.score && <span className="font-sans not-italic font-semibold">{edu.score}</span>}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience?.some((e) => e.role || e.company) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Professional Experience
          </h2>
          <div className="space-y-2">
            {data.experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>
                      {exp.role}, <span className="italic font-normal">{exp.company}</span>
                    </span>
                    <span className="font-normal font-sans text-gray-700 shrink-0">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-line pl-2 border-l border-gray-300">
                      {exp.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Publications */}
      {data.publications?.some((p) => p.title) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Publications & Research Papers
          </h2>
          <div className="space-y-1.5">
            {data.publications.map((pub, i) =>
              pub.title ? (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>{pub.title}</span>
                    <span className="font-normal font-sans text-gray-700 shrink-0">{pub.year}</span>
                  </div>
                  {pub.journal && <p className="italic text-gray-800 text-[11px]">{pub.journal}</p>}
                  {pub.description && <p className="text-gray-700 text-xs">{pub.description}</p>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certificationsList?.some((c) => c.name) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <div className="space-y-1">
            {data.certificationsList.map((cert, i) =>
              cert.name ? (
                <div key={i} className="text-xs flex justify-between items-baseline">
                  <span>
                    <strong className="text-black">{cert.name}</strong>
                    {cert.issuer && <span className="italic"> — {cert.issuer}</span>}
                  </span>
                  {cert.year && <span className="font-sans text-gray-700">{cert.year}</span>}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Skills & Competencies
          </h2>
          <p className="text-xs text-gray-800">{skillList.join(" • ")}</p>
        </div>
      )}

      {/* Custom Sections */}
      {(data.customSections || []).map((sec) =>
        sec.items?.some((it) => it.title || it.description) ? (
          <div key={sec.id}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
              {sec.heading}
            </h2>
            <div className="space-y-1.5">
              {sec.items.map((it, i) =>
                it.title || it.description ? (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{it.title}</span>
                      <span className="font-normal font-sans text-gray-700 shrink-0">{it.year}</span>
                    </div>
                    {it.description && <p className="text-gray-700 text-xs">{it.description}</p>}
                  </div>
                ) : null
              )}
            </div>
          </div>
        ) : null
      )}

      {/* Languages */}
      {data.languages && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-400 pb-0.5 mb-1">
            Languages
          </h2>
          <p className="text-xs text-gray-800">{data.languages}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
