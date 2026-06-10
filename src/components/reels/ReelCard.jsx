import { useState } from "react";
import ReelActions from "./ReelActions";
import VideoComments from "./VideoComments";
import { likeVideo } from "../../services/videoService";

export default function ReelCard({ reel }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false); // Track if user liked the reel

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await likeVideo(reel._id);
      setLiked(!liked); // Toggle liked state
    } catch (error) {
      console.error("Failed to like the video", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="relative h-screen snap-start" aria-label="Reel Video">
      <video
        src={reel.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Creator and caption */}
      <div className="absolute bottom-20 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
        <h3 className="font-bold">@{reel.creator?.username}</h3>
        <p>{reel.caption}</p>
      </div>

      {/* Actions */}
      <div className="absolute right-4 bottom-28">
        <ReelActions
          reel={reel}
          onLike={handleLike}
          onComment={() => setShowComments(true)}
        />
      </div>

      {/* Comments Modal */}
      {showComments && (
        <VideoComments
          videoId={reel._id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}