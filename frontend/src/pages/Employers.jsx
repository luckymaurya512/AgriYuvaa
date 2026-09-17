import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Bell, MapPin, Briefcase } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchSeekerProfile } from "../services/userService.js";
import { toggleFollowEmployer, enablePushNotifications } from "../services/notificationService.js";
import SEO from "../components/SEO.jsx";

const Employers = () => {
  const { user } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [followedIds, setFollowedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title="Verified Employers & Farms Hiring on AgriYuvaa"
        description="Browse agricultural companies, progressive farms, and seed enterprises actively hiring talent across India."
        canonical="/employers"
      />
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">Hiring Employers on AgriYuvaa</h1>
        <p className="text-sm text-brand-grey">
          Farms, agri-businesses, and enterprises hiring talent. Follow your favorite companies to get instant job alerts!
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {employers.map((emp) => {
          const isFollowing = followedIds.includes(emp._id.toString());

          return (
            <div
              key={emp._id}
              className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow border border-brand-border space-y-4"
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

              {/* Actions: Follow Company + View Jobs */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-brand-border">
                {user?.role === "seeker" ? (
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
                  className="text-xs font-semibold text-brand-green-dark hover:underline flex items-center gap-1"
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
