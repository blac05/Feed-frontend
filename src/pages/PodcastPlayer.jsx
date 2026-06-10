import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EpisodeCard from "../components/podcasts/EpisodeCard";
import api from "../api/axios";

export default function PodcastPlayer() {
  const { id } = useParams();

  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    const res = await api.get(`/podcasts/${id}`);
    setEpisodes(res.data.episodes || []);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Podcast Episodes
      </h1>

      <div className="space-y-4">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode._id}
            episode={episode}
          />
        ))}
      </div>
    </div>
  );
}