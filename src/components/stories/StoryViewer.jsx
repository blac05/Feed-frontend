import {
  useEffect,
  useState,
} from "react";

const reactions = [
  "❤️",
  "🔥",
  "😂",
  "😮",
  "😍",
  "👍",
];

export default function StoryViewer({
  story,
  onClose,
}) {
  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(
              interval
            );

            onClose();

            return 100;
          }

          return prev + 2;
        });
      }, 100);

    return () =>
      clearInterval(interval);
  }, [onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-gray-700 h-1 rounded">
          <div
            className="bg-white h-1 rounded"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ×
      </button>

      <img
        src={story.media}
        alt=""
        className="max-h-[80vh] max-w-[90vw] rounded-xl"
      />

      <div className="absolute bottom-8 flex gap-4">
        {reactions.map(
          reaction => (
            <button
              key={reaction}
              className="text-3xl"
            >
              {reaction}
            </button>
          )
        )}
      </div>
    </div>
  );
}