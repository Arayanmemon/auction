import { useState } from "react";
import { heroAuctions } from "../data/heroAuctions"; // use heroAuctions data
import AuctionCard from "../components/AuctionCard";

// Categories (could also be dynamic later)
const categories = ["All", "Cars", "Phones", "Computers", "Collectibles", "Electronics"];

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

  // Combined Filtering Logic
  const filteredAuctions = heroAuctions
    .filter((auction) => {
      // Status filter
      if (filter === "upcoming") return new Date(auction.endTime) > new Date();
      if (filter === "past") return new Date(auction.endTime) < new Date();
      return true;
    })
    .filter((auction) => {
      // Category filter
      if (selectedCategory !== "All") {
        return auction.category === selectedCategory;
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
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar: Category Filter */}
      <aside className="w-full md:w-1/4 bg-gray-50 border rounded-lg p-4 h-fit">
  <h2 className="text-lg font-bold mb-3">Browse by Categories</h2>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="accent-[rgb(0,78,102)]"
              />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main Auctions Content */}
      <div className="flex-1">
        {/* Header + Search */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold">{selectedCategory} Auctions</h1>

          <input
            type="text"
            placeholder="Search auctions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-3 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-[rgb(0,78,102)] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "upcoming"
                ? "bg-[rgb(0,78,102)] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setFilter("upcoming");
              setCurrentPage(1);
            }}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "past"
                ? "bg-[rgb(0,78,102)] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setFilter("past");
              setCurrentPage(1);
            }}
          >
            Past
          </button>
        </div>

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
                ? "bg-gray-200 text-gray-400"
                : "bg-[rgb(0,78,102)] text-white hover:bg-[rgb(0,90,115)]"
            }`}
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-400"
                : "bg-[rgb(0,78,102)] text-white hover:bg-[rgb(0,90,115)]"
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
