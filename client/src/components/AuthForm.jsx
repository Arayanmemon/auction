import { useState } from "react";
import { Link } from "react-router-dom";

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-[rgb(0,78,102)]">
        {type === "login" ? "Login to Your Account" : "Create an Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Show Name field only for Register */}
        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          />
        )}

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />

        {/* Password Field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[rgb(0,78,102)] text-white py-2 rounded hover:bg-[rgb(0,90,115)] transition"
        >
          {type === "login" ? "Login" : "Register"}
        </button>
      </form>

      {/* Switch Auth Type Link */}
      <p className="text-center mt-4 text-sm">
        {type === "login" ? (
          <>
            Don’t have an account?{" "}
            <Link to="/register" className="text-[rgb(0,78,102)] hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-[rgb(0,78,102)] hover:underline">
              Login
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
