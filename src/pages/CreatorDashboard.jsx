import { useEffect, useState } from "react";
import Layout from "../components/layout/MainLayout";

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
      <h1 className="text-3xl font-bold mb-6">Creator Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="mb-2">Total Followers</h3>
          <h1 className="text-4xl font-bold">{stats.followers}</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="mb-2">Total Gifts</h3>
          <h1 className="text-4xl font-bold">{stats.gifts}</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="mb-2">Total Coins</h3>
          <h1 className="text-4xl font-bold">{stats.coins}</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="mb-2">Live Viewers</h3>
          <h1 className="text-4xl font-bold">{stats.viewers}</h1>
        </div>
      </div>
    </Layout>
  );
}