import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import categoryAuctionsJson from "../data/categoryAuctions.json";

// Use section names from categoryAuctions.json
const categories = ["", ...Object.keys(categoryAuctionsJson)];

const CreateSession = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    images: [],
    digitalFiles: [],
    quantity: 1,
    video: null,
    startingPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    duration: "7",
    condition: "New",
    importFees: "",
    delivery: "",
    returnsPolicy: "",
    paymentMethods: [],
    shippingOption: "flat",
    shippingCost: "",
    shipping: "",
    location: "",
    date: "",
    time: "",
    auctionType: "bid", // default to 'bid'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthContext();

  const navigate = useNavigate();

  // Handle text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If switching auction type to direct sale, clear bid-specific fields
    if (name === 'auctionType') {
      if (value === 'sell') {
        setFormData((prev) => ({ ...prev, auctionType: value, startingPrice: '', reservePrice: '' }));
        return;
      }
      // switching to bid
      setFormData((prev) => ({ ...prev, auctionType: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle payment methods (checkboxes)
  const togglePaymentMethod = (method) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev.paymentMethods) ? prev.paymentMethods : [];
      if (existing.includes(method)) {
        return { ...prev, paymentMethods: existing.filter((m) => m !== method) };
      }
      return { ...prev, paymentMethods: [...existing, method] };
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Start from existing images and append new ones up to 10 total
    const existing = formData.images || [];
    const spaceLeft = Math.max(0, 10 - existing.length);
    const toAdd = files.slice(0, spaceLeft);

    const added = toAdd.map((file) => ({ file, url: URL.createObjectURL(file) }));
    const combined = [...existing, ...added];
    setFormData({ ...formData, images: combined });

    if (files.length > spaceLeft) {
      setError('You can upload up to 10 images only. Extra files were ignored.');
    }

    // Clear the input so user can pick more files later
    try {
      e.target.value = '';
    } catch (err) {
      // ignore
    }
  };

  const removeImage = (index) => {
    const imgs = [...(formData.images || [])];
    const removed = imgs.splice(index, 1);
    // Revoke object URL to avoid memory leak
    if (removed && removed[0] && removed[0].url) {
      try { URL.revokeObjectURL(removed[0].url); } catch (e) {}
    }
    setFormData({ ...formData, images: imgs });
  };

  // Handle digital files upload (PDF, JPG, PNG, DOCX, ZIP, etc.) - up to 5 files
  const handleDigitalFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      // also accept common older/ms doc types if needed
      'application/msword'
    ];
    // Filter by allowed types
    const filtered = files.filter((f) => allowedTypes.includes(f.type) || /\.(pdf|jpe?g|png|docx|doc|zip)$/i.test(f.name));
    if (filtered.length !== files.length) {
      setError('Some files were ignored — allowed types: PDF, JPG, PNG, DOCX, ZIP.');
    }

    // Append to existing digital files up to 5 total
    const existing = formData.digitalFiles || [];
    const spaceLeft = Math.max(0, 5 - existing.length);
    const toAdd = filtered.slice(0, spaceLeft);
    const added = toAdd.map((file) => ({ file, name: file.name, size: file.size }));
    const combined = [...existing, ...added];
    setFormData({ ...formData, digitalFiles: combined });
    if (files.length > spaceLeft) {
      setError('You can upload up to 5 digital files only. Extra files were ignored.');
    }

    // Clear the input so user can pick more files later (including same file)
    try { e.target.value = ''; } catch (err) {}
  };

  const removeDigitalFile = (index) => {
    const arr = [...formData.digitalFiles];
    arr.splice(index, 1);
    setFormData({ ...formData, digitalFiles: arr });
  };

  // Handle video upload (single)
  const handleVideoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData({ ...formData, video: file });
    } else {
      setFormData({ ...formData, video: null });
    }
    // Clear the input so user can re-select the same file or pick another
    try { e.target.value = ''; } catch (err) {}
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Client-side validation depending on auction type
      if (formData.auctionType === 'bid') {
        if (!formData.startingPrice || !formData.reservePrice) {
          setError('Starting price and reserve price are required for bid auctions.');
          setLoading(false);
          return;
        }
      } else {
        // Direct sale: fixed buy now price required
        if (!formData.buyNowPrice) {
          setError('Fixed price is required for direct sale.');
          setLoading(false);
          return;
        }
      }
      // Prepare form data for backend
      const auctionData = new FormData();
      // Calculate start and end times depending on auction type
      let startDateTime;
      if (formData.date && formData.time) {
        startDateTime = new Date(`${formData.date}T${formData.time}`);
      } else {
        startDateTime = new Date();
      }
      if (formData.auctionType === 'bid') {
        const endDateTime = new Date(startDateTime);
        endDateTime.setDate(endDateTime.getDate() + parseInt(formData.duration));
        auctionData.append('start_time', startDateTime.toISOString());
        auctionData.append('end_time', endDateTime.toISOString());
      } else {
        // Direct sale: no duration/end_time required
        auctionData.append('start_time', startDateTime.toISOString());
      }
      auctionData.append('title', formData.title);
      auctionData.append('description', formData.description);
      // auctionData.append('category', formData.category);
      if (formData.auctionType === 'bid') {
        auctionData.append('starting_price', formData.startingPrice);
        auctionData.append('reserve_price', formData.reservePrice);
        auctionData.append('buy_now_price', formData.buyNowPrice || '');
      } else {
        // Direct sale (sell): fixed buy now price is required
        auctionData.append('buy_now_price', formData.buyNowPrice);
      }
  // (start_time and end_time were appended above depending on auctionType)
      auctionData.append('shipping', formData.shipping);
      auctionData.append('location', formData.location);
      // Additional seller-provided fields
      auctionData.append('condition', formData.condition || '');
      auctionData.append('import_fees', formData.importFees || '');
      auctionData.append('delivery', formData.delivery || '');
      auctionData.append('returns_policy', formData.returnsPolicy || '');
      // payment methods: send as comma-separated string
      if (formData.paymentMethods && formData.paymentMethods.length > 0) {
        auctionData.append('payment_methods', formData.paymentMethods.join(','));
      }
      auctionData.append('shipping_option', formData.shippingOption || 'flat');
      if (formData.shippingOption === 'flat') {
        auctionData.append('shipping_cost', formData.shippingCost || '');
      }
      // Keep backend compatibility: send selected category name and default category_id (backend currently expects category_id)
      auctionData.append('category', formData.category || '');
      auctionData.append('category_id', 1);
      auctionData.append('quantity', formData.quantity || 1);
      // If video present, append it
      if (formData.video) {
        auctionData.append('video', formData.video);
      }
      // Append digital files if present
      if (formData.digitalFiles && formData.digitalFiles.length > 0) {
        for (let i = 0; i < formData.digitalFiles.length; i++) {
          auctionData.append('digital_files[]', formData.digitalFiles[i].file);
        }
      }
      if(formData.auctionType === 'bid') {
      auctionData.append('is_bid', 1);
      } else {
      auctionData.append('is_bid', 0);
      }
      // Append image files from component state (supports incremental uploads)
      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < Math.min(formData.images.length, 10); i++) {
          auctionData.append('images[]', formData.images[i].file);
        }
      }

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/auction/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',  
        },
        body: auctionData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create auction');
      }

      const newAuction = await response.json();
      console.log('Auction created:', newAuction);
      
      // Redirect to seller dashboard
      navigate('/seller-dashboard');
      
    } catch (err) {
      console.error('Error creating auction:', err);
      setError(err.message || 'Failed to create auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 my-20 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Create New Auction</h1>

      {error && (
        <div className="max-w-2xl mb-4 p-4 bg-red-800 text-red-200 rounded border border-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg shadow-lg space-y-4 border border-yellow-700"
      >
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe the auction"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
          className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        ></textarea>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Images (up to 10)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200"
          />
          {formData.images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.images.map((imgObj, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={imgObj.url}
                        alt={`preview-${index}`}
                        className="w-16 h-16 object-cover rounded border border-yellow-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-black bg-opacity-70 text-yellow-300 rounded-full w-6 h-6 flex items-center justify-center border border-yellow-700 hover:text-yellow-200"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Digital files (PDF, JPG, PNG, DOCX, ZIP) */}
        <div>
          <label className="block text-sm font-medium mb-1">Attach Digital Files (up to 5) — PDF, JPG, PNG, DOCX, ZIP</label>
          <input
            type="file"
            name="digitalFiles"
            accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.zip,application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/zip"
            multiple
            onChange={handleDigitalFilesUpload}
            className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200"
          />
          {formData.digitalFiles && formData.digitalFiles.length > 0 && (
            <div className="mt-2 bg-black bg-opacity-40 p-2 rounded border border-yellow-700">
              {formData.digitalFiles.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 py-2 border-b border-yellow-800">
                  <div className="text-sm text-yellow-200 truncate">{f.name}</div>
                  <div className="flex items-center gap-3">
                  <div className="text-xs text-yellow-200">{(f.size/1024).toFixed(1)} KB</div>
                  <button
                    type="button"
                    onClick={() => removeDigitalFile(idx)}
                    className="bg-black bg-opacity-70 text-yellow-300 rounded px-2 py-0.5 border border-yellow-700 hover:text-yellow-200"
                    aria-label={`Remove ${f.name}`}
                    title="Remove file"
                  >
                    Remove
                  </button>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video (single) */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200"
          />
          {formData.video && (
            <div className="mt-2 text-gray-300">Selected video: {formData.video.name}</div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
            <option value="New">New</option>
            <option value="Used - Like New">Used - Like New</option>
            <option value="Used - Good">Used - Good</option>
            <option value="Used - Acceptable">Used - Acceptable</option>
          </select>
        </div>

        {/* Import Fees */}
        <div>
          <label className="block text-sm font-medium mb-1">Import Fees (if any)</label>
          <input type="text" name="importFees" value={formData.importFees} onChange={handleChange} placeholder="e.g. 10% or $20" className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
        </div>

        {/* Delivery */}
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Details</label>
          <input type="text" name="delivery" value={formData.delivery} onChange={handleChange} placeholder="Delivery time, carriers, etc." className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
        </div>

        {/* Returns */}
        <div>
          <label className="block text-sm font-medium mb-1">Returns Policy</label>
          <input type="text" name="returnsPolicy" value={formData.returnsPolicy} onChange={handleChange} placeholder="e.g. 14-day returns" className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium mb-1">Payment Methods</label>
          <div className="flex gap-3 flex-wrap">
            {['Credit Card', 'PayPal', ].map((m) => (
              <label key={m} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={formData.paymentMethods.includes(m)} onChange={() => togglePaymentMethod(m)} />
                <span className="text-yellow-200">{m}</span>
              </label>
            ))} 
          </div>
        </div>

        {/* Shipping Options */}
        <div>
          <label className="block text-sm font-medium mb-1">Shipping Options</label>
          <select name="shippingOption" value={formData.shippingOption} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
            <option value="flat">Flat Rate</option>
            <option value="free">Free Shipping</option>
            <option value="calculated">Calculated at checkout</option>
          </select>
          {formData.shippingOption === 'flat' && (
            <input type="text" name="shippingCost" value={formData.shippingCost} onChange={handleChange} placeholder="Flat shipping cost e.g. 10" className="mt-2 w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
          )}
        </div>

        {/* Prices */}
        {formData.auctionType === 'bid' ? (
          <>
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              value={formData.startingPrice}
              onChange={handleChange}
              required
              className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <input
              type="number"
              name="reservePrice"
              placeholder="Reserve Price"
              value={formData.reservePrice}
              onChange={handleChange}
              required
              className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <input
              type="number"
              name="buyNowPrice"
              placeholder="Buy Now Price (Optional)"
              value={formData.buyNowPrice}
              onChange={handleChange}
              className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </>
        ) : (
          // Direct sale: only show Fixed price (required)
          <input
            type="number"
            name="buyNowPrice"
            placeholder="Fixed price"
            value={formData.buyNowPrice}
            onChange={handleChange}
            required
            className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        )}

        {/* Duration - only for bid auctions */}
        {formData.auctionType === 'bid' && (
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        )}

        {/* Auction Type */}
        <select
          name="auctionType"
          value={formData.auctionType}
          onChange={handleChange}
          required
          className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          <option value="bid">Bid</option>
          <option value="sell">Sell Immediately</option>
        </select>

        {/* Shipping */}
        <input
          type="text"
          name="shipping"
          placeholder="Shipping details "
          value={formData.shipping}
          onChange={handleChange}
          className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />

        {/* Date and Time - only for bid auctions (direct sale does not require scheduling) */}
        {formData.auctionType === 'bid' && (
          <div className="flex gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-1/2 border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-yellow-600 text-black px-6 py-2 rounded hover:bg-yellow-500 transition font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Auction...' : 'Create Auction'}
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
