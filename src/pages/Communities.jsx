import { useEffect, useState } from "react";
import CommunityCard from "../components/communities/CommunityCard";
import CreateCommunityModal from "../components/communities/CreateCommunityModal";
import { getCommunities } from "../services/communityService";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCommunities();
      setCommunities(res.data.communities);
    } catch (err) {
      setError("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  // Handle community creation success
  const handleCommunityCreated = (newCommunity) => {
    // Option 1: Re-fetch list
    fetchCommunities();

    // Option 2: Optimistic update (uncomment if preferred)
    // setCommunities(prev => [newCommunity, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Communities</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          Create Community
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center my-4 text-gray-600">Loading communities...</div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Communities grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCommunityCreated} // Pass handler to update list
      />
    </div>
  );
}