import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function ReelActions({ reel, onLike, onComment, onShare }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Like Button */}
      <button
        onClick={onLike}
        aria-label={`Like ${reel.likes || 0} times`}
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition"
      >
        <Heart className="w-5 h-5" />
        <p className="text-sm">{reel.likes || 0}</p>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        aria-label={`${reel.comments || 0} comments`}
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition"
      >
        <MessageCircle className="w-5 h-5" />
        <p className="text-sm">{reel.comments || 0}</p>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        aria-label={`Share ${reel.shares || 0} times`}
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition"
      >
        <Share2 className="w-5 h-5" />
        <p className="text-sm">{reel.shares || 0}</p>
      </button>
    </div>
  );
}