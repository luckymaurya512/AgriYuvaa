import React, { useEffect, useState } from "react";
import { fetchPlatformStats, fetchUsers, updateUserStatus, createAdmin } from "../../services/adminService.js";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const loadAll = () => {
    fetchPlatformStats().then(setStats).catch(() => {});
    fetchUsers().then(setUsers).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const handleStatusToggle = async (user) => {
    const next = user.status === "active" ? "suspended" : "active";
    await updateUserStatus(user._id, next);
    loadAll();
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createAdmin(adminForm);
      setShowAdminForm(false);
      setAdminForm({ name: "", email: "", password: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create admin");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Super Admin Dashboard</h1>
          <p className="text-sm text-brand-grey">Full platform control and oversight</p>
        </div>
        <button onClick={() => setShowAdminForm(!showAdminForm)} className="btn-primary">
          + New Admin
        </button>
      </div>

      {showAdminForm && (
        <form onSubmit={handleCreateAdmin} className="card p-5 mb-8 grid md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase">Name</label>
            <input required className="input-field mt-1 text-sm" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase">Email</label>
            <input required type="email" className="input-field mt-1 text-sm" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase">Password</label>
            <input required type="password" className="input-field mt-1 text-sm" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} />
          </div>
          <button type="submit" className="btn-secondary h-fit">Create Admin</button>
          {error && <p className="text-xs text-red-600 md:col-span-4">{error}</p>}
        </form>
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
        <div className="px-5 py-4 border-b border-brand-border font-semibold text-sm">All Users</div>
        <table className="w-full text-sm">
          <thead className="bg-brand-surface text-xs uppercase text-brand-grey">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-brand-border">
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-brand-grey">{u.email}</td>
                <td className="px-5 py-3 capitalize text-brand-grey">{u.role}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    u.status === "active" ? "bg-brand-green-light text-brand-green-dark" : "bg-red-100 text-red-700"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.role !== "superadmin" && (
                    <button onClick={() => handleStatusToggle(u)} className="text-xs font-semibold text-brand-green-dark hover:underline">
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
  );
};

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs text-brand-grey uppercase font-semibold">{label}</p>
    <p className="text-3xl font-display font-bold mt-2">{value}</p>
  </div>
);

export default SuperAdminDashboard;
