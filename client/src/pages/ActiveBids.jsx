import React from "react";
import DataTable from "../components/DataTable";

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-700">
          <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
          <pre className="bg-red-100 p-2 rounded">{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ActiveBids = ({ bids = [] }) => (
  <ErrorBoundary>
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Active Bids</h1>
      <p className="text-gray-700 mb-4">Your current active bids will be shown here.</p>
      <DataTable
        columns={[
          { key: "item", header: "Item" },
          { key: "bid", header: "Your Bid" },
          { key: "status", header: "Status" }
        ]}
        data={bids.map(bid => ({
          item: bid.auction.title,
          bid: `$${bid.amount}`,
          status: bid.is_winning ? "Winning" : "Outbid"
        }))}
        emptyMessage="No active bids yet."
      />
    </div>
  </ErrorBoundary>
);

export default ActiveBids;
