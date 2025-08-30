import { useState } from "react";
import { useAuth } from "../AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData); // dummy register
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-6 rounded-lg shadow w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[rgb(0,78,102)]">
          Create Your Account
        </h2>

        <div className="flex gap-2">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            required
          />
        </div>

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
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          required
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={formData.address}
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

        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleChange}
          className="mt-3 w-full"
        />

        <button
          type="submit"
          className="mt-4 w-full bg-[rgb(0,78,102)] text-white py-2 rounded hover:bg-[rgb(0,90,115)] transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
