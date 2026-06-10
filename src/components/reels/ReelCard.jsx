import {
  useState,
} from "react";

import ReelActions from "./ReelActions";

import VideoComments from "./VideoComments";

import {
  likeVideo,
} from "../../services/videoService";

export default function ReelCard({
  reel,
}) {
  const [showComments,
    setShowComments] =
    useState(false);

  const handleLike =
    async () => {
      await likeVideo(
        reel._id
      );
    };

  return (
    <div className="relative h-screen snap-start">
      <video
        src={reel.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-20 left-4 text-white">
        <h3 className="font-bold">
          @
          {
            reel.creator
              ?.username
          }
        </h3>

        <p>
          {reel.caption}
        </p>
      </div>

      <div className="absolute right-4 bottom-28">
        <ReelActions
          reel={reel}
          onLike={
            handleLike
          }
          onComment={() =>
            setShowComments(
              true
            )
          }
        />
      </div>

      {showComments && (
        <VideoComments
          videoId={reel._id}
          onClose={() =>
            setShowComments(
              false
            )
          }
        />
      )}
    </div>
  );
}