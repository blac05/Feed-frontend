import { useEffect, useState } from "react";
import ReelCard from "./ReelCard";
import { getReels } from "../../services/videoService";

export default function ReelFeed() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReels();
      setReels(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch reels:", err);
      setError("Failed to load reels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading reels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={loadReels}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <ReelCard key={reel._id} reel={reel} />
      ))}
    </div>
  );
}