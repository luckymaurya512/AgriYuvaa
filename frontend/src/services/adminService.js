import api from "./api.js";

export const fetchPlatformStats = () => api.get("/admin/stats").then((r) => r.data);
export const fetchUsers = (params) => api.get("/admin/users", { params }).then((r) => r.data);
export const updateUserStatus = (id, status) =>
  api.patch(`/admin/users/${id}/status`, { status }).then((r) => r.data);
export const createAdmin = (payload) => api.post("/admin/admins", payload).then((r) => r.data);

export const fetchPendingEmployers = () => api.get("/admin/employers/pending").then((r) => r.data);
export const verifyEmployer = (id, decision) =>
  api.patch(`/admin/employers/${id}/verify`, { decision }).then((r) => r.data);

export const fetchPendingJobs = () => api.get("/admin/jobs/pending").then((r) => r.data);
export const reviewJob = (id, decision, rejectionReason) =>
  api.patch(`/admin/jobs/${id}/review`, { decision, rejectionReason }).then((r) => r.data);
