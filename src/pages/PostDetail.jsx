import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Repeat2,
  Share2, CheckCircle, MoreHorizontal,
  Trash2, Link, Send
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ReactionPicker from "../components/feed/ReactionPicker";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data.post))
      .catch(() => toast({ message: "Post not found", type: "error" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReact = async (type) => {
    try {
      const res = await api.post(`/posts/${id}/react`, { type });
      setPost(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      toast({ message: "Post deleted", type: "success" });
      navigate(-1);
    } catch (err) {
      toast({ message: "Failed to delete", type: "error" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ message: "Link copied!", type: "success" });
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${id}/comment`, { text: comment });
      setPost(res.data.post);
      setComment("");
      toast({ message: "Comment posted!", type: "success" });
    } catch (err) {
      toast({ message: "Failed to post comment", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <p className="font-bold text-gray-900 dark:text-white">Post</p>
      </div>
      <div className="p-4 space-y-3 animate-pulse">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <p className="font-bold text-lg">Post not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-500 text-sm hover:underline">Go back</button>
      </div>
    </div>
  );

  const isOwn = post.author?._id === user?._id;

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <p className="font-bold text-gray-900 dark:text-white text-lg">Post</p>
      </div>

      <div className="bg-white dark:bg-[#15202b]">
        {/* Post Author */}
        <div className="px-4 pt-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              alt="avatar"
              onClick={() => navigate(`/profile/${post.author?._id}`)}
            />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-bold text-gray-900 dark:text-white">{post.author?.name || post.author?.username}</p>
                {post.author?.isVerified && (
                  <CheckCircle size={15} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                )}
              </div>
              <p className="text-sm text-gray-400">@{post.author?.username}</p>
            </div>
          </div>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] text-gray-400 transition"
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1e2732] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38444d] z-20 overflow-hidden"
                >
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                  >
                    <Link size={14} /> Copy link
                  </button>
                  {isOwn && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <Trash2 size={14} /> Delete post
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 mt-3">
          <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          {post.image && (
            <img src={post.image} className="mt-3 rounded-2xl w-full object-cover max-h-[500px] border border-gray-100 dark:border-[#38444d]" alt="post" />
          )}
          <p className="text-gray-400 text-sm mt-3">{timeAgo(post.createdAt)}</p>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-t border-b border-gray-100 dark:border-[#38444d] mt-3 flex gap-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">{post.likes?.length || 0}</span> Likes
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">{post.comments?.length || 0}</span> Comments
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">{post.reposts?.length || 0}</span> Reposts
          </span>
        </div>

        {/* Actions */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-[#38444d] flex items-center justify-between">
          <ReactionPicker
            postId={post._id}
            likes={post.likes || []}
            reactions={post.reactions || []}
            currentUserId={user?._id}
            onReact={handleReact}
          />
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
            <MessageCircle size={20} />
          </button>
          <button
            onClick={() => toast({ message: "Reposted!", type: "success" })}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
          >
            <Repeat2 size={20} />
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Comment Input */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex gap-3 items-center">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=2563eb&color=fff`}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitComment()}
            placeholder="Post your reply"
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-sm"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !comment.trim()}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-40 hover:bg-blue-700 transition"
          >
            {submitting ? "..." : "Reply"}
          </button>
        </div>

        {/* Comments */}
        <div>
          {post.comments?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No replies yet</p>
              <p className="text-sm mt-1">Be the first to reply!</p>
            </div>
          )}
          {post.comments?.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
            >
              <img
                src={c.user?.avatar || `https://ui-avatars.com/api/?name=${c.user?.username}&background=2563eb&color=fff`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
                alt="avatar"
                onClick={() => navigate(`/profile/${c.user?._id}`)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{c.user?.name || c.user?.username}</span>
                  {c.user?.isVerified && (
                    <CheckCircle size={13} className={badgeColor[c.user?.accountType] || "text-blue-500"} />
                  )}
                  <span className="text-gray-400 text-xs">@{c.user?.username}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
