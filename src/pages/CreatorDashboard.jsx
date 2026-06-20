import { useEffect, useState } from "react";


export default function CreatorDashboard() {
  const [stats, setStats] = useState({
    followers: 0,
    gifts: 0,
    coins: 0,
    viewers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Replace this with your data fetching logic
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        // Example: fetch data from API
        // const res = await fetch('/api/creator-stats');
        // const data = await res.json();
        // setStats(data);
        
        // Dummy data for demonstration
        setTimeout(() => {
          setStats({
            followers: 1234,
            gifts: 56,
            coins: 7890,
            viewers: 45,
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load stats");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <p className="text-center text-gray-600">Loading...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <p className="text-center text-red-600">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1e2732] p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Followers</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.followers}</p>
        </div>
        <div className="bg-white dark:bg-[#1e2732] p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Gifts Received</h2>
          <p className="text-3xl font-bold text-green-600">{stats.gifts}</p>
        </div>
        <div className="bg-white dark:bg-[#1e2732] p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Coins Earned</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.coins}</p>
        </div>
        <div className="bg-white dark:bg-[#1e2732] p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Current Viewers</h2>
          <p className="text-3xl font-bold text-red-600">{stats.viewers}</p>
        </div>
      </div>
    </Layout>
  );
}