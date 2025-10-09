import { Link } from "react-router-dom";

const currency = (v) => {
  const n = Number(v ?? 0);
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ItemCard = ({ item }) => {
  const placeholder = 'https://placehold.co/400x400/png?text=Item';
  let imgSrc = placeholder;
  if (item.images && item.images.length > 0) {
    const first = item.images[0];
    if (typeof first === 'string') imgSrc = first;
    else if (first && typeof first === 'object') imgSrc = first.url || first.src || first.file_url || placeholder;
  }

  const buyNow = item.buy_now_price ?? item.buyNowPrice ?? null;
  const starting = item.starting_price ?? item.startingPrice ?? null;
  const price = buyNow ?? starting ?? 0;
  const condition = item.condition || 'n/a';
  const quantity = item.quantity ?? 1;
  const shipping = item.shipping_details || item.shippingDetails || '';

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-transparent overflow-hidden relative">
      {buyNow && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-yellow-600 text-black font-bold px-3 py-1 rounded text-xs shadow">BUY NOW</span>
        </div>
      )}

      <Link to={`/auction/${item.id}`}>
        <img src={imgSrc} alt={item.title || 'Item'} className="w-full h-48 object-cover" />
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{item.title || 'Untitled'}</h3>

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-yellow-400 font-bold">{currency(price)}</div>
          <div className="text-xs text-gray-300">Qty: <span className="text-white">{quantity}</span></div>
        </div>

        {shipping && <div className="text-xs text-gray-300 mb-2 truncate">Shipping: <span className="text-white">{shipping}</span></div>}

        <div className="text-xs text-gray-300 mb-3">Condition: <span className="text-white">{condition}</span></div>

        <Link to={`/auction/${item.id}`} className="block text-center bg-yellow-600 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition">{buyNow ? 'Buy Now' : 'View'}</Link>
      </div>
    </div>
  );
};

export default ItemCard;
