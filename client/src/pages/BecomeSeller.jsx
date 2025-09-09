import { useAuthContext } from "../contexts/AuthContext";
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
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    seller_type: "individual", // 'individual' or 'store'
    store_name: "",
    store_description: "",
    store_logo: null,
    zip: "",
    state: "",
    country: "",
    // Payout methods
    bank_enabled: false,
    paypal_enabled: false,
    card_enabled: false,
    bank_iban: "",
    bank_routing: "",
    bank_account: "",
    paypal_details: "",
    card_details: "",
    // KYC & Tax
    tax_form: "",
    tax_id: "",
    date_of_birth: "",
    legal_tax_address: "",
    gov_id: null,
    selfie: null,
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (name === "store_logo" || name === "gov_id" || name === "selfie") {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // At least one primary payout method must be active
  const hasActivePayout = form.bank_enabled || form.paypal_enabled || form.card_enabled;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasActivePayout) {
      setError("You must activate at least one payout method (Bank, PayPal, or Card)");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('seller_type', form.seller_type);
      formData.append('store_name', form.store_name);
      formData.append('store_description', form.store_description);
      if (form.store_logo) formData.append('store_logo', form.store_logo);
      formData.append('zip', form.zip);
      formData.append('state', form.state);
      formData.append('country', form.country);
      formData.append('bank_enabled', form.bank_enabled);
      formData.append('paypal_enabled', form.paypal_enabled);
      formData.append('card_enabled', form.card_enabled);
      formData.append('bank_iban', form.bank_iban);
      formData.append('bank_routing', form.bank_routing);
      formData.append('bank_account', form.bank_account);
      formData.append('paypal_details', form.paypal_details);
      formData.append('card_details', form.card_details);
      formData.append('tax_form', form.tax_form);
      formData.append('tax_id', form.tax_id);
      formData.append('date_of_birth', form.date_of_birth);
      formData.append('legal_tax_address', form.legal_tax_address);
      if (form.gov_id) formData.append('gov_id', form.gov_id);
      if (form.selfie) formData.append('selfie', form.selfie);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/become-seller`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept': 'application/json', 
        },
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate("/seller-dashboard");
      } else {
        setError(data.message || "Failed to submit seller application");
      }
    } catch (error) {
      console.error("Error submitting seller form:", error);
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-2 py-20 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-[rgb(0,78,102)] text-center">
        Become a Seller
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-2xl shadow-2xl border border-gray-100">
        {/* Seller Type Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Type</h2>
          <div className="flex gap-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="seller_type"
                value="individual"
                checked={form.seller_type === "individual"}
                onChange={handleChange}
                className="mr-2 accent-[rgb(0,78,102)]"
              />
              <span className="font-medium">Private Individual</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="seller_type"
                value="store"
                checked={form.seller_type === "store"}
                onChange={handleChange}
                className="mr-2 accent-[rgb(0,78,102)]"
              />
              <span className="font-medium">Store</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column: Store fields if sellerType is store, Individual fields */}
          <div className="flex flex-col gap-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
            {form.seller_type === "store" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Store Details</h3>
                <input name="store_name" value={form.store_name} onChange={handleChange} placeholder="Store Name (optional)" className="border p-2 rounded mb-2 w-full" />
                <textarea name="store_description" value={form.store_description} onChange={handleChange} placeholder="Store Description (optional)" className="border p-2 rounded mb-2 w-full" />
                <input type="file" name="store_logo" onChange={handleChange} className="border p-2 rounded mb-2 w-full" accept="image/*" />
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Info</h3>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded mb-3 w-full" required />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded mb-3 w-full" required />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded mb-3 w-full" type="email" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded mb-3 w-full" required />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded mb-3 w-full" required />
            </div>
          </div>
          {/* Right column: Other fields, payout, KYC & tax */}
          <div className="flex flex-col gap-8 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-100 mt-8 md:mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Location & Security</h3>
              <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" className="border p-2 rounded mb-2 w-full" required />
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded mb-2 w-full" required />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded mb-2 w-full" required />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Payout Methods</h3>
              <label className="flex items-center mb-2">
                <input type="checkbox" name="bank_enabled" checked={form.bank_enabled} onChange={handleChange} className="mr-2" /> Bank Account
              </label>
              {form.bank_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input name="bank_iban" value={form.bank_iban} onChange={handleChange} placeholder="IBAN" className="border p-2 rounded w-full" />
                  <input name="bank_routing" value={form.bank_routing} onChange={handleChange} placeholder="Routing Number" className="border p-2 rounded w-full" />
                  <input name="bank_account" value={form.bank_account} onChange={handleChange} placeholder="Account Number" className="border p-2 rounded w-full" />
                </div>
              )}
              <label className="flex items-center mb-2">
                <input type="checkbox" name="paypal_enabled" checked={form.paypal_enabled} onChange={handleChange} className="mr-2" /> PayPal
              </label>
              {form.paypal_enabled && (
                <input name="paypal_details" value={form.paypal_details} onChange={handleChange} placeholder="PayPal Email/Details" className="border p-2 rounded mb-2 w-full" />
              )}
              <label className="flex items-center mb-2">
                <input type="checkbox" name="card_enabled" checked={form.card_enabled} onChange={handleChange} className="mr-2" /> Credit/Debit Card (Stripe/Square)
              </label>
              {form.card_enabled && (
                <input name="card_details" value={form.card_details} onChange={handleChange} placeholder="Card Details (tokenized or last 4 digits)" className="border p-2 rounded mb-2 w-full" />
              )}
              {!hasActivePayout && (
                <p className="text-red-600 mt-2">You must activate at least one payout method (PayPal, Card, or Bank) to list items.</p>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">KYC & Tax Information</h3>
              <select name="tax_form" value={form.tax_form} onChange={handleChange} className="border p-2 rounded mb-2 w-full" required>
                <option value="">Select Tax Form</option>
                <option value="W-9">W-9 (US)</option>
                <option value="W-8BEN">W-8BEN (Non-US)</option>
              </select>
              <input name="tax_id" value={form.tax_id} onChange={handleChange} placeholder="Tax ID (SSN/ITIN/EIN or equivalent)" className="border p-2 rounded mb-2 w-full" required />
              <input name="date_of_birth" value={form.date_of_birth} onChange={handleChange} type="date" placeholder="Date of Birth" className="border p-2 rounded mb-2 w-full" required />
              <input name="legal_tax_address" value={form.legal_tax_address} onChange={handleChange} placeholder="Legal/Tax Address" className="border p-2 rounded mb-2 w-full" required />
              <label className="block mb-2">Government ID Upload (passport/driver’s license)</label>
              <input type="file" name="gov_id" onChange={handleChange} className="border p-2 rounded mb-2 w-full" accept="image/*,.pdf" />
              <label className="block mb-2">Optional Selfie/Live Check</label>
              <input type="file" name="selfie" onChange={handleChange} className="border p-2 rounded mb-3 w-full" accept="image/*" />
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className={`w-full mt-10 bg-[rgb(0,78,102)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(0,90,115)] transition ${!hasActivePayout ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasActivePayout}
        >
          Upgrade to Seller
        </button>
      </form>
    </div>
  );
};

export default BecomeSeller;
