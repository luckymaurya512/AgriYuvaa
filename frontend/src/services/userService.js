import api from "./api.js";

export const fetchSeekerProfile = () => api.get("/users/seeker/me").then((r) => r.data);

export const updateSeekerProfile = (payload) =>
  api.patch("/users/seeker/me", payload).then((r) => r.data);

export const toggleSaveJob = (jobId) =>
  api.post(`/users/seeker/me/toggle-save-job/${jobId}`).then((r) => r.data);

export const saveSeekerResume = (resumeData) =>
  api.post("/users/seeker/me/resume", resumeData).then((r) => r.data);

export const uploadSeekerResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api
    .post("/users/seeker/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const fetchUserProfile = () => api.get("/users/profile").then((r) => r.data);

export const updateUserProfile = (payload) =>
  api.patch("/users/profile", payload).then((r) => r.data);

export const changePassword = (payload) =>
  api.put("/users/change-password", payload).then((r) => r.data);
