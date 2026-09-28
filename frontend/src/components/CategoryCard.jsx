import React from "react";
import { Link } from "react-router-dom";
import { Wheat, Milk, Cpu, Factory, Flower2, Trees, Briefcase, Landmark, Leaf, Laptop } from "lucide-react";

const iconMap = {
  wheat: Wheat,
  cow: Milk,
  cpu: Cpu,
  factory: Factory,
  flower: Flower2,
  tree: Trees,
  briefcase: Briefcase,
  landmark: Landmark,
  it: Laptop,
  tech: Laptop,
  software: Laptop,
  computer: Laptop,
};

const formatCategoryName = (name = "") => {
  if (!name) return "";
  const trimmed = name.trim();
  if (trimmed.toLowerCase() === "it") return "Information Technology";
  if (trimmed.toLowerCase() === "agri-it") return "Agri-IT";
  return trimmed;
};

const EXCLUDED_CATEGORIES = ["it", "information technology", "forestry", "forestory", "factory"];

const CategoryCard = ({ category }) => {
  if (!category) return null;
  const normName = (category.name || "").toLowerCase().trim();
  const normSlug = (category.slug || "").toLowerCase().trim();
  if (EXCLUDED_CATEGORIES.includes(normName) || EXCLUDED_CATEGORIES.includes(normSlug)) {
    return null;
  }

  const iconKey = (category.icon || category.slug || category.name || "").toLowerCase().trim();
  const Icon = iconMap[iconKey] || (iconKey === "it" || iconKey.includes("tech") ? Laptop : Leaf);
  const displayName = formatCategoryName(category.name);

  return (
    <Link
      to={`/jobs?category=${category._id}`}
      className="card p-5 flex flex-col items-start gap-3 hover:border-brand-green group transition-all"
    >
      <div className="h-11 w-11 rounded-xl bg-brand-green-light flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon size={22} className="text-brand-green-dark" />
      </div>
      <span className="font-semibold text-sm">{displayName}</span>
    </Link>
  );
};

export default CategoryCard;

