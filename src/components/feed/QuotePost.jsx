import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

export default function QuotePost({ post }) {
  const navigate = useNavigate();
  if (!post) return null;

  return (
    <div
      onClick={e => { e.stopPropagation(); navigate(`/post/${post._id}`); }}
      className="mt-2 border border-gray-200 dark:border-[#38444d] rounded-2xl p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
    >
      <div className="flex items-center gap-2 mb-1">
        <img
          src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
          className="w-5 h-5 rounded-full object-cover"
          alt="avatar"
        />
        <span className="font-bold text-xs text-gray-800 dark:text-white">{post.author?.name || post.author?.username}</span>
        {post.author?.isVerified && (
          <CheckCircle size={11} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
        )}
        <span className="text-gray-400 text-xs">@{post.author?.username}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-xs line-clamp-3">{post.content}</p>
      {post.image && (
        <img src={post.image} className="mt-2 rounded-xl w-full object-cover max-h-32" alt="post" />
      )}
    </div>
  );
}
