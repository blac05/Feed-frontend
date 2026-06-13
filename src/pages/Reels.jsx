import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const fetchReels = (page) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const reels = Array.from({ length: 10 }, (_, i) => ({
        id: `reel-${page}-${i}`,
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        title: `Reel ${page}-${i}`,
      }));
      resolve({ reels, nextPage: page < 5 ? page + 1 : undefined });
    }, 1000);
  });

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchReels(page).then(({ reels: newReels, nextPage }) => {
      setReels((prev) => [...prev, ...newReels]);
      setHasMore(!!nextPage);
      setLoading(false);
    });
  }, [page]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <h1 className="text-2xl font-bold">Reels</h1>
      {reels.map((reel) => (
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-black rounded-xl overflow-hidden shadow-lg"
        >
          <video
            src={reel.videoUrl}
            controls
            className="w-full"
            style={{ maxHeight: "500px" }}
          />
          <div className="p-3 text-white">
            <p className="font-semibold">{reel.title}</p>
          </div>
        </motion.div>
      ))}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        </div>
      )}
      {hasMore && !loading && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Load More
        </button>
      )}
    </div>
  );
}
