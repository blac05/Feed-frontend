import { Heart } from "lucide-react";
import { useState } from "react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const likesCount = post?.likes?.length || 0;

  const toggleLike = () => {
    setLiked(!liked);
    // Here, you can also send a request to backend to update like status
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow mb-4">
      <div className="font-bold mb-2">{post?.author?.username}</div>

      <p className="mt-3">{post?.content}</p>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 focus:outline-none ${
            liked ? "text-red-500" : "text-gray-600"
          }`}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart size={18} />
          {liked ? likesCount + 1 : likesCount}
        </button>
      </div>
    </div>
  );
}