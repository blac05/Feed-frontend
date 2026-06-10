import {
  useEffect,
  useState,
} from "react";

import ReelCard from "./ReelCard";

import {
  getReels,
} from "../../services/videoService";

export default function ReelFeed() {
  const [reels,
    setReels] =
    useState([]);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels =
    async () => {
      const res =
        await getReels();

      setReels(
        res.data.videos
      );
    };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {reels.map(reel => (
        <ReelCard
          key={reel._id}
          reel={reel}
        />
      ))}
    </div>
  );
}