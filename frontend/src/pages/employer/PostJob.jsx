import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Mail, ExternalLink, FileText, Building2, Sparkles, Loader2, ArrowLeft, Calendar, PlusCircle } from "lucide-react";
import { fetchCategories, createJob, fetchJobById, updateJob } from "../../services/jobService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import RichTextEditor from "../../components/common/RichTextEditor.jsx";

const employmentTypes = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "work-from-home", label: "Work From Home / Remote" },
  { value: "internship", label: "Internship" },
];
const experienceLevels = [
  { value: "0-1", label: "0-1 Years (Fresher / Junior)" },
  { value: "1-2", label: "1-2 Years" },
  { value: "2-3", label: "2-3 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years (Senior / Lead)" },
];

const cleanSalaryInput = (val) => {
  if (!val) return "";
  return String(val).replace(/[^0-9,]/g, "");
};

const parseSalaryToNumber = (val) => {
  if (!val) return undefined;
  const raw = String(val).replace(/,/g, "").trim();
  const num = Number(raw);
  return isNaN(num) || num <= 0 ? undefined : num;
};

const formatSalaryDisplay = (val) => {
  const num = parseSalaryToNumber(val);
  if (!num) return "";
  return `₹${num.toLocaleString("en-IN")}`;
};

const PostJob = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get("edit") || paramId;
  const isEdit = Boolean(editJobId);

  const { user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    category: "",
    customCategory: "",
    employmentType: "full-time",
    experienceLevel: "0-1",
    location: "",
    salaryMin: "",
    salaryMax: "",
    cropTags: "",
    applicationDeadline: "",
    applyType: "platform", // "platform" | "email" | "external_link"
    applyEmail: "",
    applyEmailSubject: "",
    applyEmailInstructions: "",
    applyUrl: "",
    isFeatured: false,
    featuredRequested: false,
    isUrgent: false,
  });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (editJobId) {
      setInitialLoading(true);
      fetchJobById(editJobId)
        .then((job) => {
          if (!job) return;
          const deadlineStr = job.applicationDeadline || job.expiresAt
            ? new Date(job.applicationDeadline || job.expiresAt).toISOString().split("T")[0]
            : "";
          setForm({
            title: job.title || "",
            companyName: job.companyName || "",
            description: job.description || "",
            responsibilities: (job.responsibilities || []).join("\n"),
            requirements: (job.requirements || []).join("\n"),
            benefits: (job.benefits || []).join("\n"),
            category: job.category?._id || job.category || "",
            employmentType: job.employmentType || "full-time",
            experienceLevel: job.experienceLevel === "any" ? "0-1" : (job.experienceLevel || "0-1"),
            location: job.location || "",
            salaryMin: job.salaryMin !== undefined && job.salaryMin !== null ? Number(job.salaryMin).toLocaleString("en-IN") : "",
            salaryMax: job.salaryMax !== undefined && job.salaryMax !== null ? Number(job.salaryMax).toLocaleString("en-IN") : "",
            cropTags: (job.cropTags || []).join(", "),
            applicationDeadline: deadlineStr,
            applyType: job.applyType || "platform",
            applyEmail: job.applyEmail || "",
            applyEmailSubject: job.applyEmailSubject || "",
            applyEmailInstructions: job.applyEmailInstructions || "",
            applyUrl: job.applyUrl || "",
            isFeatured: job.isFeatured || false,
            featuredRequested: job.featuredRequested || false,
            isUrgent: job.isUrgent || false,
          });
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load job details for editing");
        })
        .finally(() => setInitialLoading(false));
    }
  }, [editJobId]);

  const parseList = (text) =>
    (text || "")
      .split("\n")
      .map((s) => s.replace(/^[-*•\d.]+\s*/, "").trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate custom category
    if (form.category === "custom" && !form.customCategory?.trim()) {
      setError("Please enter the name of your custom category");
      return;
    }

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
      const payload = {
        ...form,
        category: form.category === "custom" ? "custom" : form.category,
        customCategory: form.category === "custom" ? form.customCategory.trim() : undefined,
        responsibilities: parseList(form.responsibilities),
        requirements: parseList(form.requirements),
        benefits: parseList(form.benefits),
        salaryMin: parseSalaryToNumber(form.salaryMin),
        salaryMax: parseSalaryToNumber(form.salaryMax),
        cropTags: form.cropTags ? form.cropTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        applicationDeadline: form.applicationDeadline ? form.applicationDeadline : null,
        expiresAt: form.applicationDeadline ? form.applicationDeadline : null,
      };

      if (isEdit) {
        await updateJob(editJobId, payload);
        alert(
          isAdmin
            ? "Job listing updated successfully!"
            : "Job updated! If modified, changes will be reviewed by admin moderation."
        );
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/employer");
        }
      } else {
        await createJob(payload);
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/employer");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not save job posting");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-24 text-center text-sm text-brand-grey flex items-center justify-center gap-2">
        <Loader2 size={18} className="animate-spin text-brand-green" /> Loading job details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-grey hover:text-brand-black mb-3 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-2xl font-display font-bold mb-1">
          {isEdit ? "Edit Job Listing" : isAdmin ? "Post a Job / Hiring Alert" : "Post a New Job"}
        </h1>
        <p className="text-sm text-brand-grey">
          {isEdit
            ? "Update role requirements, location, salary, or application instructions."
            : isAdmin
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
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${form.applyType === "platform"
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
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${form.applyType === "email"
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
              className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${form.applyType === "external_link"
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
        <RichTextEditor
          label="Job Overview / Description"
          required
          rows={5}
          placeholder="Brief overview of the role, team, and company mission..."
          value={form.description}
          onChange={(val) => setForm({ ...form, description: val })}
        />

        {/* Responsibilities */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide flex items-center justify-between">
            <span>Key Responsibilities</span>
            <span className="text-[11px] text-brand-grey font-normal lowercase">(1 bullet point per line)</span>
          </label>
          <textarea
            rows={4}
            placeholder="• Lead soil nutrient analysis and fertigation schedule&#10;• Coordinate with farm supervisors on harvesting timelines&#10;• Maintain compliance records per SOP"
            className="input-field mt-1 text-sm"
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide flex items-center justify-between">
            <span>Requirements & Qualifications</span>
            <span className="text-[11px] text-brand-grey font-normal lowercase">(1 bullet point per line)</span>
          </label>
          <textarea
            rows={4}
            placeholder="• B.Sc / M.Sc in Agriculture, Agronomy, or related discipline&#10;• 1+ years experience in polyhouse or field operations&#10;• Good communication skills in Hindi & English"
            className="input-field mt-1 text-sm"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
        </div>

        {/* Benefits & Perks */}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide flex items-center justify-between">
            <span>Perks & Benefits (Optional)</span>
            <span className="text-[11px] text-brand-grey font-normal lowercase">(1 bullet point per line)</span>
          </label>
          <textarea
            rows={3}
            placeholder="• On-farm accommodation & meals provided&#10;• Performance bonus & travel allowance&#10;• Health & accidental insurance"
            className="input-field mt-1 text-sm"
            value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
          />
        </div>

        {/* Category & Employment Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Category *
              </label>
              {form.category !== "custom" ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, category: "custom", customCategory: "" })}
                  className="text-xs font-bold text-brand-green-dark hover:text-brand-green flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <PlusCircle size={13} /> + Add Custom Category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, category: categories[0]?._id || "", customCategory: "" })}
                  className="text-xs font-semibold text-brand-grey hover:text-brand-black flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Choose existing list
                </button>
              )}
            </div>

            {form.category === "custom" ? (
              <div className="mt-1">
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydroponics & Vertical Farming, Bio-Pesticides, Drone Operations..."
                  className="input-field text-sm"
                  value={form.customCategory || ""}
                  onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                />
              </div>
            ) : (
              <select
                required
                className="input-field mt-1 text-sm"
                value={form.category}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setForm({ ...form, category: "custom", customCategory: "" });
                  } else {
                    setForm({ ...form, category: e.target.value, customCategory: "" });
                  }
                }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
                <option value="custom" className="font-semibold text-brand-green-dark">
                  + Add Custom Category...
                </option>
              </select>
            )}
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
                <option key={t.value} value={t.value}>
                  {t.label}
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
                <option key={l.value} value={l.value}>
                  {l.label}
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Salary Min (₹)
              </label>
              {formatSalaryDisplay(form.salaryMin) && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  {formatSalaryDisplay(form.salaryMin)}
                </span>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 25,000 or 25000"
              className="input-field mt-1 text-sm"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: cleanSalaryInput(e.target.value) })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Salary Max (₹)
              </label>
              {formatSalaryDisplay(form.salaryMax) && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  {formatSalaryDisplay(form.salaryMax)}
                </span>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 45,000 or 45000"
              className="input-field mt-1 text-sm"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: cleanSalaryInput(e.target.value) })}
            />
          </div>
        </div>

        {/* Application Deadline / Expiration Date */}
        <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-700" />
              Application Deadline / Expiration Date (Optional)
            </label>
            {form.applicationDeadline && (
              <button
                type="button"
                onClick={() => setForm({ ...form, applicationDeadline: "" })}
                className="text-[11px] font-semibold text-emerald-800 hover:text-red-700 underline cursor-pointer"
              >
                Clear Date
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="input-field text-sm bg-white max-w-xs cursor-pointer"
              value={form.applicationDeadline}
              onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
            />
          </div>
          <p className="text-[11px] text-brand-grey leading-relaxed">
            {form.applicationDeadline ? (
              <span className="text-emerald-900 font-medium">
                ✓ This job will automatically stop appearing on the public /jobs page after{" "}
                <strong>
                  {new Date(form.applicationDeadline).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                .
              </span>
            ) : (
              "Leave blank if this job listing should stay active indefinitely until manually closed."
            )}
          </p>
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

        {/* Featured & Urgent Badges */}
        <div className="p-4 bg-gray-50 rounded-xl border border-brand-border space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-grey">Visibility & Boost</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-2.5 text-xs font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFeatured || form.featuredRequested || false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isFeatured: isAdmin ? e.target.checked : false,
                    featuredRequested: !isAdmin ? e.target.checked : false,
                  })
                }
                className="w-4 h-4 rounded text-brand-green focus:ring-brand-green mt-0.5"
              />
              <div>
                <span>
                  ⭐ <strong>{isAdmin ? "Featured Listing (Direct)" : "Request Featured Boost"}</strong>
                </span>
                <p className="text-[11px] text-brand-grey mt-0.5">
                  {isAdmin
                    ? "Pins job to top of search results with gold badge."
                    : "Top search placement. Reviewed & activated by Admin team."}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isUrgent || false}
                onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 mt-0.5"
              />
              <div>
                <span>⚡ <strong>Urgent Hiring</strong></span>
                <p className="text-[11px] text-brand-grey mt-0.5">Displays prominent urgent hiring priority badge.</p>
              </div>
            </label>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button disabled={loading} type="submit" className="btn-primary w-full py-3">
          {loading
            ? "Saving..."
            : isEdit
              ? "Save & Update Job Listing"
              : isAdmin
                ? "Publish Job"
                : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
