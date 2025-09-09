import React from "react";
import DataTable from "../components/DataTable";

const ActiveBids = () => (
  <div className="container mx-auto py-16">
    <h1 className="text-3xl font-bold mb-6">Active Bids</h1>
    <p className="text-gray-700 mb-4">Your current active bids will be shown here.</p>
    <DataTable
      columns={[{ key: "item", header: "Item" }, { key: "bid", header: "Your Bid" }, { key: "status", header: "Status" }]}
      data={[]}
      emptyMessage="No active bids yet."
    />
  </div>
);

export default ActiveBids;
