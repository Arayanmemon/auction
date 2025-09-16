import { useState } from "react";
import AuctionCard from "../components/AuctionCard";
import categoryAuctionsJson from "../data/categoryAuctions.json";
const categoryAuctions = categoryAuctionsJson;
const categories = ["All", ...Object.keys(categoryAuctions)];

const AuctionList = () => {
  // States
  const [filter, setFilter] = useState("all"); // all | upcoming | past
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Category handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Filtering logic
  const filteredAuctions = Object.values(categoryAuctions)
    .flat()
    .filter((auction) => {
      if (selectedCategory !== "All") {
        return categoryAuctions[selectedCategory]?.some(a => a.id === auction.id);
      }
      return true;
    })
    .filter((auction) =>
      auction.title.toLowerCase().includes(search.toLowerCase())
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto my-15 px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar: Category Filter */}
      <aside className="w-full md:w-1/4 bg-black border border-gray-800 rounded-lg p-4 h-fit">
        <h2 className="text-lg font-bold mb-3 text-yellow-600">Browse by Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="accent-yellow-600"
              />
              <span className="text-white">{cat}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main Auctions Content */}
      <div className="flex-1">
        {/* Header + Search */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">{selectedCategory} Auctions</h1>

          <input
            type="text"
            placeholder="Search auctions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-700 rounded px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-black text-white"
          />
        </div>

  {/* Remove status filters for category-based auctions */}

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedAuctions.length > 0 ? (
            paginatedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No auctions found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-800 text-gray-400"
                : "bg-yellow-600 text-black hover:bg-yellow-500"
            }`}
          >
            Prev
          </button>
          <span className="px-4 py-2 text-white">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-800 text-gray-400"
                : "bg-yellow-600 text-black hover:bg-yellow-500"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
