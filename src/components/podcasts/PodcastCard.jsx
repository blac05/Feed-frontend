import { useState } from "react";

export default function PodcastCard({ podcast }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Optionally, save to localStorage or backend
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-2">{podcast.title}</h2>
      <p className="text-gray-600 mb-4">{podcast.description}</p>
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className={`px-3 py-1 rounded ${
          isFavorite ? "bg-yellow-300" : "bg-gray-200"
        }`}
      >
        {isFavorite ? "★ Favorited" : "☆ Favorite"}
      </button>
    </div>
  );
}