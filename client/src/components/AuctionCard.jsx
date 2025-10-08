import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const AuctionCard = ({ auction }) => {
  const endTime = auction.end_time || auction.endTime || Date.now() + 86400000;
  const isLive = new Date(endTime) > new Date();
  // Fix: Define imgSrc before using
  let imgSrc = 'https://placehold.co/400x400/png?text=Auction+Item';
  if (auction.images && auction.images[0]) {
    imgSrc = auction.images[0];
  }
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-transparent overflow-hidden relative">
      {/* Live Tag */}
      {isLive && (
        <span className="absolute top-2 left-2 bg-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">LIVE</span>
      )}
      {/* Auction Image */}
      <Link to={`/auction/${auction.id}`}>
        <img
          src={imgSrc}
          alt={auction.title || 'Auction Item'}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Auction Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 truncate">
          {auction.title || 'Untitled Auction'}
        </h3>

        {/* Current Bid */}
        <p className="text-white text-sm mb-2">
          Current Bid: {" "}
          <span className="font-bold text-yellow-500">
            ${auction.current_bid || 0}
          </span>
        </p>

        {/* Countdown Timer */}
        <div className="text-sm text-yellow-600 mb-3">
          <CountdownTimer endTime={endTime} />
        </div>

        {/* View Details Button */}
        <Link
          to={`/auction/${auction.id}`}
          className="block text-center bg-yellow-600 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
