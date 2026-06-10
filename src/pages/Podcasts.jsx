import { useEffect, useState } from "react";
import PodcastCard from "../components/podcasts/PodcastCard";
import api from "../api/axios";

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Adjust as needed

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/podcasts");
      setPodcasts(res.data.podcasts);
    } catch (err) {
      setError("Failed to load podcasts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(podcasts.length / itemsPerPage);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPodcasts = podcasts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Podcasts</h1>

      {/* Pagination Controls */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading podcasts...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {currentPodcasts.length > 0 ? (
            currentPodcasts.map((podcast) => (
              <PodcastCard key={podcast._id} podcast={podcast} />
            ))
          ) : (
            <p>No podcasts available.</p>
          )}
        </div>
      )}
    </div>
  );
}