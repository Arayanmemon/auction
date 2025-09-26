import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuthContext } from "../contexts/AuthContext";
import { FilePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, verifyOtp, loading, error, clearError } = useAuthContext();
  const navigate = useNavigate();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    profilePic: null,
    otp_type: "phone",
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
    console.log(formData.profilePic);
    try {
      const res = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        password: formData.password,
        otp_type: formData.otp_type,
        profile_pic: formData.profilePic || null,
      });
      if (res.success) {
        setIsOTPSent(true);
        console.log("OTP sent to your phone.");
      } else {
        throw new Error(res.message || "Registration failed");
      }
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ phone: formData.phone, code: otp });
      if (res.success) {
        navigate("/dashboard"); // Redirect to home page on successful OTP verification
      } else {
        throw new Error(res.message || "OTP verification failed");
      }
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      {isOTPSent && (
        <form
          onSubmit={handleOtpSubmit}
          className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">
            OTP Verification
          </h2>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            name="code"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-yellow-600 text-black py-2 rounded font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      )}
      {!isOTPSent && (
        <>
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">
              Create Your Account
            </h2>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="flex gap-3 mb-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
                disabled={loading}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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
              className="border border-gray-700 bg-black text-white rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
              disabled={loading}
            />
            <div className="mb-4">
              <PhoneInput
                country={"pk"}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass="w-full border border-gray-700 bg-black text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                inputStyle={{
                  width: "100%",
                  background: "#000",
                  color: "#fff",
                  borderColor: "#444",
                  borderRadius: "0.5rem",
                }}
                required
              />
            </div>
            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
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
            <div className="flex gap-4 mt-3">
              <h3>Recieve OTP: </h3>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="otp_type"
                  value="phone"
                  id="otp_sms"
                  onChange={handleChange}
                />
                <label htmlFor="otp_sms">SMS</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="otp_type"
                  value="email"
                  id="otp_email"
                  onChange={handleChange}
                />
                <label htmlFor="otp_email">Email</label>
              </div>
            </div>
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
        </>
      )}
    </div>
  );
};

export default Register;
