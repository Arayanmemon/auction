import { heroAuctions } from "../data/heroAuctions"; // Replace later with seller-specific data
import AuctionCard from "../components/AuctionCard";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import axios from "axios";

const payoutMethodsList = [
  { key: "bank", label: "Bank Account" },
  { key: "paypal", label: "PayPal" },
  { key: "stripe", label: "Stripe (future)" },
  { key: "wise", label: "Wise (future)" },
  { key: "payoneer", label: "Payoneer (future)" },
];

const SellerDashboard = () => {
  const { user } = useAuthContext();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Dummy seller id for demonstration
  const sellerId = user?.id || 1;

  // Dummy payout methods state (should come from backend)
  const [payoutMethods, setPayoutMethods] = useState({
    bank: true,
    paypal: false,
    stripe: false,
    wise: false,
    payoneer: false,
  });

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/seller/auctions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        setAuctions(data.auctions);
        setError(null);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to fetch auctions");
        // Fallback to dummy data on error
        setAuctions(heroAuctions.filter(a => a.sellerId === sellerId));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSellerAuctions();
    }
  }, [user, sellerId]);

  // Use fetched auctions instead of dummy data
  const myAuctions = loading ? [] : (auctions.length > 0 ? auctions : heroAuctions.filter(a => a.sellerId === sellerId));

  // Dummy sales history (replace with real data)
  const salesHistory = [
    {
      id: 101,
      title: "Gaming Chair",
      soldPrice: 120,
      commission: 12,
      date: "2025-08-01",
      buyer: "John Doe"
    },
    {
      id: 102,
      title: "MacBook Pro 2021",
      soldPrice: 1500,
      commission: 150,
      date: "2025-07-15",
      buyer: "Jane Smith"
    }
  ];

  // Handler for editing auction (dummy)
  const handleEditAuction = (auctionId) => {
    alert(`Edit auction ${auctionId} (feature coming soon)`);
  };

  // Handler for deleting auction (dummy)
  const handleDeleteAuction = (auctionId) => {
    if (window.confirm("Are you sure you want to delete this auction?")) {
      alert(`Auction ${auctionId} deleted (feature coming soon)`);
    }
  };

  // Check if at least one payout method is active
  const hasActivePayout = Object.values(payoutMethods).some(Boolean);

  // Handler for toggling payout methods (for demo)
  const handleTogglePayout = (key) => {
    setPayoutMethods(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* Seller profile/account info (dummy) */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Account Info</h2>
        <p><strong>Name:</strong> {user?.name || "Demo Seller"} {user?.lastName || ""}</p>
        <p><strong>Email:</strong> {user?.email || "demo@seller.com"}</p>
        <p><strong>Phone:</strong> {user?.phone || "+1234567890"}</p>
      </div>

      {/* Payment methods management */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Payout Methods</h2>
        <ul>
          {payoutMethodsList.map(method => (
            <li key={method.key} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={payoutMethods[method.key]}
                onChange={() => handleTogglePayout(method.key)}
                disabled={method.key === "stripe" || method.key === "wise" || method.key === "payoneer"}
                className="mr-2"
              />
              <span>{method.label}</span>
              {method.key === "stripe" || method.key === "wise" || method.key === "payoneer" ? (
                <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
              ) : null}
            </li>
          ))}
        </ul>
        {!hasActivePayout && (
          <p className="text-red-600 mt-2">You must activate at least one payout method to list items.</p>
        )}
      </div>

      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <a
          href={hasActivePayout ? "/create-session" : "#"}
          className={`bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] ${!hasActivePayout ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={e => { if (!hasActivePayout) e.preventDefault(); }}
        >
          Create Auction
        </a>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your auctions...</div>
      ) : error && auctions.length === 0 ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : myAuctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myAuctions.map((auction) => (
            <div key={auction.id} className="relative">
              <AuctionCard auction={auction} />
              {/* Manage buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEditAuction(auction.id)}
                  className="bg-yellow-400 text-xs px-2 py-1 rounded hover:bg-yellow-500"
                >Edit</button>
                <button
                  onClick={() => handleDeleteAuction(auction.id)}
                  className="bg-red-500 text-xs text-white px-2 py-1 rounded hover:bg-red-600"
                >Delete</button>
              </div>
              {/* Commission calculation (dummy) */}
              <div className="mt-2 text-xs text-gray-600">
                Commission: 10% = ${auction.buy_now_price ? (auction.buy_now_price * 0.1).toFixed(2) : "-"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No auctions listed yet.</p>
      )}

      {/* Sales History Section */}
      <div className="mt-10 bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold mb-2">Sales History</h3>
        {salesHistory.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Title</th>
                <th className="p-2">Sold Price</th>
                <th className="p-2">Commission</th>
                <th className="p-2">Buyer</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map(sale => (
                <tr key={sale.id} className="border-b">
                  <td className="p-2">{sale.title}</td>
                  <td className="p-2">${sale.soldPrice}</td>
                  <td className="p-2">${sale.commission}</td>
                  <td className="p-2">{sale.buyer}</td>
                  <td className="p-2">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No sales history yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
