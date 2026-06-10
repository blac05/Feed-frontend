import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function ReelActions({
  reel,
  onLike,
  onComment,
}) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <button
        onClick={onLike}
      >
        <Heart />

        <p>
          {reel.likes || 0}
        </p>
      </button>

      <button
        onClick={onComment}
      >
        <MessageCircle />

        <p>
          {reel.comments || 0}
        </p>
      </button>

      <button>
        <Share2 />

        <p>
          {reel.shares || 0}
        </p>
      </button>
    </div>
  );
}