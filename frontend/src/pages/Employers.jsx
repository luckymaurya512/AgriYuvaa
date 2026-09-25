import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Bell, MapPin, Briefcase, Trash2, ShieldAlert } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchSeekerProfile } from "../services/userService.js";
import { toggleFollowEmployer, enablePushNotifications } from "../services/notificationService.js";
import SEO from "../components/SEO.jsx";

const Employers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [employers, setEmployers] = useState([]);
  const [followedIds, setFollowedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get("/employers")
      .then((r) => setEmployers(r.data))
      .catch(() => setEmployers([]));

    if (user?.role === "seeker") {
      fetchSeekerProfile()
        .then((p) => {
          if (p?.followedEmployers) {
            const ids = [];
            p.followedEmployers.forEach((e) => {
              if (e?._id) ids.push(e._id.toString());
              if (e?.user) ids.push((e.user._id || e.user).toString());
              if (typeof e === "string") ids.push(e);
            });
            setFollowedIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleFollowToggle = async (empId, companyName) => {
    if (!user || user.role !== "seeker") {
      alert("Please log in as a Job Seeker to follow employers.");
      return;
    }
    setLoadingId(empId);
    try {
      const res = await toggleFollowEmployer(empId);
      const isNowFollowing = res.isFollowing;
      if (isNowFollowing) {
        setFollowedIds([...followedIds, empId.toString()]);
        enablePushNotifications().catch(() => {});
        alert(`🔔 You are now following ${companyName}! You will receive instant push & email alerts when they post new jobs.`);
      } else {
        setFollowedIds(followedIds.filter((id) => id !== empId.toString()));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteEmployer = async (empId, companyName) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete employer "${companyName}"?\n\nThis will remove their profile and any associated jobs posted by them.`
    );
    if (!confirmed) return;

    setDeletingId(empId);
    try {
      await api.delete(`/admin/employers/${empId}`);
      setEmployers((prev) => prev.filter((e) => e._id !== empId));
      alert(`✓ Employer "${companyName}" deleted successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete employer.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title="Verified Employers & Farms Hiring on AgriYuvaa"
        description="Browse agricultural companies, progressive farms, and seed enterprises actively hiring talent across India."
        canonical="/employers"
      />
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Hiring Employers on AgriYuvaa</h1>
          <p className="text-sm text-brand-grey">
            Farms, agri-businesses, and enterprises hiring talent. Follow your favorite companies to get instant job alerts!
          </p>
        </div>
        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            <ShieldAlert size={14} className="text-emerald-700" />
            <span>Admin Mode: You can delete test or unwanted employers directly</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {employers.map((emp) => {
          const isFollowing = followedIds.includes(emp._id.toString());

          return (
            <div
              key={emp._id}
              className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow border border-brand-border space-y-4 relative group"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-brand-green-light flex items-center justify-center shrink-0">
                  <Building2 size={24} className="text-brand-green-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base text-brand-black truncate">
                    {emp.companyName}
                  </h3>
                  <p className="text-xs text-brand-grey mt-0.5">{emp.sector || "Agriculture & Agribusiness"}</p>
                  {emp.location && (
                    <p className="text-xs text-brand-grey flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-brand-green" /> {emp.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions: Follow Company / Delete Employer (Admin) + View Jobs */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-brand-border">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEmployer(emp._id, emp.companyName)}
                    disabled={deletingId === emp._id}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title={`Delete employer "${emp.companyName}"`}
                  >
                    <Trash2 size={13} />
                    {deletingId === emp._id ? "Deleting..." : "Delete"}
                  </button>
                ) : user?.role === "seeker" ? (
                  <button
                    type="button"
                    onClick={() => handleFollowToggle(emp._id, emp.companyName)}
                    disabled={loadingId === emp._id}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      isFollowing
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-gray-700 border-gray-300 hover:border-emerald-500 hover:text-emerald-800"
                    }`}
                  >
                    <Bell size={13} fill={isFollowing ? "currentColor" : "none"} />
                    {loadingId === emp._id ? "..." : isFollowing ? "Following ✓" : "Follow"}
                  </button>
                ) : (
                  <div></div>
                )}

                <Link
                  to={`/jobs?keyword=${encodeURIComponent(emp.companyName)}`}
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1 ml-auto"
                >
                  <Briefcase size={12} /> View Jobs
                </Link>
              </div>
            </div>
          );
        })}

        {employers.length === 0 && (
          <p className="text-sm text-brand-grey col-span-3">No verified employers yet.</p>
        )}
      </div>
    </div>
  );
};

export default Employers;
