import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import categoryAuctionsJson from "../data/categoryAuctions.json";

// Use section names from categoryAuctions.json
const categories = ["", ...Object.keys(categoryAuctionsJson)];

const CreateSession = () => {
  // formData keys map directly to DB auctions table columns
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    images: [], // client preview objects {file, url}
    digital_files: [], // client preview objects {file, name, size}
    quantity: 1,
    video: null,
    starting_price: "",
    reserve_price: "",
    buy_now_price: "",
    // start_time / end_time will be computed from date/time/duration UI fields
    start_time: "",
    end_time: "",
    condition: "good", // values: new, like_new, good, acceptable
    shipping_method: "flat", // flat|free|checkout
    shipping_cost: "",
    shipping_details: "",
    shipping_locations: "",
  return_policy: "",
  auctionType: 'bid',
  // Auction flow controls
  minimum_bid_increment: "1.00",
  auto_extend: 0,
  extend_threshold_minutes: 5,
  extend_by_minutes: 5,
    // server-side defaults (we include them for completeness)
    current_bid: 0,
    bid_count: 0,
    status: 'draft',
    views_count: 0,
    watchers_count: 0,
    is_featured: 0,
    auto_relist: 0,
    featured_until: null,
    is_bid: 1 // default to bid auctions
  });
  // UI-only payment methods (not stored on auctions table) kept local
  const [paymentMethods, setPaymentMethods] = useState([]);
  // UI-only fields
  const [duration, setDuration] = useState('7');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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
        setFormData((prev) => ({ ...prev, auctionType: value, is_bid: 0, starting_price: '', reserve_price: '' }));
        return;
      }
      // switching to bid
      setFormData((prev) => ({ ...prev, auctionType: value, is_bid: 1 }));
      return;
    }

    // Numeric inputs that come as strings can be coerced later; keep raw for now
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePaymentMethod = (m) => {
    setPaymentMethods((prev) => {
      if (prev.includes(m)) return prev.filter((x) => x !== m);
      return [...prev, m];
    });
  };

  // (payment methods removed - not part of auctions table)

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
  const existing = formData.digital_files || [];
    const spaceLeft = Math.max(0, 5 - existing.length);
    const toAdd = filtered.slice(0, spaceLeft);
  const added = toAdd.map((file) => ({ file, name: file.name, size: file.size }));
  const combined = [...existing, ...added];
  setFormData({ ...formData, digital_files: combined });
    if (files.length > spaceLeft) {
      setError('You can upload up to 5 digital files only. Extra files were ignored.');
    }

    // Clear the input so user can pick more files later (including same file)
    try { e.target.value = ''; } catch (err) {}
  };

  const removeDigitalFile = (index) => {
    const arr = [...formData.digital_files];
    arr.splice(index, 1);
    setFormData({ ...formData, digital_files: arr });
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
      if (Number(formData.is_bid) === 1) {
        if (!formData.starting_price || !formData.reserve_price) {
          setError('Starting price and reserve price are required for bid auctions.');
          setLoading(false);
          return;
        }
      } else {
        if (!formData.buy_now_price) {
          setError('Fixed price is required for direct sale.');
          setLoading(false);
          return;
        }
      }
      // Prepare form data for backend
      const auctionData = new FormData();
      // Calculate start and end times depending on auction type
      let startDateTime;
      if (date && time) {
        startDateTime = new Date(`${date}T${time}`);
      } else {
        startDateTime = new Date();
      }
      if (Number(formData.is_bid) === 1) {
        const endDateTime = new Date(startDateTime);
        endDateTime.setDate(endDateTime.getDate() + parseInt(duration || '7'));
        auctionData.append('start_time', startDateTime.toISOString());
        auctionData.append('end_time', endDateTime.toISOString());
      } else {
        auctionData.append('start_time', startDateTime.toISOString());
      }
      auctionData.append('title', formData.title);
      auctionData.append('description', formData.description);
      if (Number(formData.is_bid) === 1) {
        auctionData.append('starting_price', formData.starting_price);
        auctionData.append('reserve_price', formData.reserve_price);
        auctionData.append('buy_now_price', formData.buy_now_price || '');
      } else {
        auctionData.append('buy_now_price', formData.buy_now_price);
      }
  // (start_time and end_time were appended above depending on auctionType)
      // Use exact DB column names from auctions table where applicable (read from formData keys)
      auctionData.append('shipping_details', formData.shipping_details || '');
  auctionData.append('shipping_locations', formData.shipping_locations || '');
      auctionData.append('condition', (formData.condition || '').toLowerCase());
      auctionData.append('return_policy', formData.return_policy || '');
      auctionData.append('shipping_method', formData.shipping_method || 'flat');
      auctionData.append('shipping_cost', formData.shipping_cost || 0);
      auctionData.append('category_id', formData.category_id || 1);
      auctionData.append('quantity', formData.quantity || 1);
      auctionData.append('current_bid', formData.current_bid ?? 0);
      auctionData.append('bid_count', formData.bid_count ?? 0);
      auctionData.append('status', formData.status || 'draft');
      auctionData.append('views_count', formData.views_count ?? 0);
      auctionData.append('watchers_count', formData.watchers_count ?? 0);
      auctionData.append('is_featured', formData.is_featured ? 1 : 0);
      auctionData.append('auto_relist', formData.auto_relist ? 1 : 0);
  // Auction flow controls
  auctionData.append('minimum_bid_increment', formData.minimum_bid_increment || '1.00');
  auctionData.append('auto_extend', Number(formData.auto_extend) ? 1 : 0);
  auctionData.append('extend_threshold_minutes', formData.extend_threshold_minutes || 5);
  auctionData.append('extend_by_minutes', formData.extend_by_minutes || 5);
      if (formData.featured_until) auctionData.append('featured_until', formData.featured_until);
      // If video present, append it
      if (formData.video) {
        auctionData.append('video', formData.video);
      }
      // Append digital files if present
      if (formData.digital_files && formData.digital_files.length > 0) {
        for (let i = 0; i < formData.digital_files.length; i++) {
          auctionData.append('digital_files[]', formData.digital_files[i].file);
        }
      }
      auctionData.append('is_bid', Number(formData.is_bid) ? 1 : 0);
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
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/seller-dashboard')}
          aria-label="Back to seller dashboard"
          className="text-yellow-300 text-2xl hover:text-yellow-200 bg-transparent p-1 rounded"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-yellow-400">Create New Auction</h1>
      </div>

      {error && (
        <div className="max-w-2xl mb-4 p-4 bg-red-800 text-red-200 rounded border border-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg shadow-lg border border-yellow-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          {/* Description - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe the auction"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            ></textarea>
          </div>

          {/* Category & Quantity - side by side */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600">
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={cat} value={idx === 0 ? '' : cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input type="number" name="quantity" min={1} value={formData.quantity} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600" />
          </div>

          {/* Condition & Auction Type - side by side */}
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="acceptable">Acceptable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Auction Type</label>
            <select name="auctionType" value={formData.auctionType} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
              <option value="bid">Bid</option>
              <option value="sell">Sell Immediately</option>
            </select>
          </div>

          {/* Images (full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Upload Images (up to 10)</label>
            <input type="file" name="images" accept="image/*" multiple onChange={handleImageUpload} className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200" />
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.images.map((imgObj, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <img src={imgObj.url} alt={`preview-${index}`} className="w-16 h-16 object-cover rounded border border-yellow-700" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-black bg-opacity-70 text-yellow-300 rounded-full w-6 h-6 flex items-center justify-center border border-yellow-700 hover:text-yellow-200" title="Remove image">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Digital files (full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Attach Digital Files (up to 5) — PDF, JPG, PNG, DOCX, ZIP</label>
            <input type="file" name="digital_files" accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.zip,application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/zip" multiple onChange={handleDigitalFilesUpload} className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200" />
            {formData.digital_files && formData.digital_files.length > 0 && (
              <div className="mt-2 bg-black bg-opacity-40 p-2 rounded border border-yellow-700">
                {formData.digital_files.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 py-2 border-b border-yellow-800">
                    <div className="text-sm text-yellow-200 truncate">{f.name}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-yellow-200">{(f.size/1024).toFixed(1)} KB</div>
                      <button type="button" onClick={() => removeDigitalFile(idx)} className="bg-black bg-opacity-70 text-yellow-300 rounded px-2 py-0.5 border border-yellow-700 hover:text-yellow-200" aria-label={`Remove ${f.name}`} title="Remove file">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Video (optional)</label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="border border-yellow-700 rounded px-3 py-2 w-full bg-black bg-opacity-60 text-yellow-200" />
            {formData.video && (<div className="mt-2 text-gray-300">Selected video: {formData.video.name}</div>)}
          </div>

          {/* Shipping Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Shipping Details</label>
            <input type="text" name="shipping_details" value={formData.shipping_details} onChange={handleChange} placeholder="Delivery time, carriers, etc." className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
          </div>

          {/* Returns */}
          <div>
            <label className="block text-sm font-medium mb-1">Returns Policy</label>
            <input type="text" name="return_policy" value={formData.return_policy} onChange={handleChange} placeholder="e.g. 14-day returns" className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
          </div>

          {/* Shipping Options */}
          <div>
            <label className="block text-sm font-medium mb-1">Shipping Options</label>
            <select name="shipping_method" value={formData.shipping_method} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
              <option value="flat">Flat Rate</option>
              <option value="free">Free Shipping</option>
              <option value="checkout">Calculated at checkout</option>
            </select>
            {formData.shipping_method === 'flat' && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Shipping Cost</label>
                <input type="text" name="shipping_cost" value={formData.shipping_cost} onChange={handleChange} placeholder="Flat shipping cost e.g. 10" className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
            )}
          </div>

          {/* Shipping Locations */}
          <div>
            <label className="block text-sm font-medium mb-1">Shipping Locations</label>
            <input type="text" name="shipping_locations" placeholder="Shipping locations (e.g. US,CA,GB)" value={formData.shipping_locations} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated country codes (server may accept JSON).</p>
          </div>

          {/* Prices - Starting / Reserve or Buy Now */}
          {formData.auctionType === 'bid' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Starting Price</label>
                <input type="number" name="starting_price" placeholder="Starting Price" value={formData.starting_price} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reserve Price</label>
                <input type="number" name="reserve_price" placeholder="Reserve Price" value={formData.reserve_price} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Buy Now Price (Optional)</label>
                <input type="number" name="buy_now_price" placeholder="Buy Now Price (Optional)" value={formData.buy_now_price} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Buy Now Price</label>
              <input type="number" name="buy_now_price" placeholder="Buy Now Price" value={formData.buy_now_price} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
            </div>
          )}

          {/* Auction flow controls: Minimum bid increment and Auto-extend */}
          {formData.auctionType === 'bid' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Bid Increment</label>
                <input type="text" name="minimum_bid_increment" value={formData.minimum_bid_increment} onChange={handleChange} placeholder="e.g. 1.00" className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Auto-extend (minutes)</label>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-medium mb-1">Extend threshold (min)</label>
                    <input type="number" name="extend_threshold_minutes" value={formData.extend_threshold_minutes} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium mb-1">Extend by (min)</label>
                    <input type="number" name="extend_by_minutes" value={formData.extend_by_minutes} onChange={handleChange} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" name="auto_extend" checked={Number(formData.auto_extend) === 1} onChange={(e) => setFormData((p) => ({ ...p, auto_extend: e.target.checked ? 1 : 0 }))} className="accent-yellow-500" />
                  <span className="text-yellow-200">Enable auto-extend</span>
                </label>
              </div>
            </>
          )}

          {/* Duration */}
          {formData.auctionType === 'bid' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200">
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          )}

          {/* Auction Type (already present above in side-by-side grouping) */}

          {/* Date and Time */}
          {formData.auctionType === 'bid' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full border border-yellow-700 rounded px-3 py-2 bg-black bg-opacity-60 text-yellow-200" />
              </div>
            </>
          )}

          {/* Submit - full width */}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className={`bg-yellow-600 text-black px-6 py-2 rounded hover:bg-yellow-500 transition font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Creating Auction...' : 'Create Auction'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSession;
