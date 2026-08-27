import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, createJob } from "../../services/jobService.js";

const employmentTypes = ["full-time", "part-time", "seasonal", "daily-wage", "contract", "internship"];
const experienceLevels = ["entry", "mid", "senior", "any"];

const PostJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    employmentType: "full-time",
    experienceLevel: "any",
    location: "",
    salaryMin: "",
    salaryMax: "",
    cropTags: "",
  });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createJob({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        cropTags: form.cropTags ? form.cropTags.split(",").map((t) => t.trim()) : [],
      });
      navigate("/employer");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Post a New Job</h1>
      <p className="text-sm text-brand-grey mb-8">Your listing will go live once approved by our team</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Job Title</label>
          <input required className="input-field mt-1 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Description</label>
          <textarea required rows={5} className="input-field mt-1 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Category</label>
            <select required className="input-field mt-1 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Employment Type</label>
            <select className="input-field mt-1 text-sm" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
              {employmentTypes.map((t) => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Experience Level</label>
            <select className="input-field mt-1 text-sm" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
              {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Location</label>
            <input required className="input-field mt-1 text-sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Salary Min (₹)</label>
            <input type="number" className="input-field mt-1 text-sm" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Salary Max (₹)</label>
            <input type="number" className="input-field mt-1 text-sm" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Crop / Sector Tags (comma-separated)</label>
          <input className="input-field mt-1 text-sm" placeholder="e.g. wheat, dairy, greenhouse" value={form.cropTags} onChange={(e) => setForm({ ...form, cropTags: e.target.value })} />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
