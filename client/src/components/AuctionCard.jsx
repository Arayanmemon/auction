import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const AuctionCard = ({ auction }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-white overflow-hidden">
      {/* Auction Image */}
      <Link to={`/auction/${auction.id}`}>
        <img
          src={auction.images ? `https://vertex111.com/admin/public${auction.images[0]}` : 'https://placehold.co/400x400/png?text=Auction+Item'} // First image as thumbnail
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Auction Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {auction.title}
        </h3>

        {/* Current Bid */}
        <p className="text-gray-600 text-sm mb-2">
          Current Bid:{" "}
          <span className="font-bold text-[rgb(0,78,102)]">
            ${auction.current_bid}
          </span>
        </p>

        {/* Countdown Timer */}
        {auction.end_time && (
          <div className="text-sm text-gray-500 mb-3">
            <CountdownTimer endTime={auction.end_time} />
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/auction/${auction.id}`}
          className="block text-center bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
