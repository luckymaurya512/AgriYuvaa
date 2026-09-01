import api from "./api.js";

export const fetchSeekerProfile = () => api.get("/users/seeker/me").then((r) => r.data);

export const updateSeekerProfile = (payload) =>
  api.patch("/users/seeker/me", payload).then((r) => r.data);

export const toggleSaveJob = (jobId) =>
  api.post(`/users/seeker/me/toggle-save-job/${jobId}`).then((r) => r.data);
