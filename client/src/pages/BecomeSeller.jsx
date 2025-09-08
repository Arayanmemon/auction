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
    sellerType: "individual", // 'individual' or 'store'
    storeName: "",
    storeDescription: "",
    storeLogo: "",
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
    // Payout methods
    bank: false,
    paypal: false,
    card: false,
    bankIBAN: "",
    bankRouting: "",
    bankAccount: "",
    paypalDetails: "",
    cardDetails: "",
    // KYC & Tax
    taxForm: "",
    taxId: "",
    dob: "",
    legalTaxAddress: "",
    govId: null,
    selfie: null,
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (name === "storeLogo" || name === "govId" || name === "selfie") {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // At least one primary payout method must be active
  const hasActivePayout = form.bank || form.paypal || form.card;

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
  <div className="container mx-auto px-2 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)] text-center">
        Become a Seller
      </h1>
  <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
        {/* Seller Type Selection */}
  <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Seller Type</h2>
          <div className="flex gap-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sellerType"
                value="individual"
                checked={form.sellerType === "individual"}
                onChange={handleChange}
                className="mr-2 accent-[rgb(0,78,102)]"
              />
              <span className="font-medium">Private Individual</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sellerType"
                value="store"
                checked={form.sellerType === "store"}
                onChange={handleChange}
                className="mr-2 accent-[rgb(0,78,102)]"
              />
              <span className="font-medium">Store</span>
            </label>
          </div>
        </div>
  <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
          {/* Left column: Store fields if sellerType is store, Individual fields */}
          <div className="flex flex-col gap-6 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-100">
            {form.sellerType === "store" && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Store Details</h3>
                <input name="storeName" value={form.storeName} onChange={handleChange} placeholder="Store Name (optional)" className="border p-2 rounded mb-2 w-full" />
                <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} placeholder="Store Description (optional)" className="border p-2 rounded mb-2 w-full" />
                <input type="file" name="storeLogo" onChange={handleChange} className="border p-2 rounded mb-2 w-full" accept="image/*" />
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Info</h3>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded mb-2 w-full" required />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded mb-2 w-full" required />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded mb-2 w-full" type="email" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded mb-2 w-full" required />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded mb-2 w-full" required />
            </div>
          </div>
          {/* Right column: Other fields, payout, KYC & tax */}
          <div className="flex flex-col gap-6 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-100 mt-8 md:mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Location & Security</h3>
              <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" className="border p-2 rounded mb-2 w-full" required />
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded mb-2 w-full" required />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded mb-2 w-full" required />
              <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded mb-2 w-full" type="password" required />
              <input name="profilePic" value={form.profilePic} onChange={handleChange} placeholder="Profile Picture URL (optional)" className="border p-2 rounded mb-2 w-full" />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Payout Methods</h3>
              <label className="flex items-center mb-2">
                <input type="checkbox" name="bank" checked={form.bank} onChange={handleChange} className="mr-2" /> Bank Account
              </label>
              {form.bank && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input name="bankIBAN" value={form.bankIBAN} onChange={handleChange} placeholder="IBAN" className="border p-2 rounded w-full" />
                  <input name="bankRouting" value={form.bankRouting} onChange={handleChange} placeholder="Routing Number" className="border p-2 rounded w-full" />
                  <input name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="Account Number" className="border p-2 rounded w-full" />
                </div>
              )}
              <label className="flex items-center mb-2">
                <input type="checkbox" name="paypal" checked={form.paypal} onChange={handleChange} className="mr-2" /> PayPal
              </label>
              {form.paypal && (
                <input name="paypalDetails" value={form.paypalDetails} onChange={handleChange} placeholder="PayPal Email/Details" className="border p-2 rounded mb-2 w-full" />
              )}
              <label className="flex items-center mb-2">
                <input type="checkbox" name="card" checked={form.card} onChange={handleChange} className="mr-2" /> Credit/Debit Card (Stripe/Square)
              </label>
              {form.card && (
                <input name="cardDetails" value={form.cardDetails} onChange={handleChange} placeholder="Card Details (tokenized or last 4 digits)" className="border p-2 rounded mb-2 w-full" />
              )}
              {!hasActivePayout && (
                <p className="text-red-600 mt-2">You must activate at least one payout method (PayPal, Card, or Bank) to list items.</p>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">KYC & Tax Information</h3>
              <select name="taxForm" value={form.taxForm} onChange={handleChange} className="border p-2 rounded mb-2 w-full" required>
                <option value="">Select Tax Form</option>
                <option value="W-9">W-9 (US)</option>
                <option value="W-8BEN">W-8BEN (Non-US)</option>
              </select>
              <input name="taxId" value={form.taxId} onChange={handleChange} placeholder="Tax ID (SSN/ITIN/EIN or equivalent)" className="border p-2 rounded mb-2 w-full" required />
              <input name="dob" value={form.dob} onChange={handleChange} type="date" placeholder="Date of Birth" className="border p-2 rounded mb-2 w-full" required />
              <input name="legalTaxAddress" value={form.legalTaxAddress} onChange={handleChange} placeholder="Legal/Tax Address" className="border p-2 rounded mb-2 w-full" required />
              <label className="block mb-2">Government ID Upload (passport/driver’s license)</label>
              <input type="file" name="govId" onChange={handleChange} className="border p-2 rounded mb-2 w-full" accept="image/*,.pdf" />
              <label className="block mb-2">Optional Selfie/Live Check</label>
              <input type="file" name="selfie" onChange={handleChange} className="border p-2 rounded mb-2 w-full" accept="image/*" />
            </div>
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
