import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

// Dummy categories (later fetch from backend)
const categories = ["Cars", "Phones", "Computers", "Collectibles", "Electronics"];

const CreateSession = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    images: [],
    startingPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    duration: "7",
    shipping: "",
    location: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthContext();

  const navigate = useNavigate();

  // Handle text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: newImages });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calculate start and end times
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setDate(endDateTime.getDate() + parseInt(formData.duration));

      // Prepare form data for backend
      const auctionData = new FormData();
      auctionData.append('title', formData.title);
      auctionData.append('description', formData.description);
      // auctionData.append('category', formData.category);
      auctionData.append('starting_price', formData.startingPrice);
      auctionData.append('reserve_price', formData.reservePrice);
      auctionData.append('buy_now_price', formData.buyNowPrice || '');
      auctionData.append('start_time', startDateTime.toISOString());
      auctionData.append('end_time', endDateTime.toISOString());
      auctionData.append('shipping', formData.shipping);
      auctionData.append('location', formData.location);
      auctionData.append('category_id', 1);
      // Handle image files
      const imageFiles = document.querySelector('input[type="file"]').files;
      for (let i = 0; i < imageFiles.length; i++) {
        auctionData.append('images[]', imageFiles[i]);
      }

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/seller/auction/create`, {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>

      {error && (
        <div className="max-w-2xl mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-lg shadow space-y-4"
      >
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Auction Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe the auction"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        ></textarea>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
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
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border rounded px-3 py-2 w-full"
          />
          {formData.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {formData.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Prices */}
        <input
          type="number"
          name="startingPrice"
          placeholder="Starting Price"
          value={formData.startingPrice}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />
        <input
          type="number"
          name="reservePrice"
          placeholder="Reserve Price"
          value={formData.reservePrice}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />
        <input
          type="number"
          name="buyNowPrice"
          placeholder="Buy Now Price (Optional)"
          value={formData.buyNowPrice}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        />

        {/* Duration */}
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
        >
          <option value="3">3 Days</option>
          <option value="7">7 Days</option>
          <option value="14">14 Days</option>
          <option value="30">30 Days</option>
        </select>

        {/* Shipping */}
        <input
          type="text"
          name="shipping"
          placeholder="Shipping details (cost or conditions)"
          value={formData.shipping}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
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

        {/* Date and Time */}
        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,78,102)]"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[rgb(0,78,102)] text-white px-6 py-2 rounded hover:bg-[rgb(0,90,115)] transition ${
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
