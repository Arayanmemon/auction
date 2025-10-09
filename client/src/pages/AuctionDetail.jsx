import { useParams } from "react-router-dom";
import { heroAuctions as auctions } from "../data/heroAuctions";
import CountdownTimer from "../components/CountdownTimer";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(auctions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  // hover magnifier & pan state
  const mainImgRef = useRef(null);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const ZOOM_SCALE = 2.5;
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const movedRef = useRef(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomedMain, setIsZoomedMain] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [currentBid, setCurrentBid] = useState(auction.current_bid);
  const [bidHistory, setBidHistory] = useState([]);
  const { user } = useAuthContext();

  const currency = (v) => {
    const n = Number(v ?? 0);
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
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

  // Build media items: images first, then optional video
  const mediaItems = [];
  if (auction.images && auction.images.length > 0) {
    auction.images.forEach((img) => {
      if (typeof img === 'string') mediaItems.push({ type: 'image', src: img });
      else if (img && typeof img === 'object') mediaItems.push({ type: 'image', src: img.url || img.src || img.file_url || '' });
    });
  } else if (auction.image) {
    mediaItems.push({ type: 'image', src: auction.image });
  }
  if (auction.video) {
    mediaItems.push({ type: 'video', src: auction.video });
  }

  const isBid = Number(auction.is_bid) === 1 || auction.auctionType === 'bid';

  useEffect(() => {
    if (mediaItems.length > 0) setSelectedIndex(0);
  }, [mediaItems.length]);

  // Pan handlers for drag-to-pan when zoomed
  const startPan = (clientX, clientY) => {
    panRef.current = { active: true, startX: clientX, startY: clientY, originX: pan.x, originY: pan.y };
    movedRef.current = false;
    window.addEventListener('mousemove', handlePanMove);
    window.addEventListener('mouseup', endPan);
    window.addEventListener('touchmove', handlePanMove, { passive: false });
    window.addEventListener('touchend', endPan);
  };

  const handlePanMove = (e) => {
    if (!panRef.current.active) return;
    if (e.touches && e.touches.length) e.preventDefault();
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
    const dx = clientX - panRef.current.startX;
    const dy = clientY - panRef.current.startY;
    const newX = panRef.current.originX + dx;
    const newY = panRef.current.originY + dy;
    setPan({ x: newX, y: newY });
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedRef.current = true;
  };

  const endPan = () => {
    panRef.current.active = false;
    window.removeEventListener('mousemove', handlePanMove);
    window.removeEventListener('mouseup', endPan);
    window.removeEventListener('touchmove', handlePanMove);
    window.removeEventListener('touchend', endPan);
  };

  // Keyboard handlers: ESC to close lightbox, arrows to navigate
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
        setIsZoomedMain(false);
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          const prev = (selectedIndex - 1 + mediaItems.length) % mediaItems.length;
          setSelectedIndex(prev);
        }
        if (e.key === 'ArrowRight') {
          const next = (selectedIndex + 1) % mediaItems.length;
          setSelectedIndex(next);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLightboxOpen, selectedIndex, mediaItems.length]);

  // Add to cart (client-side demo): stores a simple cart in localStorage
  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = {
        id: auction.id,
        title: auction.title,
        qty: Number(selectedQty) || 1,
        price: auction.buy_now_price || auction.current_bid || auction.starting_price || 0,
      };
      // If item exists, increase qty
      const existing = cart.find(c => String(c.id) === String(item.id));
      if (existing) {
        existing.qty = Math.min((existing.qty || 0) + item.qty, auction.quantity || 9999);
      } else {
        cart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart');
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Failed to add to cart');
    }
  };

  // Helper: format end date and relative days
  const formatEndInfo = (endTime) => {
    if (!endTime) return null;
    const end = new Date(endTime);
    if (Number.isNaN(end.getTime())) return null;
    const formatted = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / msPerDay);
    let relative = '';
    if (diffDays > 1) relative = `(in ${diffDays} days)`;
    else if (diffDays === 1) relative = `(in 1 day)`;
    else if (diffDays === 0) relative = `(today)`;
    else relative = `(${Math.abs(diffDays)} days ago)`;
    return `${formatted} ${relative}`;
  };

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
  
  // Keyboard handlers: ESC to close lightbox, arrows to navigate
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
        setIsZoomedMain(false);
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          const prev = (selectedIndex - 1 + mediaItems.length) % mediaItems.length;
          setSelectedIndex(prev);
        }
        if (e.key === 'ArrowRight') {
          const next = (selectedIndex + 1) % mediaItems.length;
          setSelectedIndex(next);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLightboxOpen, selectedIndex, mediaItems.length]);

  return (
    <div className="container my-15 mx-auto px-4 py-8 text-white">
      {/* Auction Title */}
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">{auction.title}</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* IMAGE GALLERY SECTION */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          {mediaItems.length >= 1 && (
            <div className="flex flex-col gap-2">
              {mediaItems.map((item, index) => (
                <button key={index} onClick={() => setSelectedIndex(index)} className={`p-1 rounded ${selectedIndex === index ? 'ring-2 ring-yellow-500' : ''}`}>
                  {item.type === 'image' ? (
                    <img src={item.src || ''} alt={`Thumbnail ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-white">▶</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 border rounded overflow-hidden bg-black flex items-center justify-center h-64 sm:h-96 md:h-[520px] lg:h-[640px]">
            {/* Prev button */}
            <button
              onClick={() => {
                if (!mediaItems.length) return;
                const prev = (selectedIndex - 1 + mediaItems.length) % mediaItems.length;
                setSelectedIndex(prev);
              }}
              className="absolute left-3 z-20 bg-white bg-opacity-10 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-20"
              aria-label="Previous media"
            >
              ‹
            </button>

            {/* Main media */}
            {mediaItems[selectedIndex] ? (
              mediaItems[selectedIndex].type === 'image' ? (
                <img
                  src={mediaItems[selectedIndex].src}
                  alt={auction.title}
                  className={`w-full h-full object-contain transition-transform duration-300 ${isZoomedMain ? 'scale-125' : 'scale-100'}`}
                  style={{ cursor: isZoomedMain ? 'zoom-out' : 'zoom-in' }}
                  onClick={() => { setIsZoomedMain((z) => !z); }}
                  onDoubleClick={() => { setIsLightboxOpen(true); setIsZoomed(false); }}
                />
              ) : (
                <video controls className="w-full h-full cursor-pointer" src={mediaItems[selectedIndex].src} onDoubleClick={() => { setIsLightboxOpen(true); setIsZoomed(false); }} />
              )
            ) : (
              <img src={'https://placehold.co/800x600/png?text=No+Image'} alt="No media" className="w-full h-full object-contain" />
            )}

            {/* Next button */}
            <button
              onClick={() => {
                if (!mediaItems.length) return;
                const next = (selectedIndex + 1) % mediaItems.length;
                setSelectedIndex(next);
              }}
              className="absolute right-3 z-20 bg-white bg-opacity-10 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-20"
              aria-label="Next media"
            >
              ›
            </button>

            {/* Save & Share Buttons (kept) */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={toggleWishlist}
                className="px-3 py-1 border rounded text-sm font-medium bg-yellow-600 text-black hover:bg-yellow-500"
              >
                {isSaved ? "♥ Saved" : "♡ Save"}
              </button>
              <button
                className="p-2 border rounded bg-gray-800 text-yellow-200 hover:bg-gray-700"
                aria-label="Share"
                onClick={() => alert("Share functionality coming soon")}
              >
                ↗
              </button>
            </div>
          </div>


        </div>

        {/* Lightbox / Modal for zooming media */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={() => { setIsLightboxOpen(false); setIsZoomed(false); }}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              {/* Close & Zoom Controls */}
              <button
                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); setIsZoomed(false); }}
                className="absolute top-2 right-2 z-50 bg-black bg-opacity-60 text-yellow-300 px-3 py-1 rounded border border-yellow-700"
                aria-label="Close"
              >
                ✕
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsZoomed((z) => !z); }}
                className="absolute top-2 right-14 z-50 bg-black bg-opacity-60 text-yellow-300 px-3 py-1 rounded border border-yellow-700"
                aria-label="Toggle zoom"
              >
                {isZoomed ? 'Zoom Out' : 'Zoom In'}
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-full h-full"
              >
                {mediaItems[selectedIndex] && mediaItems[selectedIndex].type === 'image' ? (
                  <img
                    src={mediaItems[selectedIndex].src}
                    alt={auction.title}
                    className={`transition-transform duration-200 ${isZoomed ? 'scale-125' : 'scale-100'} max-h-[90vh] object-contain`}
                    style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                    onClick={() => setIsZoomed((z) => !z)}
                  />
                ) : mediaItems[selectedIndex] ? (
                  <video controls className={`transition-transform duration-200 ${isZoomed ? 'scale-125' : 'scale-100'} max-h-[90vh]`} src={mediaItems[selectedIndex].src} />
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* AUCTION INFO SECTION */}

        <div className="border rounded-lg p-5 shadow bg-gradient-to-br from-gray-900 to-black border-yellow-700">
          {/* Estimate and End Time */}
          {/* Price summary and controls (different for auctions vs buy-now items) */}
          {isBid ? (
            <>
              <div className="mb-2">
                <div className="text-sm text-yellow-200 mb-1">Current Bid</div>
                <div className="text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-tight mb-1">
                  {currency(auction.current_bid ?? auction.starting_price ?? 0)}
                </div>
                <div className="text-sm text-yellow-200">{auction.end_time && <>Ends on {formatEndInfo(auction.end_time)}</>}</div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-yellow-200 text-sm">{(auction.bid_count ?? 0)} bids</div>
                {auction.end_time && (
                  <div className="text-sm text-yellow-200">
                    <CountdownTimer endTime={auction.end_time} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <div className="text-sm text-yellow-200 mb-1">Price</div>
                <div className="text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-tight mb-1">
                  {currency(auction.buy_now_price ?? auction.starting_price ?? 0)}
                </div>
              </div>
              <div className="mb-3 text-sm text-yellow-200">
                <div>Available Quantity: <span className="text-yellow-300 font-medium">{auction.quantity ?? 1}</span></div>
                <div className="mt-1">{auction.shipping_details ? <span>Shipping: <span className="text-white">{auction.shipping_details}</span></span> : null}</div>
              </div>
            </>
          )}
          {/* Product meta: condition, quantity, shipping, returns, payments, delivery */}
          <div className="mt-4 mb-4 text-yellow-200">


            {/* Short description preview (also show Description here) */}
            <p className="text-sm mt-2">Description: <span className="text-yellow-300">{auction.description ? (auction.description.length > 140 ? auction.description.slice(0,140) + '...' : auction.description) : 'No description provided'}</span></p>
            {/* Read more toggle */}
            {auction.description && auction.description.length > 140 && (
              <button
                onClick={() => setShowFullDesc(s => !s)}
                className="mt-2 inline-block text-sm text-yellow-300 underline hover:text-yellow-200"
                aria-expanded={showFullDesc}
              >
                {showFullDesc ? 'Hide' : 'Read more'}
              </button>
            )}
             {showFullDesc && (
              <div className="mt-4 p-4 bg-gradient-to-br from-gray-900 to-black border border-yellow-700 rounded">
                <h3 className="text-yellow-300 font-semibold mb-2">Full Description</h3>
                <p className="text-yellow-200 leading-relaxed">{auction.description}</p>
              </div>
            )}
            {/* Demo fallbacks when seller didn't provide values */}
            <p className="text-sm mt-3">Condition: <span className="text-yellow-300 font-medium">{auction.condition || 'Not specified (demo)'}</span></p>
            <p className="text-sm">Shipping details: <span className="text-yellow-300 font-medium">{auction.shipping_details || 'Ships in 3-5 business days (demo)'}</span></p>
            <p className="text-sm">Shipping locations: <span className="text-yellow-300">{Array.isArray(auction.shipping_locations) ? auction.shipping_locations.join(', ') : (auction.shipping_locations || 'Worldwide')}</span></p>
            <p className="text-sm">Shipping cost: <span className="text-yellow-300">{auction.shipping_method === 'flat' ? (auction.shipping_cost ? currency(auction.shipping_cost) : 'Flat rate') : (auction.shipping_method === 'free' ? 'Free' : 'Calculated at checkout')}</span></p>
            <p className="text-sm">Return policy: <span className="text-yellow-300">{auction.return_policy || 'No returns accepted (demo) — contact seller'}</span></p>
            <p className="text-sm">Payments: {' '}
              {(() => {
                const raw = auction.payment_methods || '';
                const methods = Array.isArray(raw) ? raw : String(raw).split(',').map(m => m.trim()).filter(Boolean);
                const final = methods.length ? methods : ['Credit Card','PayPal'];
                return (
                  <span className="inline-flex gap-2">
                    {final.includes('Credit Card') || final.find(m => /credit|card/i.test(m)) ? (
                      <span className="px-2 py-0.5 bg-gray-800 text-yellow-200 rounded inline-flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <rect x="3.5" y="8" width="6" height="2" rx="0.5" fill="currentColor" />
                        </svg>
                        <span className="hidden sm:inline">Credit Card</span>
                      </span>
                    ) : null}
                    {final.find(m => /paypal/i.test(m)) ? (
                      <span className="px-2 py-0.5 bg-gray-800 text-yellow-200 rounded inline-flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M4 7h9.5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 17h6.5a3.5 3.5 0 0 0 0-7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="hidden sm:inline">PayPal</span>
                      </span>
                    ) : null}
                    {final.filter(m => !/paypal|credit|card/i.test(m)).map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-800 text-yellow-200 rounded">{m}</span>
                    ))}
                  </span>
                );
              })()
            }</p>
            {/* Inline expanded full description panel */}
           
          </div>
          

          {/* Conditional rendering based on auction type */}
          {auction.is_bid ? (
            <>
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
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="block text-sm text-yellow-200 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={auction.quantity }
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Math.max(1, Math.min(Number(e.target.value || 1), auction.quantity || 1)))}
                  className="w-32 border border-yellow-700 rounded px-2 py-1 bg-black bg-opacity-60 text-yellow-200"
                />    <span> <p className="text-base">Available Quantity: <span className="text-yellow-300 font-medium">{auction.quantity || 1}</span></p></span>
              </div>  
              <button
                className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-500 transition font-semibold"
                onClick={() => alert(`Buy functionality coming soon - qty: ${selectedQty}`)}
              >
                Buy Now
              </button>
              {/* Add to cart button inserted directly after Buy Now */}
              <button
                className="w-full mt-2 bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 transition font-semibold"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </>
          )}

          {/* Watchers Info */}
          {auction.watchers_count && (
            <p className="text-sm text-yellow-200 mt-3">
              {auction.watchers_count} bidders are watching this item
            </p>
          )}

         
        </div>
           
    <div>

      {/* these will be displayed as tabs  */}
      {/* also display here aution/items details complete details with cateforgy with all details  */}
      {/* <h1>add here  seller  info and contact with seller to seller profile
       also add rating and order completed and successfull orders and total orders
       and total reviews and total ratings
       and total products listed by seller
       and seller location
       and member since date
       and seller other products link to seller profile page
       and seller profile link to click to view full profile of seller  

      
      </h1> */}
    </div>
      </div>

      {/* Full description is now available via the "Read more" panel in the Auction Info section */}

      {/* Bid History */}
      {auction.auction_type === 'bid' && bidHistory.length > 0 && (
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
