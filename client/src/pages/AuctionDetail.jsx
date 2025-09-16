import { useParams } from "react-router-dom";
import { heroAuctions as auctions } from "../data/heroAuctions";
import CountdownTimer from "../components/CountdownTimer";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(auctions);
  const [selectedImage, setSelectedImage] = useState('');
  const [bidAmount, setBidAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [currentBid, setCurrentBid] = useState(auction.current_bid);
  const [bidHistory, setBidHistory] = useState([]);
  // const auction = auctions.find((a) => a.id === parseInt(id));
  const { user } = useAuthContext();
  
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auction/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        setAuction(data.data || data);
      } catch (error) {
        console.error("Error fetching auction:", error);
      }
    };

    const fetchAuctionBids = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auction/${id}/bids`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setBidHistory(data.data || []);
      } catch (error) {
        console.error("Error fetching auction bids:", error);
      }
    };

    fetchAuction();
    fetchAuctionBids();
  }, [id]);

  if (!auction) {
    return <p className="text-center mt-10 text-white">Auction not found.</p>;
  }

  // Always return images array
  const auctionImages = auction.images && auction.images.length > 0 ? auction.images : [auction.image];
  useEffect(() => {
    if (auctionImages.length > 0) {
      setSelectedImage(auctionImages[0]);
    }
  }, [auctionImages]);

  const toggleWishlist = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/${isSaved ? 'remove/' + id : 'add/' + id}`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Place bid logic
  const handlePlaceBid = async () => {
    const bidValue = parseFloat(bidAmount);
    if (!bidValue || bidValue <= currentBid || bidValue < auction.starting_price) {
      alert("Bid must be greater than current bid or starting price!");
      return;
    }
    if (!user) {
      alert("You must be logged in to place a bid.");
      return;
    }
    // Add bid to history
    // const newBid = {
    //   user: user.name,
    //   amount: bidValue,
    //   time: new Date().toLocaleString(),
    // };
    // setBidHistory(prev => [newBid, ...prev]);
    setCurrentBid(bidValue);
    setBidAmount("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auction/${id}/bid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: bidValue })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };
  
  return (
    <div className="container my-15 mx-auto px-4 py-8 text-white">
      {/* Auction Title */}
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">{auction.title}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* IMAGE GALLERY SECTION */}
        <div className="flex gap-4">
          {/* Thumbnails (only if multiple images) */}
          {auctionImages.length >= 1 && (
            <div className="flex flex-col gap-2">
              {auctionImages.map((img, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_URL}` + img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover cursor-pointer border rounded ${
                    selectedImage === img
                      ? "border-yellow-500"
                      : "border-gray-700 hover:border-yellow-500"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 border rounded overflow-hidden group">
            <img
              src={`${import.meta.env.VITE_API_URL}` + selectedImage}
              alt={auction.title}
              className="w-full h-96 object-contain transform transition-transform duration-300 group-hover:scale-110 bg-black"
            />

            {/* Save Button */}
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 px-3 py-1 border rounded text-sm font-medium bg-yellow-600 text-black hover:bg-yellow-500"
            >
              {isSaved ? "♥ Saved" : "♡ Save"}
            </button>

            {/* Share Button */}
            <button
              className="absolute bottom-2 right-2 p-2 border rounded bg-gray-800 text-yellow-200 hover:bg-gray-700"
              aria-label="Share"
              onClick={() => alert("Share functionality coming soon")}
            >
              ↗
            </button>
          </div>
        </div>

        {/* AUCTION INFO SECTION */}
        <div className="border rounded-lg p-5 shadow bg-gradient-to-br from-gray-900 to-black border-yellow-700">
          {/* Estimate and End Time */}
          {auction.starting_price && (
            <p className="text-yellow-200 mb-1">
              Starting Price: ${auction.starting_price}
            </p>
          )}
          {auction.end_time && (
            <p className="text-sm text-yellow-200 mb-3">
              Ends on {auction.end_time.toLocaleString()}
            </p>
          )}

          {/* Current Price & Bids */}
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-yellow-400">
              ${auction.current_bid}
            </p>
            <span className="text-yellow-200 text-sm">
              ({auction.bid_count} bids)
            </span>
          </div>

          {/* Countdown Timer */}
          {auction.end_time && (
            <div className="text-sm mb-3 text-yellow-200">
              <CountdownTimer endTime={auction.end_time} />
            </div>
          )}

          {/* Max Bid Input */}
          <label className="block text-sm font-medium text-yellow-200 mb-1">
            Set Your Max Bid
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`$${auction.current_bid} or more`}
            className="border border-yellow-700 rounded px-3 py-2 w-full mb-4 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />

          {/* Place Bid Button */}
          <button
            onClick={handlePlaceBid}
            className="w-full bg-yellow-600 text-black py-2 rounded hover:bg-yellow-500 transition font-semibold"
          >
            Place Bid
          </button>

          {/* Watchers Info */}
          {auction.watchers_count && (
            <p className="text-sm text-yellow-200 mt-3">
              {auction.watchers_count} bidders are watching this item
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2 text-yellow-300">Description</h2>
        <p className="text-yellow-200">{auction.description}</p>
      </div>

      {/* Bid History */}
      {bidHistory.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">Bid History</h2>
          <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black border-yellow-700">
            <table className="w-full text-left text-yellow-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 border-b">User</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {bidHistory.map((bid, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="p-3 border-b">{bid.bidder['name']}</td>
                    <td className="p-3 border-b">${bid.amount}</td>
                    <td className="p-3 border-b">{new Date(bid.created_at).toLocaleDateString()}</td>
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
