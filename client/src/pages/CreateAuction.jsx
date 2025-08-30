// import { useState } from "react";

// const CreateAuction = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     startingBid: "",
//     endTime: "",
//     images: []
//   });

//   const [pending, setPending] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     // For now just save file names (backend will handle actual uploads later)
//     const files = Array.from(e.target.files).map((file) => file.name);
//     setFormData({ ...formData, images: files });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Auction Data Submitted:", formData);

//     // Simulate pending approval
//     setPending(true);

//     // Here, you’ll later send POST request to backend:
//     // axios.post("/api/auctions", formData)
//   };

//   if (pending) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
//         <h2 className="text-2xl font-bold text-green-600 mb-2">
//           Auction Submitted!
//         </h2>
//         <p className="text-gray-600">
//           Your auction is pending admin approval. You’ll be notified once it’s live.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Create Auction</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="max-w-2xl bg-white p-6 rounded-lg shadow space-y-4"
//       >
//         {/* Title */}
//         <input
//           type="text"
//           name="title"
//           placeholder="Auction Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Description */}
//         <textarea
//           name="description"
//           placeholder="Auction Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//           rows="4"
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         ></textarea>

//         {/* Starting Bid */}
//         <input
//           type="number"
//           name="startingBid"
//           placeholder="Starting Bid (USD)"
//           value={formData.startingBid}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* End Time */}
//         <input
//           type="datetime-local"
//           name="endTime"
//           value={formData.endTime}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Image Upload */}
//         <input
//           type="file"
//           multiple
//           onChange={handleImageChange}
//           className="w-full border rounded px-3 py-2"
//         />
//         {formData.images.length > 0 && (
//           <p className="text-sm text-gray-500">
//             {formData.images.length} image(s) selected
//           </p>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Submit Auction
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateAuction;
