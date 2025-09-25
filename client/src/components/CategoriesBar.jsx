import React, { useState, useRef, useEffect } from "react";
import { useCategory } from "../CategoryContext";
import categoriesData from "../data/categoryAuctions.json";

const CategoriesBar = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const overlayRef = useRef(null);

  const sectionNames = ["All", ...Object.keys(categoriesData)];

  const openOverlay = (index) => {
    setActiveIndex(index);
    setOverlayOpen(true);
    // scroll to top so overlay is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
    setActiveIndex(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        closeOverlay();
      }
    };
    if (overlayOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [overlayOpen]);

  const handleCategoryClick = (cat, idx) => {
    setSelectedCategory(cat);
    if (cat === "All") return;
    openOverlay(idx - 1); // since sectionNames includes All at 0
  };

  const handleSubClick = (sub) => {
    setSelectedCategory(sub);
    const section = document.getElementById("auctions-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    closeOverlay();
  };

  return (
    <div className="bg-black  relative">
      <div className="container mx-auto px-4 flex gap-6 overflow-x-auto py-2">
        {sectionNames.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat, idx)}
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

      {overlayOpen && activeIndex !== null && (() => {
        const keys = Object.keys(categoriesData);
        const key = keys[activeIndex];
        const row = categoriesData[key];
        return (
          <div className="fixed inset-x-0 top-16 z-50 bg-black bg-opacity-96 border-t border-yellow-600 shadow-2xl">
            <div className="container mx-auto px-4" ref={overlayRef}>
              <div className="bg-transparent rounded max-h-[60vh] overflow-y-auto py-6">
                <div className="flex gap-6">
                  <div className="w-1/4 pr-6 border-r border-gray-800">
                    <button onClick={() => { setSelectedCategory(key); closeOverlay(); }} className="text-yellow-200 font-bold text-xl">
                      {key}
                    </button>
                    <p className="text-gray-400 mt-3">Top Categories</p>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {row.top?.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSubClick(sub)}
                          className="text-left p-4 bg-gray-900 rounded hover:bg-yellow-600 hover:text-black transition"
                        >
                          <div className="text-sm font-semibold">{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={closeOverlay} className="px-4 py-2 bg-yellow-600 text-black rounded font-medium">Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CategoriesBar;
