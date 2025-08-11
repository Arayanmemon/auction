import { heroAuctions } from "../data/heroAuctions"; // Replace later with seller-specific data
import AuctionCard from "../components/AuctionCard";

const SellerDashboard = () => {
  // Filter auctions owned by seller (dummy: all for now)
  const myAuctions = heroAuctions;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <a
          href="/create-session"
          className="bg-[rgb(0,78,102)] text-white px-4 py-2 rounded hover:bg-[rgb(0,90,115)]"
        >
          Create Auction
        </a>
      </div> 

      {myAuctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No auctions listed yet.</p>
      )}

      {/* Commission summary (dummy calculation) */}
      <div className="mt-10 bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold mb-2">Commission Report</h3>
        <p className="text-gray-600 text-sm">
          Platform commission is 10% of final bid price. This will be deducted automatically.
        </p>
      </div>
    </div>
  );
};

export default SellerDashboard;
