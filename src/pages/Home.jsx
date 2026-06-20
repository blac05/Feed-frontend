import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Video, Smile, MessageCircle,
  Repeat2, Share2, MoreHorizontal, CheckCircle,
  X, Trash2, Flag, Link, Bookmark, BarChart2, Quote
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useUpload from "../hooks/useUpload";
import StoriesBar from "../components/stories/StoriesBar";
import ReactionPicker from "../components/feed/ReactionPicker";
import QuotePost from "../components/feed/QuotePost";
import PollCard from "../components/feed/PollCard";
import CreatePoll from "../components/feed/CreatePoll";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

function VerifiedBadge({ user }) {
  if (!user?.isVerified) return null;
  return <CheckCircle size={13} className={`inline ml-0.5 ${badgeColor[user.accountType] || "text-blue-500"}`} />;
}

function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

function QuoteInput({ quotedPost, onClose, onPosted }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await api.post("/posts", {
        content: text,
        quotedPostId: quotedPost._id,
        type: "quote",
      });
      onPosted(res.data.post);
      setText("");
    } catch (err) {
      toast({ message: "Failed to quote post", type: "error" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=2563eb&color=fff`}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          alt="avatar"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add your comment..."
          rows={2}
          className="flex-1 resize-none bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <QuotePost post={quotedPost} />
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="text-gray-400 text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">Cancel</button>
        <button
          onClick={submit}
          disabled={!text.trim() || posting}
          className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full font-bold disabled:opacity-40 hover:bg-blue-700 transition"
        >
          {posting ? "Posting..." : "Quote"}
        </button>
      </div>
    </div>
  );
}

function PostCard({ post, onDelete, onReact, currentUserId }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showQuoteInput, setShowQuoteInput] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const isOwn = localPost.author?._id === currentUserId;
  const menuRef = useRef();

  // Keep local component state in sync with external shifts
  useEffect(() => {
    setLocalPost(post);
    setBookmarked(post.isBookmarked || false);
  }, [post]);

  // Click outside handler for dropdown menu
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async () => {
    setShowMenu(false);
    try {
      await api.delete(`/posts/${localPost._id}`);
      onDelete(localPost._id);
      toast({ message: "Post deleted", type: "success" });
    } catch (err) {
      toast({ message: "Failed to delete post", type: "error" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${localPost._id}`);
    toast({ message: "Link copied!", type: "success" });
    setShowMenu(false);
  };

  const handleBookmark = async () => {
    try {
      const res = await api.post(`/users/bookmark/${localPost._id}`);
      setBookmarked(res.data.bookmarked);
      toast({ message: res.data.bookmarked ? "Saved!" : "Removed from saved", type: "success" });
    } catch (err) {
      console.error(err);
      toast({ message: "Failed to update bookmark", type: "error" });
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${localPost._id}/comment`, { text: comment });
      setLocalPost(res.data.post);
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
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-[#1e2732]/50 transition"
    >
      <div className="flex gap-3">
        <img
          src={localPost.author?.avatar || `https://ui-avatars.com/api/?name=${localPost.author?.username}&background=2563eb&color=fff`}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
          alt="avatar"
        />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                {localPost.author?.name || localPost.author?.username}
              </span>
              <VerifiedBadge user={localPost.author} />
              <span className="text-gray-400 dark:text-gray-500 text-sm">@{localPost.author?.username}</span>
              <span className="text-gray-300 dark:text-gray-600 text-sm">·</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">{timeAgo(localPost.createdAt)}</span>
            </div>

            {/* Three-dot context menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition"
              >
                <MoreHorizontal size={16} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-8 w-48 bg-white dark:bg-[#1e2732] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38444d] z-20 overflow-hidden"
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
                    {!isOwn && (
                      <button
                        onClick={() => { toast({ message: "Post reported", type: "info" }); setShowMenu(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                      >
                        <Flag size={14} /> Report post
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hashtag-aware text mapping */}
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mt-1 whitespace-pre-wrap">
            {localPost.content.split(/(\s+)/).map((word, i) => {
              if (word.startsWith("#")) {
                const tag = word.slice(1);
                return (
                  <span
                    key={i}
                    onClick={e => { e.stopPropagation(); navigate(`/hashtag/${tag}`); }}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer hover:underline"
                  >
                    {word}
                  </span>
                );
              }
              return <span key={i} onClick={() => navigate(`/post/${localPost._id}`)} className="cursor-pointer">{word}</span>;
            })}
          </p>

          {/* Image attachments */}
          {localPost.image && (
            <img
              src={localPost.image}
              className="mt-3 rounded-2xl w-full object-cover max-h-96 border border-gray-100 dark:border-[#38444d]"
              alt="post"
            />
          )}

          {/* Quote post preview */}
          {localPost.quotedPost && <QuotePost post={localPost.quotedPost} />}

          {/* Poll Render Block */}
          {localPost.poll?.options?.length > 0 && (
            <PollCard
              post={localPost}
              currentUserId={currentUserId}
              onUpdate={updated => setLocalPost(updated)}
            />
          )}

          {/* Lower Action Layout */}
          <div className="flex items-center justify-between mt-3 -ml-2">
            {/* Integrated Reaction Picker Plugin */}
            <ReactionPicker
              postId={localPost._id}
              likes={localPost.likes || []}
              reactions={localPost.reactions || []}
              currentUserId={currentUserId}
              onReact={(type) => onReact(localPost._id, type)}
            />

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
            >
              <MessageCircle size={17} className="group-hover:scale-110 transition" />
              <span className="text-xs">{localPost.comments?.length || 0}</span>
            </button>

            {/* Nested Quote / Repost Action Menu */}
            <div className="relative">
              <button
                onClick={() => setShowQuote(!showQuote)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm text-gray-400 dark:text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
              >
                <Repeat2 size={17} className="group-hover:scale-110 transition" />
                <span className="text-xs">{localPost.reposts?.length || 0}</span>
              </button>
              
              <AnimatePresence>
                {showQuote && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute left-0 top-8 w-44 bg-white dark:bg-[#1e2732] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38444d] z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => { toast({ message: "Reposted!", type: "success" }); setShowQuote(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                    >
                      <Repeat2 size={14} /> Repost
                    </button>
                    <button
                      onClick={() => { setShowQuoteInput(true); setShowQuote(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                    >
                      <Quote size={14} /> Quote post
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
            >
              <Share2 size={17} className="group-hover:scale-110 transition" />
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm transition group ${
                bookmarked ? "text-blue-500" : "text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              <Bookmark size={17} className={`group-hover:scale-110 transition ${bookmarked ? "fill-blue-500" : ""}`} />
            </button>
          </div>

          {/* Quote post input tray */}
          <AnimatePresence>
            {showQuoteInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 border-t border-gray-100 dark:border-[#38444d] pt-3"
              >
                <QuoteInput
                  quotedPost={localPost}
                  onClose={() => setShowQuoteInput(false)}
                  onPosted={(newPost) => { toast({ message: "Quote posted!", type: "success" }); setShowQuoteInput(false); }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comments Nested Layout */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 border-t border-gray-100 dark:border-[#38444d] pt-3 space-y-3"
              >
                {localPost.comments?.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
                )}
                {localPost.comments?.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <img
                      src={c.user?.avatar || `https://ui-avatars.com/api/?name=${c.user?.username}&background=2563eb&color=fff`}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      alt="avatar"
                    />
                    <div className="bg-gray-100 dark:bg-[#1e2732] rounded-2xl px-3 py-2 flex-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.user?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{c.text}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={submitComment}
                    disabled={submitting || !comment.trim()}
                    className="bg-blue-600 text-white px-3 py-2 rounded-2xl text-xs font-semibold disabled:opacity-40 hover:bg-blue-700 transition"
                  >
                    {submitting ? "..." : "Send"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const tabs = ["For You", "Following", "News", "Trending"];

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImage, uploading: uploadingImage } = useUpload();

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("For You");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [pollData, setPollData] = useState(null);
  const [showPoll, setShowPoll] = useState(false);
  const fileRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setFetching(true);
    try {
      let endpoint = "/posts";
      if (activeTab === "Following") endpoint = "/posts/following";
      if (activeTab === "Trending") endpoint = "/posts/trending";
      const res = await api.get(endpoint);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { content: text, image: imageUrl };
      if (pollData) payload.poll = pollData;
      
      const res = await api.post("/posts", payload);
      setPosts(prev => [res.data.post, ...prev]);
      setText("");
      setImage(null);
      setImageFile(null);
      setPollData(null);
      setShowPoll(false);
      setExpanded(false);
      toast({ message: "Post published!", type: "success" });
    } catch (err) {
      toast({ message: "Failed to post", type: "error" });
    } finally {
      setPosting(false);
    }
  };

  const handleReact = async (id, type) => {
    try {
      const res = await api.post(`/posts/${id}/react`, { type });
      setPosts(prev => prev.map(p => p._id === id ? res.data.post : p));
    } catch (err) {
      console.error(err);
      toast({ message: "Failed to update reaction", type: "error" });
    }
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Navigation Layer */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d]">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition border-b-2 ${
                activeTab === tab
                  ? "text-gray-900 dark:text-white border-blue-600"
                  : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e2732]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights / Stories Stream */}
      <StoriesBar />

      {/* Editor Block */}
      <div className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3">
        <div className="flex gap-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=2563eb&color=fff`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />
          <div className="flex-1">
            <textarea
              ref={textRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => setExpanded(true)}
              placeholder="What's happening?"
              className="w-full resize-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] bg-transparent"
              rows={expanded ? 3 : 1}
            />

            {image && (
              <div className="relative mt-2">
                <img src={image} className="rounded-2xl w-full max-h-60 object-cover border border-gray-100 dark:border-[#38444d]" alt="preview" />
                <button
                  onClick={() => { setImage(null); setImageFile(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                >
                  <X size={14} />
                </button>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}

            {/* Poll Creation Builder */}
            <AnimatePresence>
              {showPoll && (
                <CreatePoll
                  onPollChange={setPollData}
                  onRemove={() => { setShowPoll(false); setPollData(null); }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#38444d]"
                >
                  <div className="flex gap-1">
                    <label className="flex items-center gap-1.5 text-blue-500 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-full transition cursor-pointer">
                      <Image size={18} />
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                    </label>
                    <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-full transition">
                      <Video size={18} />
                    </button>
                    <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-full transition">
                      <Smile size={18} />
                    </button>
                    <button
                      onClick={() => setShowPoll(!showPoll)}
                      className={`text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-full transition ${showPoll ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    >
                      <BarChart2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {text.length > 0 && (
                      <span className={`text-xs font-medium ${text.length > 260 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                        {280 - text.length}
                      </span>
                    )}
                    <button
                      onClick={submit}
                      disabled={posting || !text.trim() || text.length > 280 || uploadingImage}
                      className="bg-gradient-to-r from-sky-500 to-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold disabled:opacity-40 hover:brightness-110 transition"
                    >
                      {uploadingImage ? "Uploading..." : posting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Missing context empty view state */}
      {!fetching && posts.length === 0 && activeTab === "Following" && (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No posts from people you follow</p>
          <p className="text-sm mt-1">Follow more people to see their posts here</p>
        </div>
      )}

      {/* Timeline Stream Execution Target */}
      {fetching ? (
        <><PostSkeleton /><PostSkeleton /><PostSkeleton /><PostSkeleton /></>
      ) : posts.length === 0 && activeTab !== "Following" ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No posts yet</p>
          <p className="text-sm mt-1">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <PostCard
            key={post._id || i}
            post={post}
            onDelete={handleDelete}
            onReact={handleReact}
            currentUserId={user?._id}
          />
        ))
      )}
    </div>
  );
}

