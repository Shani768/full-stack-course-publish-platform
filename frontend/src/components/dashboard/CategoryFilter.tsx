// components/dashboard/CategoryFilter.tsx
import React from "react";
import {
  FaBook,
  FaLaptopCode,
  FaCog,
  FaFilm,
  FaRunning,
  FaMusic,
  FaCamera,
} from "react-icons/fa";

const categories = [
  { name: "Accounting", icon: <FaBook className="text-[#f59e0b]" /> },
  { name: "Computer Science", icon: <FaLaptopCode className="text-[#3b82f6]" /> },
  { name: "Engineering", icon: <FaCog className="text-[#f97316]" /> },
  { name: "Filming", icon: <FaFilm className="text-[#6366f1]" /> },
  { name: "Fitness", icon: <FaRunning className="text-[#10b981]" /> },
  { name: "Music", icon: <FaMusic className="text-[#ec4899]" /> },
  { name: "web development", icon: <FaCamera className="text-[#8b5cf6]" /> },
];

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 px-4 py-4">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() =>
              onSelectCategory(isSelected ? null : cat.name)
            }
            className={`flex items-center gap-2 border rounded-full px-4 py-2 shadow-sm transition ${
              isSelected
                ? "bg-blue-100 border-blue-400"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat.icon}
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
