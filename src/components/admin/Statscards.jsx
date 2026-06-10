import { useEffect, useState } from "react";

export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/platform");
      if (!res.ok) {
        throw new Error(`Error fetching stats: ${res.statusText}`);
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loader ease-linear rounded-full border-4 border-current border-t-transparent h-12 w-12"></div>
        <span className="ml-4 text-gray-700">Loading stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow mb-4">
        {error}
      </div>
    );
  }

  const { users = 0, posts = 0, videos = 0 } = stats || {};

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {/* Users Card */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-400">
        <div className="flex items-center space-x-4">
          {/* Icon (e.g., user icon) */}
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path fillRule="evenodd" d="M.458 16.791A9 9 0 0110 2a9 9 0 0110 14.791A7 7 0 0010 9a7 7 0 00-9.542 7.791z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">Users</h2>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{users}</p>
      </div>

      {/* Posts Card */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border-t-4 border-green-400">
        <div className="flex items-center space-x-4">
          {/* Icon (e.g., posts icon) */}
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17 3H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1zM3 2a1 1 0 00-1 1v1h16V3a1 1 0 00-1-1H3zm14 15H3v-2h14v2zm0-4H3v-2h14v2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">Posts</h2>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{posts}</p>
      </div>

      {/* Videos Card */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border-t-4 border-purple-400">
        <div className="flex items-center space-x-4">
          {/* Icon (e.g., video icon) */}
          <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4v12l12-6-12-6z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">Videos</h2>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{videos}</p>
      </div>
    </div>
  );
}