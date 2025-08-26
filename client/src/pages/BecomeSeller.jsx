import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const payoutMethodsList = [
  { key: "bank", label: "Bank Account" },
  { key: "paypal", label: "PayPal" },
  { key: "stripe", label: "Stripe (future)" },
  { key: "wise", label: "Wise (future)" },
  { key: "payoneer", label: "Payoneer (future)" },
];

const BecomeSeller = () => {
  const { user, becomeSeller } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    zip: user?.zip || "",
    state: user?.state || "",
    country: user?.country || "",
    password: user?.password || "",
    profilePic: user?.profilePic || "",
    bank: false,
    paypal: false,
    stripe: false,
    wise: false,
    payoneer: false,
    bankDetails: "",
    paypalDetails: "",
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const hasActivePayout = form.bank || form.paypal;

  const handleSubmit = e => {
    e.preventDefault();
    if (!hasActivePayout) {
      setError("You must activate at least one payout method (Bank or PayPal)");
      return;
    }
    // Add validation for required fields if needed
    becomeSeller(form); // Pass form data to context/backend
    navigate("/seller-dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)] text-center">
        Become a Seller
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4">
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" required />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" type="email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded" required />
          <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" className="border p-2 rounded" required />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" required />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded" required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded" type="password" required />
          <input name="profilePic" value={form.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="border p-2 rounded" />
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Payout Methods</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input type="checkbox" name="bank" checked={form.bank} onChange={handleChange} className="mr-2" /> Bank Account
            </label>
            {form.bank && (
              <input name="bankDetails" value={form.bankDetails} onChange={handleChange} placeholder="Bank Account Details" className="border p-2 rounded mt-2" required />
            )}
            <label className="flex items-center">
              <input type="checkbox" name="paypal" checked={form.paypal} onChange={handleChange} className="mr-2" /> PayPal
            </label>
            {form.paypal && (
              <input name="paypalDetails" value={form.paypalDetails} onChange={handleChange} placeholder="PayPal Email/Details" className="border p-2 rounded mt-2" required />
            )}
            <label className="flex items-center">
              <input type="checkbox" name="stripe" checked={form.stripe} disabled className="mr-2" /> Stripe <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="wise" checked={form.wise} disabled className="mr-2" /> Wise <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="payoneer" checked={form.payoneer} disabled className="mr-2" /> Payoneer <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
            </label>
          </div>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className={`w-full mt-6 bg-[rgb(0,78,102)] text-white px-6 py-3 rounded hover:bg-[rgb(0,90,115)] transition ${!hasActivePayout ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasActivePayout}
        >
          Upgrade to Seller
        </button>
      </form>
    </div>
  );
};

export default BecomeSeller;
