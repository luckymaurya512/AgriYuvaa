import api from "./api.js";

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
export const fetchTestimonials = async (params = {}) => {
  const { data } = await api.get("/testimonials", { params });
  return data;
};
