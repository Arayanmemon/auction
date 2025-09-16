import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemCategories } from "../data/itemCategories";
import ItemCard from "../components/ItemCard";

const getItemById = (id) => {
  for (const category in itemCategories) {
    const found = itemCategories[category].find((item) => String(item.id) === String(id));
    if (found) return found;
  }
  return null;
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getItemById(id);
  const [quantity, setQuantity] = useState(1);
  const [checkout, setCheckout] = useState(false);

  if (!item) {
    return <div className="text-center text-white py-20">Item not found.</div>;
  }

  if (checkout) {
    return (
      <div className="container mx-auto  px-4  py-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6">Checkout</h2>
        <div className="bg-black border border-gray-800 rounded-lg p-6 w-full max-w-md text-white">
          <p className="mb-2">Item: <span className="font-bold">{item.title}</span></p>
          <p className="mb-2">Price: <span className="font-bold text-yellow-500">${item.price}</span></p>
          <p className="mb-2">Quantity: <span className="font-bold">{quantity}</span></p>
          <p className="mb-4">Total: <span className="font-bold text-yellow-600">${item.price * quantity}</span></p>
          <button
            className="w-full bg-yellow-600 text-black py-2 rounded font-bold hover:bg-yellow-500 transition mb-2"
            onClick={() => alert("Order placed! (mock)")}
          >
            Place Order
          </button>
          <button
            className="w-full bg-gray-800 text-white py-2 rounded font-bold hover:bg-gray-700 transition"
            onClick={() => setCheckout(false)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-15 mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-center">
      {/* Item Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={item.image || item.images?.[0] || 'https://placehold.co/400x400/png?text=Item'}
          alt={item.title}
          className="rounded-lg shadow-lg w-80 h-80 object-cover bg-black border border-gray-800"
        />
      </div>
      {/* Item Details */}
      <div className="w-full md:w-1/2 bg-black border border-gray-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">{item.title}</h1>
        <p className="mb-2 text-lg">Category: <span className="text-yellow-500">{item.category}</span></p>
        <p className="mb-2">Description: {item.description}</p>
        <p className="mb-4 text-xl font-bold text-yellow-500">${item.price}</p>
        <div className="flex items-center gap-3 mb-6">
          <label className="text-white font-semibold">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 px-2 py-1 rounded border border-gray-700 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>
        <button
          className="w-full bg-yellow-600 text-black py-3 rounded font-bold text-lg hover:bg-yellow-500 transition"
          onClick={() => setCheckout(true)}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;
