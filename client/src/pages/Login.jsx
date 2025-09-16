import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, error, clearError } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError(); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home page on successful login
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">Login to Your Account</h2>
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-yellow-600 text-black py-2 rounded font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
