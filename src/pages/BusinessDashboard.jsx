import { useState } from "react";
import BusinessStats from "../components/business/BusinessStats";
import BusinessCard from "../components/business/BusinessCard";

export default function BusinessDashboard() {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data fetch
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Business Dashboard</h1>
        <div className="space-x-3">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Add New Business
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "active" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "inactive" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("inactive")}
        >
          Inactive
        </button>
      </div>

      {/* Stats & Cards */}
      <BusinessStats />
      <div className="mt-8">
        <BusinessCard filter={filter} />
      </div>
    </div>
  );
}