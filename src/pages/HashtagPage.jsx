import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Hash, TrendingUp, CheckCircle, MessageCircle, 
  Heart, Repeat2, Share2, Bookmark 
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ReactionPicker from "../components/feed/ReactionPicker";
import { Heart, MessageCircle, Repeat2, Share2, Bookmark } from "lucide-react";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return new Date(date).toLocaleDateString();
};

export default function HashtagPage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/hashtag/${tag}`)
      .then(res => setPosts(res.data.posts || []))
      .catch(() => toast({ message: "Failed to load posts", type: "error" }))
      .finally(() => setLoading(false));
  }, [tag]);

  const handleReact = async (id, type) => {
    try {
      const res = await api.post(`/posts/${id}/react`, { type });
      setPosts(prev => prev.map(p => p._id === id ? res.data.post : p));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <Hash size={20} className="text-blue-600" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{tag}</h1>
          </div>
          <p className="text-xs text-gray-400">{posts.length} posts</p>
        </div>
      </div>

      {/* Trending banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-white" />
          <span className="text-white/80 text-xs font-medium uppercase tracking-wide">Trending</span>
        </div>
        <h2 className="text-white text-2xl font-extrabold">#{tag}</h2>
        <p className="text-white/70 text-sm mt-1">{posts.length} posts in the last 48 hours</p>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Hash size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-gray-600 dark:text-gray-400">No posts with #{tag}</p>
          <p className="text-sm mt-1">Be the first to post with this hashtag!</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <motion.div
            key={post._id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-[#1e2732]/50 transition cursor-pointer"
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <div className="flex gap-3">
              <img
                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                alt="avatar"
                onClick={e => { e.stopPropagation(); navigate(`/profile/${post.author?._id}`); }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {post.author?.name || post.author?.username}
                  </span>
                  {post.author?.isVerified && (
                    <CheckCircle size={13} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                  )}
                  <span className="text-gray-400 text-xs">@{post.author?.username}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mt-1">
                  {post.content}
                </p>
                {post.image && (
                  <img src={post.image} className="mt-2 rounded-2xl w-full object-cover max-h-64 border border-gray-100 dark:border-[#38444d]" alt="post" />
                )}
                <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart size={13} /> {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={13} /> {post.comments?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Repeat2 size={13} /> {post.reposts?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
