import { useAuthContext } from "../contexts/AuthContext";

// import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import DataTable from "../components/DataTable";
import ActiveBids from "./ActiveBids";
import Watchlist from "./Watchlist";
import PurchaseHistory from "./PurchaseHistory";
import AccountSettings from "./AccountSettings";
import NotificationList from "../components/NotificationList";

const BuyerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active-bids");
  const [notifications, setNotifications] = useState([]);
  const location = useLocation(); 

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
      setNotifications(data.notifications || []);
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
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  const tabs = [
    { name: "Active Bids", key: "active-bids" },
    { name: "Watchlist", key: "watchlist" },
    { name: "Purchase History", key: "purchase-history" },
    { name: "Account Settings", key: "account-settings" },
    { name: "Notifications", key: "notifications" },
    { name: "Current Auctions", key: "current-auctions" },
    { name: "Sales History", key: "sales-history" },
  ];

  

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
        Welcome, {user?.first_name || "Buyer"}

      </h1>

      {/* Stats Overview */}
      {dashboardData?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.stats.total_bids}</div>
            <div className="text-sm text-yellow-200">Total Bids</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.stats.winning_bids}</div>
            <div className="text-sm text-yellow-200">Winning Bids</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.stats.total_purchases}</div>
            <div className="text-sm text-yellow-200">Purchases</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.stats.watchlist_count}</div>
            <div className="text-sm text-yellow-200">Watchlist</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">${dashboardData.stats.total_spent}</div>
            <div className="text-sm text-yellow-200">Total Spent</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 text-center border border-yellow-700">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.stats.active_auctions_bidding}</div>
            <div className="text-sm text-yellow-200">Active Bidding</div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Bids */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 border border-yellow-700">
          <h2 className="text-xl font-semibold mb-3 text-yellow-300">Recent Bids</h2>
          {dashboardData?.recent_bids?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.recent_bids.map((bid) => (
                <div key={bid.id} className="border-l-4 border-yellow-600 pl-3 py-2">
                  <div className="font-medium text-sm"><Link to={`/auction/${bid.auction.id}`}>{bid.auction.title}</Link></div>
                  <div className="text-xs text-yellow-200">Bid: ${bid.amount}</div>
                  <div className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent bids.</p>
          )}
        </div>

        {/* Purchase History */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 border border-yellow-700">
          <h2 className="text-xl font-semibold mb-3 text-yellow-300">Recent Purchases</h2>
          {dashboardData?.recent_purchases?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.recent_purchases.map((purchase) => (
                <div key={purchase.id} className="border-l-4 border-yellow-600 pl-3 py-2">
                  <div className="font-medium text-sm">{purchase.auction.title}</div>
                  <div className="text-xs text-yellow-200">Paid: ${purchase.total_amount}</div>
                  <div className="text-xs text-gray-400">{new Date(purchase.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent purchases.</p>
          )}
        </div>

        {/* Watchlist */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 border border-yellow-700">
          <h2 className="text-xl font-semibold mb-3 text-yellow-300">Watchlist</h2>
          {dashboardData?.watchlist?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.watchlist.map((item) => (
                <div key={item.id} className="border-l-4 border-yellow-600 pl-3 py-2">
                  <div className="font-medium text-sm"><Link to={`/auction/${item.auction.id}`}>{item.auction.title}</Link></div>
                  <div className="text-xs text-yellow-200">
                    Current: ${item.auction.highest_bid?.amount || item.auction.starting_price}
                  </div>
                  <div className="text-xs text-gray-400">
                    Ends: {new Date(item.auction.end_time).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No items in watchlist.</p>
          )}
        </div>

        {/* Ending Soon */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 border border-yellow-700">
          <h2 className="text-xl font-semibold mb-3 text-yellow-300">Ending Soon</h2>
          {dashboardData?.ending_soon?.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.ending_soon.map((auction) => (
                <div key={auction.id} className="border-l-4 border-yellow-600 pl-3 py-2">
                  <div className="font-medium text-sm">{auction.title}</div>
                  <div className="text-xs text-yellow-200">
                    Current: ${auction.highest_bid?.amount || auction.starting_price}
                  </div>
                  <div className="text-xs text-yellow-400">
                    Ends: {new Date(auction.end_time).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No auctions ending soon.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Notifications</h2>
          <NotificationList notifications={notifications} />
        </div>

        {/* Account Settings */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg p-4 border border-yellow-700">
          <h2 className="text-xl font-semibold mb-3 text-yellow-300">Account Settings</h2>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`block text-left w-full py-2 px-4 rounded hover:bg-yellow-800/20 font-medium ${activeTab === tab.key ? "bg-yellow-700 text-black" : "text-yellow-200"}`}
        >
          {tab.name}
        </button>
      ))}
      {user?.role !== "seller" && (
        <button
          onClick={() => navigate("/become-seller")}
          className="mt-6 bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold"
        >
          Become a Seller
        </button>
      )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "active-bids" && <ActiveBids bids={dashboardData?.recent_bids} />}
        {activeTab === "watchlist" && <Watchlist items={dashboardData?.watchlist} />}
        {activeTab === "purchase-history" && <PurchaseHistory />}
        {activeTab === "account-settings" && <AccountSettings />}
        {activeTab === "notifications" && (
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <NotificationList notifications={[]} />
          </section>
        )}
        {activeTab === "current-auctions" && (
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Current Auctions You're Participating In</h2>
            <p className="text-gray-600 text-sm mb-2">No active auctions yet.</p>
          </section>
        )}
        {activeTab === "sales-history" && (
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Sales History</h2>
            <DataTable
              columns={[{ key: "item", header: "Item" }, { key: "price", header: "Sold For" }, { key: "date", header: "Date" }]}
              data={[]}
              emptyMessage="No sales history yet."
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default BuyerDashboard;
