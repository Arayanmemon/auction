import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SessionItems = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("itemNumber");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(36);

  useEffect(() => {
    const stored = localStorage.getItem(`session-${sessionId}`);
    if (stored) {
      setSession(JSON.parse(stored));
    }
  }, [sessionId]);

  if (!session) return <p className="text-center mt-10">Session not found</p>;

  // Sort items
  const sortedItems = [...session.items].sort((a, b) => {
    if (sortBy === "itemNumber") return a.id - b.id;
    if (sortBy === "price") return a.startingBid - b.startingBid;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / limit);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{session.title}</h1>
          <p className="text-gray-600">
            {session.date} {session.time} • {session.location}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {session.items.length} Items
          </p>
        </div>
        <button
          onClick={() => navigate(`/add-items/${sessionId}`)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add More Items
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between bg-gray-100 p-3 rounded mb-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded ${
              viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded ${
              viewMode === "list" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            List
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="itemNumber">Item Number</option>
          <option value="price">Price (Low to High)</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            &lt;
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="36">36</option>
        </select>
      </div>

      {/* Items Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded p-2 hover:shadow"
            >
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.title}
                className="w-full h-32 object-cover mb-2"
              />
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs">Starting Bid: ${item.startingBid}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded p-3 flex items-center gap-4 hover:shadow"
            >
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-500 text-sm">
                  Starting Bid: ${item.startingBid}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionItems;
