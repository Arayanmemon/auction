import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import AuctionList from "./pages/AuctionList";
import AuctionDetail from "./pages/AuctionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
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
        <Route path="/auctions/:id" element={<AuctionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
            <ProtectedRoute role="seller">
              <CreateSession />
            </ProtectedRoute>
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
