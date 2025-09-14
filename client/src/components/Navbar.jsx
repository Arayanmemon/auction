import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useCategory } from "../CategoryContext";
import { useAuthContext } from "../contexts/AuthContext";
import { useSearchBar } from "../contexts/SearchBarContext";

const categories = ["All", "Cars", "Phones", "Computers", "Collectibles", "Electronics"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategory();
  const { searchBarOpen, setSearchBarOpen } = useSearchBar();
  const [searchValue, setSearchValue] = useState("");
  
  // Add null check and default values
  const authContext = useAuthContext();
  const { user, logout } = authContext || { user: null, logout: () => {} };

  const location = useLocation();
  const navigate = useNavigate();

  // Handle category click (scroll or navigate)
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);

    if (location.pathname !== "/") {
      navigate("/#auctions-section");
    } else {
      const section = document.getElementById("auctions-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
  <nav className="bg-black bg-opacity-80 fixed top-0 w-full z-50 font-serif">
      {/* Top Navbar */}
  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-widest text-yellow-600 font-serif flex items-center gap-2">
          <img src="/vertex.png" alt="Vertex111" className="h-8 inline-block mr-2" />
          VERTEX111
        </Link>

        {/* Desktop Menu */}
  <div className="hidden md:flex gap-8 items-center relative">
          {/* <Link to="/" className="hover:text-[rgb(0,78,102)]">Home</Link> */}

          {/* Main Menus: Browse, Buy, Sell */}
          <button
            className="text-gold text-lg font-semibold hover:text-yellow-400"
            onClick={() => setSearchBarOpen((open) => !open)}
          >
            Browse
          </button>
          {searchBarOpen && (
            <div className="ml-4 w-64">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search items, products, auctions..."
                className="w-full px-4 py-2 bg-black bg-opacity-60 text-yellow-500 border border-yellow-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-base placeholder-yellow-700 shadow"
                autoFocus
              />
            </div>
          )}
          <Link to="/items" className="text-gold text-lg font-semibold hover:text-yellow-400">Buy</Link>
          <Link to="/sell" className="text-gold text-lg font-semibold hover:text-yellow-400">Sell</Link>

          {/* Session (Seller feature) */}
          {user?.role === "seller" && (
            <Link to="/create-session" className="text-gold text-lg font-semibold hover:text-yellow-400">
              Create Session
            </Link>
          )}

          {/* Dashboard link (Buyer or Seller) */}
          {user && (
            <Link
              to={user.is_seller ? "/seller-dashboard" : "/dashboard"}
              className="text-gold text-lg font-semibold hover:text-yellow-400"
            >
              {user.is_seller ? "Seller Dashboard" : "Buyer Dashboard"}
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-yellow-600 font-medium">
                Hi, {user.firstName || user.email}
              </span>
              <button
                onClick={logout}
                className="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gold text-lg font-semibold hover:text-yellow-400">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold"
              >
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-yellow-600" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-95 border-t border-yellow-600 shadow-lg">
          <div className="flex flex-col px-4 py-2 gap-2">
            <Link to="/browse" onClick={() => setIsOpen(false)} className="text-gold text-lg font-semibold hover:text-yellow-400">Browse</Link>
            <Link to="/auctions" onClick={() => setIsOpen(false)} className="text-gold text-lg font-semibold hover:text-yellow-400">Buy</Link>
            <Link to="/sell" onClick={() => setIsOpen(false)} className="text-gold text-lg font-semibold hover:text-yellow-400">Sell</Link>
            {user?.role === "seller" && (
              <Link to="/create-session" onClick={() => setIsOpen(false)} className="text-gold text-lg font-semibold hover:text-yellow-400">
                Create Session
              </Link>
            )}
            {user && (
              <Link
                to={user.role === "seller" ? "/seller-dashboard" : "/dashboard"}
                onClick={() => setIsOpen(false)}
                className="text-gold text-lg font-semibold hover:text-yellow-400"
              >
                {user.role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold text-center"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-gold text-lg font-semibold hover:text-yellow-400">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-yellow-600 text-black px-4 py-2 rounded text-center hover:bg-yellow-500 transition font-semibold"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}


    </nav>
  );
};

export default Navbar;
