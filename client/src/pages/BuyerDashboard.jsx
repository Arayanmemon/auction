import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const location = useLocation(); 
  const tabs = [
    { name: "Active Bids", key: "active-bids" },
    { name: "Watchlist", key: "watchlist" },
    { name: "Purchase History", key: "purchase-history" },
    { name: "Account Settings", key: "account-settings" },
    { name: "Notifications", key: "notifications" },
    { name: "Current Auctions", key: "current-auctions" },
    { name: "Sales History", key: "sales-history" },
  ];
  const [activeTab, setActiveTab] = React.useState("active-bids");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
        Welcome, {user?.firstName || "Buyer"}
      </h1>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Bids */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Active Bids</h2>
          <p className="text-gray-600 text-sm">No active bids yet.</p>
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Purchase History</h2>
          <p className="text-gray-600 text-sm">No purchases yet.</p>
        </div>

        {/* Watchlist */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Watchlist</h2>
          <p className="text-gray-600 text-sm">No items in watchlist.</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Notifications</h2>
          <p className="text-gray-600 text-sm">No new notifications.</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`block text-left w-full py-2 px-4 rounded hover:bg-gray-100 font-medium ${activeTab === tab.key ? "bg-[rgb(0,78,102)] text-white" : "text-gray-700"}`}
          >
            {tab.name}
          </button>
        ))}
        {user?.role !== "seller" && (
          <button
            onClick={() => navigate("/become-seller")}
            className="mt-6 bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition"
          >
            Become a Seller
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
          Welcome, {user?.firstName || "Buyer"}
        </h1>
        {activeTab === "active-bids" && <ActiveBids />}
        {activeTab === "watchlist" && <Watchlist />}
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
