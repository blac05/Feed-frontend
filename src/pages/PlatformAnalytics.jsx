import React, { useState, useEffect } from 'react';
import StatsCards from "../components/admin/StatsCards";

export default function PlatformAnalytics() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);

  // Fetch data based on date range
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      const response = await fetch(`/api/analytics?start=${dateRange.start}&end=${dateRange.end}`);
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Analytics</h1>
          <p className="text-gray-600 text-lg">Overview of key platform metrics and insights.</p>
        </div>
        {/* Date Range Picker */}
        <div className="flex space-x-2 mt-4 md:mt-0">
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </div>
      </header>

      {/* StatsCards component with data */}
      {statsData ? (
        <StatsCards data={statsData} />
      ) : (
        <p className="text-center text-gray-500">Select a date range to view analytics.</p>
      )}
    </div>
  );
}