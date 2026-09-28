import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

const EXCLUDED_CATEGORY_REGEX = /^(it|information\s*technology|forest(ry|ory)|factory)$/i;

// @route GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  try {
    // Purge removed categories from DB
    await Category.deleteMany({
      $or: [
        { name: { $regex: EXCLUDED_CATEGORY_REGEX } },
        { slug: { $in: ["it", "information-technology", "forestry", "forestory", "factory"] } },
      ],
    });
  } catch (err) {
    // Non-blocking cleanup
  }

  const categories = await Category.find({
    name: { $not: EXCLUDED_CATEGORY_REGEX },
    slug: { $nin: ["it", "information-technology", "forestry", "forestory", "factory"] },
  }).sort("name");
  res.json(categories);
});

// @route POST /api/categories/custom (authenticated employer / admin)
export const createCustomCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const trimmedName = name.trim();
  if (EXCLUDED_CATEGORY_REGEX.test(trimmedName)) {
    res.status(400);
    throw new Error(`The category "${trimmedName}" is not allowed.`);
  }

  let existing = await Category.findOne({ name: { $regex: `^${trimmedName}$`, $options: "i" } });
  if (existing) {
    return res.status(200).json(existing);
  }

  let baseSlug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  if (!baseSlug) baseSlug = "category";
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await Category.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const category = await Category.create({
    name: trimmedName,
    slug: uniqueSlug,
    icon: "Sparkles",
  });

  res.status(201).json(category);
});

// @route POST /api/admin/categories  (admin/superadmin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, icon, parentCategory } = req.body;
  const category = await Category.create({ name, slug, icon, parentCategory: parentCategory || null });
  res.status(201).json(category);
});

// @route PATCH /api/admin/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  Object.assign(category, req.body);
  await category.save();
  res.json(category);
});

// @route DELETE /api/admin/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.json({ message: "Category removed" });
});
