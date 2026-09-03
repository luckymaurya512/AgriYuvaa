import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ShieldCheck, ShieldAlert, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import {
  fetchPlatformStats,
  fetchUsers,
  updateUserStatus,
  createAdmin,
  updateUserRole,
} from "../../services/adminService.js";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchUsers().then(setUsers).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleStatusToggle = async (user) => {
    const next = user.status === "active" ? "suspended" : "active";
    await updateUserStatus(user._id, next);
    loadAll();
  };

  const handleRoleToggle = async (user, newRole) => {
    if (!window.confirm(`Are you sure you want to change ${user.name}'s role to "${newRole}"?`)) return;
    try {
      await updateUserRole(user._id, newRole);
      setSuccessMsg(`Role for ${user.name} updated to "${newRole}".`);
      setTimeout(() => setSuccessMsg(""), 4000);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleUpgradeAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoadingAction(true);
    try {
      const res = await createAdmin({ email: adminEmail });
      setSuccessMsg(res.message || "User successfully upgraded to Admin! ✉️ Confirmation email sent.");
      setShowAdminForm(false);
      setAdminEmail("");
      loadAll();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upgrade user to Admin");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Super Admin Dashboard</h1>
          <p className="text-sm text-brand-grey">Full platform control, user roles, and moderation oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/employer/post-job"
            className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4"
          >
            <PlusCircle size={16} /> Post Direct Job
          </Link>
          <button
            onClick={() => {
              setShowAdminForm(!showAdminForm);
              setError("");
            }}
            className="btn-secondary text-sm flex items-center gap-2 py-2.5 px-4"
          >
            <ShieldCheck size={16} className="text-brand-green" /> + Upgrade User to Admin
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAdminForm && (
        <div className="card p-6 mb-8 border-2 border-emerald-100 bg-emerald-50/20 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand-green" /> Upgrade Registered User to Admin
              </h3>
              <p className="text-xs text-brand-grey mt-0.5">
                The user must have an existing registered account. Once upgraded, they can log in using their own email and password to access the Admin Panel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminForm(false)}
              className="text-xs text-brand-grey hover:text-brand-black"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleUpgradeAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              required
              type="email"
              placeholder="Enter registered user's email address (e.g. name@gmail.com)"
              className="input-field text-sm bg-white flex-1"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            <button
              disabled={loadingAction}
              type="submit"
              className="btn-primary text-xs py-2.5 px-5 shrink-0 flex items-center justify-center gap-1.5"
            >
              {loadingAction ? "Upgrading..." : "Grant Admin Privileges"}
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </div>
      )}

      {stats && (
        <div className="grid md:grid-cols-4 gap-5 mb-10">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Employers" value={stats.totalEmployers} />
          <StatCard label="Job Seekers" value={stats.totalSeekers} />
          <StatCard label="Applications" value={stats.totalApplications} />
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm flex items-center justify-between">
          <span>All Registered Users ({users.length})</span>
          <span className="text-xs text-brand-grey font-normal">Super Admin role manager</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Role Actions</th>
                <th className="text-right px-5 py-3">Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-brand-border hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-brand-black">{u.name}</td>
                  <td className="px-5 py-3 text-brand-grey">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md capitalize ${
                        u.role === "superadmin"
                          ? "bg-purple-100 text-purple-900 border border-purple-200"
                          : u.role === "admin"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          : u.role === "employer"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        u.status === "active"
                          ? "bg-brand-green-light text-brand-green-dark"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.role === "admin" ? (
                      (() => {
                        const originalRole =
                          u.originalRole || u.previousRole || (u.hasEmployerProfile ? "employer" : "seeker");
                        return (
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleRoleToggle(u, originalRole)}
                              className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                              title={`Restore ${u.name} back to original role: ${originalRole === "employer" ? "Employer" : "Job Seeker"}`}
                            >
                              <ShieldAlert size={13} className="text-amber-600" /> Demote to {originalRole === "employer" ? "Employer" : "Seeker"}
                            </button>
                          </div>
                        );
                      })()
                    ) : u.role !== "superadmin" ? (
                      <button
                        onClick={() => handleRoleToggle(u, "admin")}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                        title="Grant full Admin privileges"
                      >
                        <ShieldCheck size={13} className="text-emerald-600" /> Make Admin
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Primary Owner</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.role !== "superadmin" && (
                      <button
                        onClick={() => handleStatusToggle(u)}
                        className={`text-xs font-semibold hover:underline ${
                          u.status === "active" ? "text-red-600" : "text-brand-green-dark"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Reactivate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs text-brand-grey uppercase font-semibold">{label}</p>
    <p className="text-3xl font-display font-bold mt-2">{value}</p>
  </div>
);

export default SuperAdminDashboard;
