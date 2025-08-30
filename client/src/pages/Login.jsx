import { useState } from "react";
import { useAuth } from "../AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password); // dummy login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-6 rounded-lg shadow w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[rgb(0,78,102)]">
          Login to Your Account
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          required
        />

        <button
          type="submit"
          className="mt-4 w-full bg-[rgb(0,78,102)] text-white py-2 rounded hover:bg-[rgb(0,90,115)] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
