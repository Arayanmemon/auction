import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const Cart = () => {
  const { user } = useAuthContext() || { user: null };
  const cartItems = user?.cart || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-gray-400">
          Your cart is empty. <Link to="/items" className="text-yellow-500">Browse items</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cartItems.map((it, idx) => (
            <div key={idx} className="bg-gray-900 p-4 rounded border border-gray-800">
              <div className="flex items-center gap-4">
                {it.image && <img src={it.image} alt={it.title} className="w-20 h-20 object-cover rounded" />}
                <div>
                  <h3 className="font-semibold text-yellow-200">{it.title}</h3>
                  <p className="text-gray-400">Qty: {it.quantity || 1}</p>
                  <p className="text-yellow-400 font-bold">${it.price?.toFixed?.(2) ?? it.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
