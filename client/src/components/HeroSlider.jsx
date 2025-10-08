import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Use first image safely
  const { images, title, description, id } = slides[current] || {};
  const backgroundImage = images?.[0] || "";

  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[500px] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img src={backgroundImage} alt="Hero" className="w-full h-full object-cover opacity-30" />
      </div>
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-white mb-8 drop-shadow-lg tracking-wide" style={{textShadow:'0 2px 16px #000'}}>
          Your Premier Marketplace
        </h1>
        <div className="flex gap-6 justify-center mb-10">
          <button
            onClick={() => navigate('/auctions')}
            className="bg-yellow-600 text-black font-bold px-8 py-4 rounded-lg text-xl shadow-lg border-2  hover:bg-yellow-500 transition"
          >
            Start Bidding
          </button>
          <Link
            to="/sell"
            className="border-2 border-yellow-600 text-yellow-600 font-bold px-8 py-4 rounded-lg text-xl shadow-lg hover:bg-yellow-600 hover:text-black transition"
            // style={{boxShadow:'0 2px 16px #d4af37'}}
          >
            Sell Your Item
          </Link>
        </div>
        {/* <nav className="flex justify-center gap-6 text-gold text-lg mt-4">
          {['Jewelry','Watches','Art','Collectibles','Electronics','Fashion'].map(cat => (
            <button key={cat} className="hover:text-yellow-400 flex items-center gap-1">{cat}</button>
          ))}
        </nav> */}
      </div>
      {/* Prev/Next Buttons */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow hover:bg-yellow-400 transition"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow hover:bg-yellow-400 transition"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full border-2 transition ${
              current === index
                ? "bg-gold border-yellow-400"
                : "bg-black border-gold hover:bg-yellow-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
