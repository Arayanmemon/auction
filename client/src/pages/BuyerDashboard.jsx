import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buyer/dashboard-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
        Welcome, {user?.name || "Buyer"}
      </h1>

      {/* Stats Overview */}
      {dashboardData?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">{dashboardData.stats.total_bids}</div>
            <div className="text-sm text-gray-600">Total Bids</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">{dashboardData.stats.winning_bids}</div>
            <div className="text-sm text-gray-600">Winning Bids</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">{dashboardData.stats.total_purchases}</div>
            <div className="text-sm text-gray-600">Purchases</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">{dashboardData.stats.watchlist_count}</div>
            <div className="text-sm text-gray-600">Watchlist</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">${dashboardData.stats.total_spent}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[rgb(0,78,102)]">{dashboardData.stats.active_auctions_bidding}</div>
            <div className="text-sm text-gray-600">Active Bidding</div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Bids */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Recent Bids</h2>
          {dashboardData?.recent_bids?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.recent_bids.map((bid) => (
                <div key={bid.id} className="border-l-4 border-[rgb(0,78,102)] pl-3 py-2">
                  <div className="font-medium text-sm"><Link to={`/auction/${bid.auction.id}`}>{bid.auction.title}</Link></div>
                  <div className="text-xs text-gray-600">Bid: ${bid.amount}</div>
                  <div className="text-xs text-gray-500">{new Date(bid.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No recent bids.</p>
          )}
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Recent Purchases</h2>
          {dashboardData?.recent_purchases?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.recent_purchases.map((purchase) => (
                <div key={purchase.id} className="border-l-4 border-green-500 pl-3 py-2">
                  <div className="font-medium text-sm">{purchase.auction.title}</div>
                  <div className="text-xs text-gray-600">Paid: ${purchase.total_amount}</div>
                  <div className="text-xs text-gray-500">{new Date(purchase.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No recent purchases.</p>
          )}
        </div>

        {/* Watchlist */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Watchlist</h2>
          {dashboardData?.watchlist?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.watchlist.map((item) => (
                <div key={item.id} className="border-l-4 border-yellow-500 pl-3 py-2">
                  <div className="font-medium text-sm"><Link to={`/auction/${item.auction.id}`}>{item.auction.title}</Link></div>
                  <div className="text-xs text-gray-600">
                    Current: ${item.auction.highest_bid?.amount || item.auction.starting_price}
                  </div>
                  <div className="text-xs text-gray-500">
                    Ends: {new Date(item.auction.end_time).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No items in watchlist.</p>
          )}
        </div>

        {/* Ending Soon */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Ending Soon</h2>
          {dashboardData?.ending_soon?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.ending_soon.map((auction) => (
                <div key={auction.id} className="border-l-4 border-red-500 pl-3 py-2">
                  <div className="font-medium text-sm">{auction.title}</div>
                  <div className="text-xs text-gray-600">
                    Current: ${auction.highest_bid?.amount || auction.starting_price}
                  </div>
                  <div className="text-xs text-red-600">
                    Ends: {new Date(auction.end_time).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No auctions ending soon.</p>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
          <button
            onClick={() => alert("Account settings coming soon!")}
            className="text-[rgb(0,78,102)] hover:underline text-sm"
          >
            Manage Account
          </button>
        </div>

        {/* Become Seller */}
        {user?.role !== "seller" && (
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
            <button
              onClick={() => navigate("/become-seller")}
              className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition"
            >
              Become a Seller
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
