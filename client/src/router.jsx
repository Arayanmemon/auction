import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import ItemsList from "./pages/ItemsList";
import ItemDetail from "./pages/ItemDetail";
import AuctionList from "./pages/AuctionList";
import AuctionDetail from "./pages/AuctionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import Watchlist from "./pages/Watchlist";
import Cart from "./pages/Cart";
import AccountSettings from "./pages/AccountSettings";
import ActiveBids from "./pages/ActiveBids";
import PurchaseHistory from "./pages/PurchaseHistory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SellerDashboard from "./pages/SellerDashboard";
import BecomeSeller from "./pages/BecomeSeller";

import CreateSession from "./pages/CreateSession";
import AddItems from "./pages/AddItems";
import SessionItems from "./pages/SessionItems";

import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
  <Route path="/auctions" element={<AuctionList />} />
  <Route path="/items" element={<ItemsList />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/buyer/watchlist" element={<Watchlist />} />
  <Route path="/watchlist" element={<Watchlist />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/buyer/account-settings" element={<AccountSettings />} />
  <Route path="/buyer/active-bids" element={<ActiveBids />} />
  <Route path="/buyer/purchase-history" element={<PurchaseHistory />} />

        {/* Buyer Dashboard (any logged-in user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Become a Seller (buyer only) */}
        <Route
          path="/become-seller"
          element={
            <ProtectedRoute>
              <BecomeSeller />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard (role restricted) */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Auction Session Flow (seller only) */}
        <Route
          path="/create-session"
          element={
           // <ProtectedRoute role="seller">
              <CreateSession />
          //  </ProtectedRoute>
          }
        />
        <Route
          path="/add-items/:sessionId"
          element={
            <ProtectedRoute role="seller">
              <AddItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId"
          element={
            <ProtectedRoute role="seller">
              <SessionItems />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
