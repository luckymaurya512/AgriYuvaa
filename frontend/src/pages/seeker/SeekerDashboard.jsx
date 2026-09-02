import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Briefcase, MapPin, Trash2, ArrowRight, Building2, Bell, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyApplications } from "../../services/jobService.js";
import { fetchSeekerProfile, toggleSaveJob } from "../../services/userService.js";
import { toggleFollowEmployer } from "../../services/notificationService.js";
import JobCard from "../../components/JobCard.jsx";

const statusColors = {
  applied: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-emerald-100 text-emerald-800 font-bold",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-green-100 text-green-700 font-bold",
};

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "saved" | "following"
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [followedEmployers, setFollowedEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, profile] = await Promise.all([
        fetchMyApplications().catch(() => []),
        fetchSeekerProfile().catch(() => null),
      ]);
      setApplications(apps || []);
      setSavedJobs(profile?.savedJobs || []);
      setFollowedEmployers(profile?.followedEmployers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUnfollow = async (empId) => {
    try {
      await toggleFollowEmployer(empId);
      setFollowedEmployers((prev) => prev.filter((e) => (e._id || e) !== empId));
    } catch (err) {
      console.error("Failed to unfollow employer:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-sm text-brand-grey mb-8">
        Track your job applications, saved postings, followed employers, and resume.
      </p>

      {/* Top 4 Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Applications Sent</p>
          <p className="text-3xl font-display font-bold mt-2 text-brand-black">{applications.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-brand-grey uppercase font-semibold">Shortlisted</p>
          <p className="text-3xl font-display font-bold mt-2 text-emerald-700">
            {applications.filter((a) => a.status === "shortlisted").length}
          </p>
        </div>
        <div
          onClick={() => setActiveTab("saved")}
          className="card p-5 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <p className="text-xs text-brand-grey uppercase font-semibold flex items-center gap-1">
            <Bookmark size={13} className="text-emerald-700" /> Saved Jobs
          </p>
          <p className="text-3xl font-display font-bold mt-2 text-brand-black">{savedJobs.length}</p>
        </div>
        <div
          onClick={() => setActiveTab("following")}
          className="card p-5 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <p className="text-xs text-brand-grey uppercase font-semibold flex items-center gap-1">
            <Bell size={13} className="text-emerald-700" /> Followed Companies
          </p>
          <p className="text-3xl font-display font-bold mt-2 text-brand-black">{followedEmployers.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-brand-border mb-6">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "applications"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          My Applications
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "saved"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          Saved Jobs
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {savedJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "following"
              ? "border-brand-green text-brand-green-dark"
              : "border-transparent text-brand-grey hover:text-brand-black"
          }`}
        >
          Followed Companies
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {followedEmployers.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MY APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="card overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn-primary text-xs inline-flex py-2 px-4">
                Explore Agriculture Jobs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
                  <tr>
                    <th className="text-left px-5 py-3.5">Job Title</th>
                    <th className="text-left px-5 py-3.5">Company</th>
                    <th className="text-left px-5 py-3.5">Applied On</th>
                    <th className="text-left px-5 py-3.5">Status</th>
                    <th className="text-right px-5 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-t border-brand-border hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 font-medium">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="hover:text-brand-green-dark font-semibold"
                        >
                          {app.job?.title || "Position"}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-brand-grey">
                        {app.job?.companyName || app.job?.employer?.name || "Hiring Company"}
                      </td>
                      <td className="px-5 py-3.5 text-brand-grey">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            statusColors[app.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="text-xs font-bold text-brand-green-dark hover:underline"
                        >
                          View Job →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED JOBS */}
      {activeTab === "saved" && (
        <div>
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading saved jobs...</p>
          ) : savedJobs.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <Bookmark size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">No bookmarked jobs yet.</p>
              <p className="text-xs text-brand-grey">
                Click the bookmark icon on any job card to save it for later.
              </p>
              <Link to="/jobs" className="btn-primary text-xs inline-flex py-2 px-4 mt-2">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <div key={job._id} className="relative">
                  <JobCard
                    job={job}
                    isSavedInitial={true}
                    onBookmarkChange={(jobId, isNowSaved) => {
                      if (!isNowSaved) {
                        setSavedJobs((prev) => prev.filter((j) => (j._id || j) !== jobId));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FOLLOWED COMPANIES */}
      {activeTab === "following" && (
        <div>
          {loading ? (
            <p className="p-8 text-center text-sm text-brand-grey">Loading followed companies...</p>
          ) : followedEmployers.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <Building2 size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-brand-black">You are not following any employers yet.</p>
              <p className="text-xs text-brand-grey">
                Follow your favorite farms & agri-businesses on the Employers page or Job Details page to get instant push & email alerts whenever they post jobs!
              </p>
              <Link to="/employers" className="btn-primary text-xs inline-flex py-2 px-4 mt-2">
                Discover Employers
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedEmployers.map((emp) => (
                <div key={emp._id} className="card p-5 flex flex-col justify-between border border-brand-border space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                      {emp.companyName ? emp.companyName[0] : "E"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-brand-black truncate">{emp.companyName}</h3>
                      <p className="text-xs text-brand-grey">{emp.sector || "Agriculture"}</p>
                      {emp.location && (
                        <p className="text-xs text-brand-grey flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-brand-green" /> {emp.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleUnfollow(emp._id)}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium"
                    >
                      Unfollow
                    </button>
                    <Link
                      to={`/jobs?keyword=${encodeURIComponent(emp.companyName)}`}
                      className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1"
                    >
                      View Jobs →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
