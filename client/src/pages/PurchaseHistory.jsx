import React from "react";
import DataTable from "../components/DataTable";

const PurchaseHistory = () => (
  <div className="container mx-auto py-16">
    <h1 className="text-3xl font-bold mb-6">Purchase History</h1>
    <p className="text-gray-700 mb-4">Your completed purchases will be listed here.</p>
    <DataTable
      columns={[{ key: "item", header: "Item" }, { key: "price", header: "Price" }, { key: "date", header: "Date" }]}
      data={[]}
      emptyMessage="No purchases yet."
    />
  </div>
);

export default PurchaseHistory;
