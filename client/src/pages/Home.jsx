import { useEffect, useState } from "react";
import { heroAuctions } from "../data/heroAuctions";
import AuctionCard from "../components/AuctionCard";
import HeroSlider from "../components/HeroSlider";
import { useCategory } from "../CategoryContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { selectedCategory } = useCategory();
  const [auctions, setAuctions] = useState([]);

  // Filter auctions safely
  const filteredAuctions =
    selectedCategory === "All"
      ? heroAuctions
      : heroAuctions.filter((a) => a.category && a.category === selectedCategory);

  // Scroll to auctions-section if hash present in URL
  useEffect(() => {
    if (window.location.hash === "#auctions-section") {
      const section = document.getElementById("auctions-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auctions/all`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        setAuctions(data.data || data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchSellerAuctions();
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider slides={heroAuctions} />

      {/* Auctions Section */}
      <section id="auctions-section" className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory} Auctions
          </h2>

          {/* View All Link */}
          <Link
            to="/auctions"
            className="text-[rgb(0,78,102)] hover:underline text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No auctions available in this category.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
