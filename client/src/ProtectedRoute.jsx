import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Redirect to login if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If role is specified and doesn't match user's role, block access
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
