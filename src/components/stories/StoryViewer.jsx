import { useEffect, useState } from "react";

const reactions = ["❤️", "🔥", "😂", "😮", "😍", "👍"];

export default function StoryViewer({ story, onClose }) {
  const [progress, setProgress] = useState(0);
  const [reaction, setReaction] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onClose]);

  const handleReaction = (reaction) => {
    setReaction(reaction);
    // Optional: send reaction to server or handle further
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-gray-700 h-1 rounded">
          <div
            className="bg-white h-1 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50"
        aria-label="Close story"
      >
        ×
      </button>

      {/* Media content */}
      <img
        src={story.media}
        alt=""
        className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain"
      />

      {/* Reactions */}
      <div className="absolute bottom-8 flex gap-4">
        {reactions.map((reactionEmoji) => (
          <button
            key={reactionEmoji}
            className={`text-3xl transition-transform hover:scale-110 ${
              reaction === reactionEmoji ? "scale-125" : ""
            }`}
            onClick={() => handleReaction(reactionEmoji)}
            aria-label={`React with ${reactionEmoji}`}
          >
            {reactionEmoji}
          </button>
        ))}
      </div>
    </div>
  );
}