import { useEffect, useState } from "react";
import PodcastCard from "../components/podcasts/PodcastCard";
import api from "../api/axios";

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    const res = await api.get("/podcasts");
    setPodcasts(res.data.podcasts);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Podcasts
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast._id}
            podcast={podcast}
          />
        ))}
      </div>
    </div>
  );
}