import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EpisodeCard from "../components/podcasts/EpisodeCard";
import api from "../api/axios";

export default function PodcastPlayer() {
  const { id } = useParams();

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEpisodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/podcasts/${id}`);
      setEpisodes(res.data.episodes || []);
    } catch (err) {
      setError("Failed to load episodes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [id]);

  const filteredEpisodes = episodes.filter((episode) =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Podcast Episodes</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search episodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="text-center mb-4">Loading episodes...</div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={fetchEpisodes}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Episodes
      </button>

      <div className="space-y-4">
        {filteredEpisodes.length > 0 ? (
          filteredEpisodes.map((episode) => (
            <EpisodeCard key={episode._id} episode={episode} />
          ))
        ) : (
          !loading && <p>No episodes found.</p>
        )}
      </div>
    </div>
  );
}