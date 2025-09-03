import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
        Welcome, {user?.name || "Buyer"}
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
