import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuthContext } from "../contexts/AuthContext";
import { FilePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, loading, error, clearError } = useAuthContext();
  const navigate = useNavigate();
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
    if (error) clearError();
  };

  // Phone input handler
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home page on successful login
    } catch (error) {
      // Error is handled by the context
    }
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            required
            disabled={loading}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            required
            disabled={loading}
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
          disabled={loading}
        />

        <div className="mt-3">
          <PhoneInput
            country={'pk'}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputClass="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            inputStyle={{ width: '100%' }}
            required
          />
        </div>

        <textarea
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
          required
          disabled={loading}
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
          disabled={loading}
          className="mt-4 w-full bg-[rgb(0,78,102)] text-white py-2 rounded hover:bg-[rgb(0,90,115)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
