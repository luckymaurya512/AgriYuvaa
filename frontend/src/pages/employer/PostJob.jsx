import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ExternalLink, FileText, Building2, Sparkles } from "lucide-react";
import { fetchCategories, createJob } from "../../services/jobService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const employmentTypes = ["full-time", "part-time", "seasonal", "daily-wage", "contract", "internship"];
const experienceLevels = ["entry", "mid", "senior", "any"];

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    category: "",
    employmentType: "full-time",
    experienceLevel: "any",
    location: "",
    salaryMin: "",
    salaryMax: "",
    cropTags: "",
    applyType: "platform", // "platform" | "email" | "external_link"
    applyEmail: "",
    applyEmailSubject: "",
    applyEmailInstructions: "",
    applyUrl: "",
  });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate based on applyType
    if (form.applyType === "email" && !form.applyEmail) {
      setError("Please enter the HR contact email");
      return;
    }
    if (form.applyType === "external_link" && !form.applyUrl) {
      setError("Please enter the external application website URL");
      return;
    }

    setLoading(true);
    try {
      await createJob({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        cropTags: form.cropTags ? form.cropTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/employer");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">
          {isAdmin ? "Post a Job / Hiring Alert" : "Post a New Job"}
        </h1>
        <p className="text-sm text-brand-grey">
          {isAdmin
            ? "As an Admin, this job will be published immediately on the portal."
            : "Your listing will go live once approved by our moderation team."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        {/* Job Title */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
            Job Title *
          </label>
          <input
            required
            placeholder="e.g. Agronomist, Farm Supervisor, Drone Operator"
            className="input-field mt-1 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Company Name (Always visible for admin, or if specified) */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide flex items-center justify-between">
            <span>Company / Farm Name {isAdmin && "*"}</span>
            {!isAdmin && <span className="text-[11px] lowercase text-brand-grey font-normal">(Leave blank to use your profile name)</span>}
          </label>
          <div className="relative mt-1">
            <input
              required={isAdmin}
              placeholder="e.g. AgroTech Innovations Pvt Ltd, ITC Agri Business"
              className="input-field text-sm"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
        </div>

        {/* ── APPLICATION METHOD SELECTOR ── */}
        <div className="pt-2 border-t border-brand-border">
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-2">
            How should candidates apply? *
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Option 1: In-App */}
            <button
              type="button"
              onClick={() => setForm({ ...form, applyType: "platform" })}
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                form.applyType === "platform"
                  ? "border-brand-green bg-brand-green-light/40 text-brand-black"
                  : "border-brand-border text-brand-grey hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <FileText size={16} className={form.applyType === "platform" ? "text-brand-green" : "text-brand-grey"} />
                AgriYuvaa In-App
              </div>
              <span className="text-[11px] text-brand-grey">Applicants submit PDF resume on portal</span>
            </button>

            {/* Option 2: Email HR */}
            <button
              type="button"
              onClick={() => setForm({ ...form, applyType: "email" })}
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                form.applyType === "email"
                  ? "border-blue-600 bg-blue-50/70 text-blue-950"
                  : "border-brand-border text-brand-grey hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-blue-900">
                <Mail size={16} className={form.applyType === "email" ? "text-blue-600" : "text-brand-grey"} />
                Email Resume to HR
              </div>
              <span className="text-[11px] text-brand-grey">Applicants send resume directly to HR email</span>
            </button>

            {/* Option 3: External Website */}
            <button
              type="button"
              onClick={() => setForm({ ...form, applyType: "external_link" })}
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                form.applyType === "external_link"
                  ? "border-purple-600 bg-purple-50/70 text-purple-950"
                  : "border-brand-border text-brand-grey hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-purple-900">
                <ExternalLink size={16} className={form.applyType === "external_link" ? "text-purple-600" : "text-brand-grey"} />
                Company Website Link
              </div>
              <span className="text-[11px] text-brand-grey">Direct link to company careers portal</span>
            </button>
          </div>
        </div>

        {/* ── CONDITIONAL FIELDS: EMAIL HR ── */}
        {form.applyType === "email" && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
              <Mail size={14} className="text-blue-600" /> HR Email Application Details
            </h3>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                HR Contact Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. careers@company.com or hr@agrotech.com"
                className="input-field mt-1 text-sm bg-white"
                value={form.applyEmail}
                onChange={(e) => setForm({ ...form, applyEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Recommended Email Subject Line (Optional)
              </label>
              <input
                placeholder={`e.g. Application for ${form.title || "this role"} - via AgriYuvaa`}
                className="input-field mt-1 text-sm bg-white"
                value={form.applyEmailSubject}
                onChange={(e) => setForm({ ...form, applyEmailSubject: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Special Application Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please mention your current CTC, notice period, and portfolio in the email."
                className="input-field mt-1 text-sm bg-white"
                value={form.applyEmailInstructions}
                onChange={(e) => setForm({ ...form, applyEmailInstructions: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* ── CONDITIONAL FIELDS: EXTERNAL LINK ── */}
        {form.applyType === "external_link" && (
          <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <ExternalLink size={14} className="text-purple-600" /> Company Portal Application Details
            </h3>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Company Careers Page / Form URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://company.com/careers/job-123 or Google Form Link"
                className="input-field mt-1 text-sm bg-white"
                value={form.applyUrl}
                onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
            Job Description *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe the role, responsibilities, and qualifications..."
            className="input-field mt-1 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Category & Employment Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Category *
            </label>
            <select
              required
              className="input-field mt-1 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Employment Type
            </label>
            <select
              className="input-field mt-1 text-sm"
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
            >
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience & Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Experience Level
            </label>
            <select
              className="input-field mt-1 text-sm"
              value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            >
              {experienceLevels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Location *
            </label>
            <input
              required
              placeholder="e.g. Pune, Maharashtra / Remote / Delhi"
              className="input-field mt-1 text-sm"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        {/* Salary */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Salary Min (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 25000"
              className="input-field mt-1 text-sm"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
              Salary Max (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 45000"
              className="input-field mt-1 text-sm"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
            Crop / Sector Tags (comma-separated)
          </label>
          <input
            className="input-field mt-1 text-sm"
            placeholder="e.g. wheat, organic, hydroponics, dairy"
            value={form.cropTags}
            onChange={(e) => setForm({ ...form, cropTags: e.target.value })}
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button disabled={loading} type="submit" className="btn-primary w-full py-3">
          {loading
            ? "Publishing..."
            : isAdmin
            ? "Publish Job (Live Immediately)"
            : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
