import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useCategory } from "../CategoryContext";
import { useAuthContext } from "../contexts/AuthContext";

const categories = ["All", "Cars", "Phones", "Computers", "Collectibles", "Electronics"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategory();
  
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
    <nav className="bg-white shadow fixed top-0 w-full z-50">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[rgb(0,78,102)]">
          <img src="/vertex.png" alt="Vertex111" className="h-8 inline-block mr-2" />
          Vertex111
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center relative">
          <Link to="/" className="hover:text-[rgb(0,78,102)]">Home</Link>

          {/* Auctions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[rgb(0,78,102)]">
              Auctions <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-44 bg-white shadow-md rounded border text-sm">
                <Link to="/auctions?type=upcoming" className="block px-4 py-2 hover:bg-gray-100">Upcoming Auctions</Link>
                <Link to="/auctions?type=past" className="block px-4 py-2 hover:bg-gray-100">Past Auctions</Link>
              </div>
            )}
          </div>

          {/* Session (Seller feature) */}
          {user?.role === "seller" && (
            <Link to="/create-session" className="hover:text-[rgb(0,78,102)]">
              Create Session
            </Link>
          )}

          {/* Dashboard link (Buyer or Seller) */}
          {user && (
            <Link
              to={user.is_seller ? "/seller-dashboard" : "/dashboard"}
              className="hover:text-[rgb(0,78,102)]"
            >
              {user.is_seller ? "Seller Dashboard" : "Buyer Dashboard"}
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[rgb(0,78,102)] font-medium">
                Hi, {user.firstName || user.email}
              </span>
              <button
                onClick={logout}
                className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-[rgb(0,78,102)] text-[rgb(0,78,102)]">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition"
              >
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col px-4 py-2 gap-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-[rgb(0,78,102)]">Home</Link>
            <Link to="/auctions?type=upcoming" onClick={() => setIsOpen(false)} className="hover:text-[rgb(0,78,102)]">Upcoming Auctions</Link>
            <Link to="/auctions?type=past" onClick={() => setIsOpen(false)} className="hover:text-[rgb(0,78,102)]">Past Auctions</Link>

            {/* Show Create Session if seller */}
            {user?.role === "seller" && (
              <Link to="/create-session" onClick={() => setIsOpen(false)} className="hover:text-[rgb(0,78,102)]">
                Create Session
              </Link>
            )}

            {/* Dashboard */}
            {user && (
              <Link
                to={user.role === "seller" ? "/seller-dashboard" : "/dashboard"}
                onClick={() => setIsOpen(false)}
                className="hover:text-[rgb(0,78,102)]"
              >
                {user.role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)] transition text-center"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-[rgb(0,78,102)]">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded text-center hover:bg-[rgb(0,90,115)] transition"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Categories Bar (only on Home) */}
      {location.pathname === "/" && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 flex gap-6 overflow-x-auto py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`pb-1 border-b-2 text-sm font-medium ${
                  selectedCategory === cat
                    ? "border-[rgb(0,78,102)] text-[rgb(0,78,102)]"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
