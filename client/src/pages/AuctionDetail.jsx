import { useParams } from "react-router-dom";
import { heroAuctions as auctions } from "../data/heroAuctions";
import CountdownTimer from "../components/CountdownTimer";
import { useState } from "react";
import { useAuth } from "../AuthContext";

const AuctionDetail = () => {
  const { id } = useParams();
  const auction = auctions.find((a) => a.id === parseInt(id));
  const { user } = useAuth();

  if (!auction) {
    return <p className="text-center mt-10">Auction not found.</p>;
  }

  // Always return images array
  const auctionImages =
    auction.images && auction.images.length > 0 ? auction.images : [auction.image];

  const [selectedImage, setSelectedImage] = useState(auctionImages[0]);
  const [bidAmount, setBidAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [bidHistory, setBidHistory] = useState(auction.bidHistory || []);

  const toggleWishlist = () => setIsSaved((prev) => !prev);

  // Place bid logic
  const handlePlaceBid = () => {
    const bidValue = parseFloat(bidAmount);
    if (!bidValue || bidValue <= currentBid) {
      alert("Bid must be greater than current bid!");
      return;
    }
    if (!user) {
      alert("You must be logged in to place a bid.");
      return;
    }
    // Add bid to history
    const newBid = {
      user: user.firstName + " " + user.lastName,
      amount: bidValue,
      time: new Date().toLocaleString(),
    };
    setBidHistory(prev => [newBid, ...prev]);
    setCurrentBid(bidValue);
    setBidAmount("");
    alert(`Bid placed: $${bidValue}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Auction Title */}
      <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* IMAGE GALLERY SECTION */}
        <div className="flex gap-4">
          {/* Thumbnails (only if multiple images) */}
          {auctionImages.length >= 1 && (
            <div className="flex flex-col gap-2">
              {auctionImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover cursor-pointer border rounded ${
                    selectedImage === img
                      ? "border-[rgb(35,96,114)]"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 border rounded overflow-hidden group">
            <img
              src={selectedImage}
              alt={auction.title}
              className="w-full h-96 object-contain transform transition-transform duration-300 group-hover:scale-110"
            />

            {/* Save Button */}
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 px-3 py-1 border rounded text-sm font-medium bg-white hover:bg-gray-100"
            >
              {isSaved ? "♥ Saved" : "♡ Save"}
            </button>

            {/* Share Button */}
            <button
              className="absolute bottom-2 right-2 p-2 border rounded bg-white hover:bg-gray-100"
              aria-label="Share"
              onClick={() => alert("Share functionality coming soon")}
            >
              ↗
            </button>
          </div>
        </div>

        {/* AUCTION INFO SECTION */}
        <div className="border rounded-lg p-5 shadow">
          {/* Estimate and End Time */}
          {auction.estimateRange && (
            <p className="text-gray-500 mb-1">
              Estimate: {auction.estimateRange}
            </p>
          )}
          {auction.endTime && (
            <p className="text-sm text-gray-500 mb-3">
              Ends on {auction.endTime.toLocaleString()}
            </p>
          )}

          {/* Current Price & Bids */}
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-[rgb(0,78,102)]">
              ${currentBid}
            </p>
            <span className="text-gray-500 text-sm">
              ({bidHistory.length} bids)
            </span>
          </div>

          {/* Countdown Timer */}
          {auction.endTime && (
            <div className="text-sm mb-3">
              <CountdownTimer endTime={auction.endTime} />
            </div>
          )}

          {/* Max Bid Input */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Set Your Max Bid
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`$${currentBid + 25}`}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          />

          {/* Place Bid Button */}
          <button
            onClick={handlePlaceBid}
            className="w-full bg-[rgb(0,78,102)] text-white py-2 rounded hover:bg-[rgb(0,90,115)] transition font-semibold"
          >
            Place Bid
          </button>

          {/* Watchers Info */}
          {auction.watchersCount && (
            <p className="text-sm text-gray-500 mt-3">
              {auction.watchersCount} bidders are watching this item
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Description</h2>
        <p className="text-gray-600">{auction.description}</p>
      </div>

      {/* Bid History */}
      {bidHistory.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Bid History</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">User</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {bidHistory.map((bid, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{bid.user}</td>
                    <td className="p-3 border-b">${bid.amount}</td>
                    <td className="p-3 border-b">{bid.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
