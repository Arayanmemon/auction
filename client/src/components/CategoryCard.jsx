import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/auctions?category=${category.name}`}
      className="border rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3 text-center">
        <h3 className="font-semibold text-gray-800">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
