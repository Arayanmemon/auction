import { useEffect, useState } from "react";
import { heroAuctions } from "../data/heroAuctions";
import { categoryAuctions } from "../data/categoryAuctions";
import AuctionCard from "../components/AuctionCard";
import ItemCard from "../components/ItemCard";
import { itemCategories } from "../data/itemCategories";
import HeroSlider from "../components/HeroSlider";
import CategoriesBar from "../components/CategoriesBar";
import { useCategory } from "../CategoryContext";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import { useSearchBar } from "../contexts/SearchBarContext";
const Home = () => {
  const { selectedCategory } = useCategory();
  const [auctions, setAuctions] = useState([]);

  // Filter auctions safely
  const { searchBarOpen, setSearchBarOpen } = useSearchBar();
  const [searchValue, setSearchValue] = useState("");
  // Prefer backend auctions, fallback to mock data if none
  const filteredAuctions =
    selectedCategory === "All"
      ? (auctions.length > 0 ? auctions : Object.values(categoryAuctions).flat())
      : (auctions.filter((a) => a.category === selectedCategory).length > 0
          ? auctions.filter((a) => a.category === selectedCategory)
          : categoryAuctions[selectedCategory] || []);

  // Filter auctions for each section
  const bidAuctions = filteredAuctions.filter(a => a.is_bid);
  const buyNowItems = filteredAuctions.filter(a => !a.is_bid);

  // Show only first 4 auctions/items on homepage
  const previewAuctions = bidAuctions.slice(0, 4);
  const previewBuyItems = buyNowItems.slice(0, 4);
  console.log("Preview Buy Items:", previewBuyItems);
  console.log("All Buy Now Items:", buyNowItems);

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

      {/* Categories Bar (after HeroSlider) */}
      <CategoriesBar />

      {/* Buy Now Items Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Buy Now Items</h2>
          <Link
            to="/items"
            className="text-white hover:underline text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {previewBuyItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Auctions Section */}
      <section id="auctions-section" className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory} Auctions
          </h2>
          {/* View All Link */}
          <Link
            to="/auctions"
            className="text-white hover:underline text-sm font-medium"
          >
            View All
          </Link>
        </div>
        {previewAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {previewAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No auctions available in this category.
          </p>
        )}
      </section>

      {searchBarOpen && (
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClose={() => setSearchBarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
