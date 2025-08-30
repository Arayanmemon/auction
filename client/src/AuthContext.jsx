import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on app start (persist session)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Register user (default role = buyer)
  const register = (userData) => {
    const newUser = { ...userData, role: "buyer" };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/"); // Redirect after registration
  };

  // Upgrade to seller role, storing seller onboarding info
  const becomeSeller = (sellerData) => {
    if (!user) return;
    // Merge sellerData with existing user, update role
    const updatedUser = { ...user, ...sellerData, role: "seller" };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/seller-dashboard"); // redirect to seller dashboard
  };

  // Login user (dummy validation: checks email + optional password)
  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email) {
      // Optional: check password if you stored it in register
      setUser(storedUser);
      navigate("/");
    } else {
      alert("Invalid credentials or user not registered.");
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, becomeSeller }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth state anywhere
export const useAuth = () => useContext(AuthContext);
