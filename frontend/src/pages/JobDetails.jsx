import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Calendar, Share2, CheckCircle2 } from "lucide-react";
import { fetchJobById, applyToJob } from "../services/jobService.js";
import { useAuth } from "../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(() => setError("This job could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await applyToJob(id, { resumeUrl, coverNote });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application");
    }
  };

  if (loading) return <div className="py-24 text-center text-brand-grey">Loading job...</div>;
  if (!job) return <div className="py-24 text-center text-brand-grey">{error || "Job not found."}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          {job.isFeatured && <span className="badge-featured mb-3 inline-block">Featured</span>}
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{job.title}</h1>
          <p className="text-brand-grey">{job.employer?.name}</p>

          <div className="flex flex-wrap gap-4 text-sm text-brand-grey mt-4">
            <span className="inline-flex items-center gap-1"><MapPin size={16} className="text-brand-green" /> {job.location}</span>
            <span className="inline-flex items-center gap-1"><Briefcase size={16} className="text-brand-green" /> {job.employmentType}</span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="inline-flex items-center gap-1">
                <IndianRupee size={16} className="text-brand-green" />
                {job.salaryMin && job.salaryMax
                  ? `₹${job.salaryMin.toLocaleString("en-IN")} - ₹${job.salaryMax.toLocaleString("en-IN")}`
                  : `₹${(job.salaryMin || job.salaryMax).toLocaleString("en-IN")}+`}
              </span>
            )}
            <span className="inline-flex items-center gap-1"><Calendar size={16} className="text-brand-green" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-3">Job Description</h2>
          <p className="text-sm text-brand-grey whitespace-pre-line">{job.description}</p>
        </div>

        {job.responsibilities?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-3">Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.map((r, i) => (
                <li key={i} className="text-sm text-brand-grey flex gap-2">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="card p-6 sticky top-24">
          <h2 className="font-display font-semibold mb-4">Apply for this role</h2>

          {!user ? (
            <div className="text-sm text-brand-grey">
              <Link to="/login" className="text-brand-green-dark font-semibold">Log in</Link> or{" "}
              <Link to="/register" className="text-brand-green-dark font-semibold">create an account</Link> to apply.
            </div>
          ) : user.role !== "seeker" ? (
            <p className="text-sm text-brand-grey">Only job seeker accounts can apply to jobs.</p>
          ) : applied ? (
            <p className="text-sm text-brand-green-dark font-semibold">Application submitted! You can track its status from your dashboard.</p>
          ) : (
            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Resume URL</label>
                <input
                  required
                  className="input-field mt-1 text-sm"
                  placeholder="Link to your resume (PDF)"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Cover Note (optional)</label>
                <textarea
                  className="input-field mt-1 text-sm"
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button type="submit" className="btn-primary w-full">Submit Application</button>
            </form>
          )}

          <button className="btn-secondary w-full mt-3 text-sm">
            <Share2 size={16} /> Share this job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
