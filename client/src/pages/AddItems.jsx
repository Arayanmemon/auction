import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AddItems = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    title: "",
    description: "",
    startingBid: "",
    images: []
  });

  useEffect(() => {
    const stored = localStorage.getItem(`session-${sessionId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSession(parsed);
      setItems(parsed.items || []);
    }
  }, [sessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => file.name);
    setItem({ ...item, images: files });
  };

  const addItem = () => {
    if (!item.title || !item.startingBid) return;
    const newItem = { ...item, id: Date.now() }; // unique ID
    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Save to session in localStorage immediately
    const updatedSession = { ...session, items: updatedItems };
    localStorage.setItem(`session-${sessionId}`, JSON.stringify(updatedSession));

    setItem({ title: "", description: "", startingBid: "", images: [] });
  };

  const handleSubmitSession = () => {
    // Mark session as pending
    const updatedSession = { ...session, items, status: "pending" };
    localStorage.setItem(`session-${sessionId}`, JSON.stringify(updatedSession));

    navigate(`/session/${sessionId}`);
  };

  if (!session) return <p className="text-center mt-10">Session not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">{session.title}</h2>
        <p>{session.location} — {session.date} {session.time}</p>
        <p className="text-gray-600">{session.description}</p>
      </div>

      {/* Add Item Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Item Title"
          value={item.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={item.description}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-3 py-2"
        ></textarea>
        <input
          type="number"
          name="startingBid"
          placeholder="Starting Bid"
          value={item.startingBid}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={addItem}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Item
        </button>
      </div>

      {/* Preview Items */}
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="border p-3 rounded flex justify-between">
            <span>{it.title} — ${it.startingBid}</span>
            <span className="text-sm text-gray-500">{it.images.length} image(s)</span>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <button
          onClick={handleSubmitSession}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          View Session Items
        </button>
      )}
    </div>
  );
};

export default AddItems;
