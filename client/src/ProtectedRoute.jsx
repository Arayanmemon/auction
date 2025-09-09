import { Navigate } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuthContext();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and doesn't match user's role, block access
  if (role && user.profile?.account_type !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
