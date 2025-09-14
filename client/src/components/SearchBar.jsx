import React from "react";

const SearchBar = ({ value, onChange, onClose }) => {
  return (
          <div className="fixed inset-0 bg-transparent bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-0">
            <div className="bg-gradient-to-br from-black via-gray-900 to-black bg-opacity-80 rounded-xl shadow-2xl w-full max-w-lg sm:p-8 p-4 relative border border-yellow-600 mx-2 sm:mx-0">
              <button
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-yellow-600 hover:text-yellow-400 text-xl sm:text-2xl font-bold transition"
          onClick={onClose}
        >
          &times;
        </button>
              <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Search items, products, auctions..."
                className="w-full px-4 sm:px-5 py-2 sm:py-3 bg-black bg-opacity-60 text-yellow-500 border border-yellow-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-base sm:text-lg placeholder-yellow-700 shadow"
                autoFocus
              />
      </div>
    </div>
  );
};

export default SearchBar;
