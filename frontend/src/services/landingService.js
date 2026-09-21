import api from "./api.js";

// ─── Public API Calls ─────────────────────────────────────

// Blogs
export const fetchBlogs = async (params = {}) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

export const fetchBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

// Workshops
export const fetchWorkshops = async (params = {}) => {
  const { data } = await api.get("/workshops", { params });
  return data;
};

// Testimonials
export const fetchTestimonials = async () => {
  const { data } = await api.get("/testimonials");
  return data;
};

// ─── Admin API Calls ──────────────────────────────────────

// Blogs Admin
export const fetchAllBlogs = async () => {
  const { data } = await api.get("/blogs/admin/all");
  return data;
};

export const createBlog = async (blogData) => {
  const { data } = await api.post("/blogs", blogData);
  return data;
};

export const updateBlog = async (id, blogData) => {
  const { data } = await api.put(`/blogs/${id}`, blogData);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
};

export const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/blogs/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Workshops Admin
export const fetchAllWorkshops = async () => {
  const { data } = await api.get("/workshops/admin/all");
  return data;
};

export const createWorkshop = async (workshopData) => {
  const { data } = await api.post("/workshops", workshopData);
  return data;
};

export const updateWorkshop = async (id, workshopData) => {
  const { data } = await api.put(`/workshops/${id}`, workshopData);
  return data;
};

export const deleteWorkshop = async (id) => {
  const { data } = await api.delete(`/workshops/${id}`);
  return data;
};

// Testimonials Admin
export const fetchAllTestimonials = async () => {
  const { data } = await api.get("/testimonials/admin/all");
  return data;
};

export const createTestimonial = async (testimonialData) => {
  const { data } = await api.post("/testimonials", testimonialData);
  return data;
};

export const updateTestimonial = async (id, testimonialData) => {
  const { data } = await api.put(`/testimonials/${id}`, testimonialData);
  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};
