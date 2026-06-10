import { useState, useRef } from "react";

export default function EpisodeCard({ episode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
      {/* Episode Info */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
        <p className="text-gray-600 mb-2">{episode.description}</p>
        {/* Add more details if needed */}
      </div>
      {/* Audio Player & Controls */}
      <div className="flex flex-col items-center">
        <audio ref={audioRef} src={episode.audioUrl} controls className="mb-2" />
        {/* Custom Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}