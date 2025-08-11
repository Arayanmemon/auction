import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const BecomeSeller = () => {
  const { becomeSeller } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    becomeSeller();
    navigate("/seller-dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-[rgb(0,78,102)]">
        Become a Seller
      </h1>
      <p className="text-gray-600 mb-4">
        Upgrade your account to start listing and selling items on the platform.
      </p>
      <button
        onClick={handleUpgrade}
        className="bg-[rgb(0,78,102)] text-white px-6 py-3 rounded hover:bg-[rgb(0,90,115)] transition"
      >
        Upgrade to Seller
      </button>
    </div>
  );
};

export default BecomeSeller;
