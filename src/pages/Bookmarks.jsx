import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/bookmarks")
      .then(res => setBookmarks(res.data.bookmarks || []))
      .catch(() => toast({ message: "Failed to load bookmarks", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleUnbookmark = async (postId, e) => {
    e.stopPropagation();
    try {
      await api.post(`/users/bookmark/${postId}`);
      setBookmarks(prev => prev.filter(p => p._id !== postId));
      toast({ message: "Removed from saved", type: "success" });
    } catch (err) {
      toast({ message: "Failed to remove", type: "error" });
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <Bookmark size={20} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Saved Posts</h1>
        </div>
        {bookmarks.length > 0 && (
          <span className="ml-auto text-sm text-gray-400">{bookmarks.length} saved</span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">Nothing saved yet</p>
          <p className="text-sm mt-1">Tap the bookmark icon on any post to save it here</p>
        </div>
      ) : (
        bookmarks.map((post, i) => (
          <motion.div
            key={post._id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(`/post/${post._id}`)}
            className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-[#1e2732]/50 transition cursor-pointer"
          >
            <div className="flex gap-3">
              <img
                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                alt="avatar"
                onClick={e => { e.stopPropagation(); navigate(`/profile/${post.author?._id}`); }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{post.author?.name || post.author?.username}</span>
                    <span className="text-gray-400 text-xs">· {timeAgo(post.createdAt)}</span>
                  </div>
                  <button
                    onClick={e => handleUnbookmark(post._id, e)}
                    className="text-blue-500 hover:text-gray-400 transition p-1"
                  >
                    <Bookmark size={16} className="fill-blue-500" />
                  </button>
                </div>
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mt-1 line-clamp-3">{post.content}</p>
                {post.image && (
                  <img src={post.image} className="mt-2 rounded-2xl w-full object-cover max-h-48 border border-gray-100 dark:border-[#38444d]" alt="post" />
                )}
                <div className="flex gap-4 mt-2 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><Heart size={12} /> {post.likes?.length || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}