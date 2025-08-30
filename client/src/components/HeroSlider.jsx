import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  return (
    <section className="relative w-full">
      {/* Background */}
      <div
        className="w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-center bg-cover transition-all duration-700"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-opacity-50"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl drop-shadow">
            {description}
          </p>
        <Link
  to={`/auctions/${id}`}
  className="bg-[rgb(0,78,102)] text-white px-6 py-3 rounded font-semibold hover:bg-[rgb(0,90,115)] transition"
>
  View Auction
</Link>

        </div>

        {/* Prev Button */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[rgb(0,78,102)] hover:bg-[rgb(0,90,115)] text-white p-2 rounded-full transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Button */}
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[rgb(0,78,102)] hover:bg-[rgb(0,90,115)] text-white p-2 rounded-full transition"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index
                  ? "bg-[rgb(0,78,102)]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
