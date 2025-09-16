import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-transparent overflow-hidden">
      {/* Buy Now Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-yellow-600 text-black font-bold px-4 py-1 rounded-lg text-xs shadow-lg">BUY NOW</span>
      </div>
      {/* Item Image */}
      <img
        src={item.images ? item.images[0] : 'https://placehold.co/400x400/png?text=Item'}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      {/* Item Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">{item.title}</h3>
        <p className="text-white text-sm mb-2">${item.price}</p>
        <Link
          to={`/item/${item.id}`}
          className="block text-center bg-yellow-600 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition"
        >
          Buy Now
        </Link>
      </div>    
    </div>
  );
};

export default ItemCard;
