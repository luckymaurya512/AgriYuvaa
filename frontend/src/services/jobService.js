import api from "./api.js";

export const fetchJobs = (params) => api.get("/jobs", { params }).then((r) => r.data);
export const fetchJobById = (id) => api.get(`/jobs/${id}`).then((r) => r.data);
export const fetchMyJobs = () => api.get("/jobs/employer/mine").then((r) => r.data);
export const createJob = (payload) => api.post("/jobs", payload).then((r) => r.data);
export const updateJob = (id, payload) => api.patch(`/jobs/${id}`, payload).then((r) => r.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);

export const fetchCategories = () => api.get("/categories").then((r) => r.data);

export const applyToJob = (jobId, payload) =>
  api.post(`/applications/jobs/${jobId}`, payload).then((r) => r.data);
export const fetchMyApplications = () => api.get("/applications/mine").then((r) => r.data);
export const fetchApplicationsForJob = (jobId) =>
  api.get(`/applications/jobs/${jobId}`).then((r) => r.data);
export const updateApplicationStatus = (id, status) =>
  api
    .post(`/applications/${id}/status`, { status })
    .catch(() => api.patch(`/applications/${id}/status`, { status }))
    .then((r) => r.data);
