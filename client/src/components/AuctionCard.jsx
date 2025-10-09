import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const currency = (v) => {
  const n = Number(v ?? 0);
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const AuctionCard = ({ auction }) => {
  // Determine end time
  const endTime = auction.end_time || auction.endTime || null;
  const now = new Date();
  const endsAt = endTime ? new Date(endTime) : null;
  const isLive = endsAt ? endsAt > now && (auction.status ? auction.status === 'active' : true) : false;

  // Image source: support array of strings or array of objects ({url})
  const placeholder = 'https://placehold.co/400x400/png?text=Auction+Item';
  let imgSrc = placeholder;
  if (auction.images && auction.images.length > 0) {
    const first = auction.images[0];
    if (typeof first === 'string') imgSrc = first;
    else if (first && typeof first === 'object') imgSrc = first.url || first.src || first.file_url || placeholder;
  }

  // Pricing logic
  const isBid = Number(auction.is_bid) === 1 || auction.auctionType === 'bid';
  const currentBid = auction.current_bid ?? auction.currentBid ?? auction.currentBidAmount ?? 0;
  const startingPrice = auction.starting_price ?? auction.startingPrice ?? 0;
  const reservePrice = auction.reserve_price ?? 0;
  const buyNow = auction.buy_now_price ?? auction.buyNowPrice ?? null;

  const priceDisplay = isBid ? (currentBid || startingPrice) : (buyNow || startingPrice);

  // Extras
  const bidCount = auction.bid_count ?? auction.bidCount ?? 0;
  const condition = auction.condition || auction.item_condition || 'n/a';
  const quantity = auction.quantity ?? 1;
  const shipping = auction.shipping_details || auction.shippingDetails || '';
  const watchers = auction.watchers_count ?? auction.watchersCount ?? 0;
  const views = auction.views_count ?? auction.viewsCount ?? 0;

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-transparent overflow-hidden relative">
      {/* Status Badge */}
      {isLive ? (
        <span className="absolute top-2 left-2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow">LIVE</span>
      ) : (
        <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">{auction.status ? auction.status.toUpperCase() : 'OFFLINE'}</span>
      )}

      <Link to={`/auction/${auction.id}`}>
        <img src={imgSrc} alt={auction.title || 'Auction Item'} className="w-full h-48 object-cover" />
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{auction.title || 'Untitled Auction'}</h3>

        <div className="flex items-center justify-between mb-2 text-sm text-yellow-200">
          <div>
            <div className="text-xs text-gray-300">{isBid ? 'Current Bid' : 'Price'}</div>
            <div className="font-bold text-yellow-400">{currency(priceDisplay)}</div>
          </div>
          <div className="text-right">
            {isBid && (
              <div className="text-xs text-gray-300">Bids: <span className="font-semibold text-white">{bidCount}</span></div>
            )}
            {reservePrice ? (
              <div className={`text-xs mt-1 ${Number(currentBid) < Number(reservePrice) ? 'text-red-400' : 'text-green-300'}`}>
                {Number(currentBid) < Number(reservePrice) ? 'Reserve not met' : 'Reserve met'}
              </div>
            ) : null}
          </div>
        </div>

        {endsAt && (
          <div className="text-sm text-yellow-600 mb-3">
            <CountdownTimer endTime={endsAt} />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
          <div>Condition: <span className="text-white">{condition}</span></div>
          <div>Qty: <span className="text-white">{quantity}</span></div>
        </div>

        {shipping && (
          <div className="text-xs text-gray-300 mb-3 truncate">Shipping: <span className="text-white">{shipping}</span></div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Link to={`/auction/${auction.id}`} className="flex-1 block text-center bg-yellow-600 text-black px-3 py-2 rounded font-semibold hover:bg-yellow-500 transition">View Details</Link>
          <div className="text-right text-xs text-gray-400">
            <div>👁 {views}</div>
            <div>★ {watchers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
