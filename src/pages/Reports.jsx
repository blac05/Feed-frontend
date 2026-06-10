import { useState, useEffect } from "react";
import ReportsTable from "../components/admin/ReportsTable";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example effect to simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetch delay or replace with actual fetch if needed
        // await fetchReports();
        setLoading(false);
      } catch (err) {
        setError("Failed to load reports");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Reports</h1>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {!loading && !error && (
        <ReportsTable />
      )}
    </div>
  );
}