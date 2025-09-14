import React from "react";
import { useCategory } from "../CategoryContext";

const categories = [
  "All",
  "Cars",
  "Phones",
  "Computers",
  "Electronics",
  "Antiques",
  "Watches",
  "Jewelry",
  "Collectibles"
];

const CategoriesBar = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    const section = document.getElementById("auctions-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
  <div className="bg-black border-b border-gray-400">
      <div className="container mx-auto px-4 flex gap-6 overflow-x-auto py-2">
        {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`pb-1 border-b-2 text-sm font-medium transition-colors duration-200
                ${selectedCategory === cat
                  ? "border-yellow-600 text-yellow-600"
                  : "border-transparent text-white hover:text-yellow-600 hover:border-yellow-600"}
              `}
            >
              {cat}
            </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBar;
