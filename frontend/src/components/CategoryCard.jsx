import React from "react";
import { Link } from "react-router-dom";
import { Wheat, Milk, Cpu, Factory, Flower2, Trees, Briefcase, Landmark, Leaf } from "lucide-react";

const iconMap = {
  wheat: Wheat,
  cow: Milk,
  cpu: Cpu,
  factory: Factory,
  flower: Flower2,
  tree: Trees,
  briefcase: Briefcase,
  landmark: Landmark,
};

const CategoryCard = ({ category }) => {
  const Icon = iconMap[category.icon] || Leaf;
  return (
    <Link
      to={`/jobs?category=${category._id}`}
      className="card p-5 flex flex-col items-start gap-3 hover:border-brand-green"
    >
      <div className="h-11 w-11 rounded-xl bg-brand-green-light flex items-center justify-center">
        <Icon size={22} className="text-brand-green-dark" />
      </div>
      <span className="font-semibold text-sm">{category.name}</span>
    </Link>
  );
};

export default CategoryCard;
