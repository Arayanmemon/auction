import React from "react";
import DataTable from "../components/DataTable";

const Watchlist = ({ items = [] }) => (
  <div className="container mx-auto py-16">
    <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
    <p className="text-gray-700 mb-4">Items you are watching will appear here.</p>
    <DataTable
      columns={[{ key: "item", header: "Item" }, { key: "currentBid", header: "Current Bid" }, { key: "endTime", header: "Ends" }]}
      data={items.map(item => ({
        item: item.auction.title,
        currentBid: `$${item.auction.highest_bid?.amount || item.auction.starting_price}`,
        endTime: new Date(item.auction.end_time).toLocaleDateString()
      }))}
      emptyMessage="No items in watchlist."
    />
  </div>
);

export default Watchlist;
