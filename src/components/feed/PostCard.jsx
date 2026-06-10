import { Heart } from "lucide-react";

export default function PostCard({
  post,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow mb-4">
      <div className="font-bold">
        {post?.author?.username}
      </div>

      <p className="mt-3">
        {post?.content}
      </p>

      <button className="flex items-center gap-2 mt-4">
        <Heart size={18} />
        {post?.likes?.length || 0}
      </button>
    </div>
  );
}