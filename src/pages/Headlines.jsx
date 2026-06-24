import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark,
  ExternalLink, Award, TrendingUp, Clock, Star,
  Flame, Sparkles, ChevronDown, CheckCircle, X,
  MoreHorizontal, Flag, Trash2, Link
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ReportModal from "../components/moderation/ReportModal";

// ── Flair config ────────────────────────────────────────────
const FLAIRS = [
  { label: "Breaking", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", dot: "bg-red-500" },
  { label: "Tech", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", dot: "bg-blue-500" },
  { label: "Science", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400", dot: "bg-purple-500" },
  { label: "World", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", dot: "bg-green-500" },
  { label: "Sports", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400", dot: "bg-orange-500" },
  { label: "Entertainment", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400", dot: "bg-pink-500" },
  { label: "Politics", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400", dot: "bg-yellow-500" },
  { label: "Business", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400", dot: "bg-teal-500" },
  { label: "Health", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", dot: "bg-emerald-500" },
  { label: "Opinion", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", dot: "bg-gray-400" },
  { label: "Discussion", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400", dot: "bg-indigo-500" },
  { label: "Gaming", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400", dot: "bg-violet-500" },
];

const getFlairStyle = (label) =>
  FLAIRS.find(f => f.label.toLowerCase() === label?.toLowerCase()) ||
  { label, color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", dot: "bg-gray-400" };

// ── Award config ────────────────────────────────────────────
const AWARDS = [
  { type: "gold", emoji: "🏆", label: "Gold", color: "text-yellow-500" },
  { type: "silver", emoji: "🥈", label: "Silver", color: "text-gray-400" },
  { type: "platinum", emoji: "💎", label: "Platinum", color: "text-blue-400" },
  { type: "helpful", emoji: "🤝", label: "Helpful", color: "text-green-500" },
  { type: "wholesome", emoji: "❤️", label: "Wholesome", color: "text-red-400" },
  { type: "rocket", emoji: "🚀", label: "Rocket", color: "text-orange-500" },
];

// ── Sort tabs ───────────────────────────────────────────────
const SORT_TABS = [
  { key: "hot", label: "Hot", icon: Flame, color: "text-orange-500" },
  { key: "new", label: "New", icon: Sparkles, color: "text-blue-500" },
  { key: "top", label: "Top", icon: TrendingUp, color: "text-green-500" },
  { key: "rising", label: "Rising", icon: Star, color: "text-purple-500" },
];

const TOP_PERIODS = ["day", "week", "month", "year", "all"];

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

// ── Score formatter ─────────────────────────────────────────
const formatScore = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n?.toString() || "0";
};

// ── Time ago ────────────────────────────────────────────────
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ── Award Modal ─────────────────────────────────────────────
function AwardModal({ post, onClose, onGive }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#1e2732] rounded-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Give an Award</h3>
          <button onClick={onClose}><X size={18} className="text-gray-500" /></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {AWARDS.map(award => (
            <button
              key={award.type}
              onClick={() => { onGive(award.type); onClose(); }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-gray-100 dark:border-[#38444d] hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              <span className="text-3xl">{award.emoji}</span>
              <span className={`text-xs font-bold ${award.color}`}>{award.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── HeadlineCard ────────────────────────────────────────────
function HeadlineCard({ post: initialPost, currentUserId, onDelete, view = "list" }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(initialPost);
  const [userVote, setUserVote] = useState(
    post.upvotes?.includes(currentUserId) ? "up" :
    post.downvotes?.includes(currentUserId) ? "down" : null
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [voting, setVoting] = useState(false);
  const menuRef = useRef();
  const isOwn = post.author?._id === currentUserId;

  const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleVote = async (voteType) => {
    if (voting) return;
    setVoting(true);
    const prev = userVote;
    const newVote = userVote === voteType ? null : voteType;
    setUserVote(newVote);

    // Optimistic update
    setPost(p => {
      const up = [...(p.upvotes || [])].filter(id => id !== currentUserId);
      const down = [...(p.downvotes || [])].filter(id => id !== currentUserId);
      if (newVote === "up") up.push(currentUserId);
      if (newVote === "down") down.push(currentUserId);
      return { ...p, upvotes: up, downvotes: down };
    });

    try {
      const res = await api.post(`/posts/${post._id}/upvote`, { vote: newVote });
      setPost(res.data.post);
    } catch (e) {
      setUserVote(prev);
      toast({ message: "Failed to vote", type: "error" });
    } finally {
      setVoting(false);
    }
  };

  const handleAward = async (awardType) => {
    try {
      await api.post(`/posts/${post._id}/award`, { awardType });
      setPost(p => ({ ...p, awards: [...(p.awards || []), { type: awardType }] }));
      toast({ message: "Award given! 🏆", type: "success" });
    } catch (e) {
      toast({ message: "Failed to give award", type: "error" });
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await api.post(`/users/bookmark/${post._id}`);
      setBookmarked(res.data.bookmarked);
      toast({ message: res.data.bookmarked ? "Saved!" : "Removed", type: "success" });
    } catch (e) {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    toast({ message: "Link copied!", type: "success" });
  };

  const flair = getFlairStyle(post.flair);
  const awardCounts = (post.awards || []).reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all ${
          view === "compact" ? "mb-1" : "mb-3"
        }`}
      >
        <div className={`flex ${view === "compact" ? "gap-2 px-3 py-2" : "gap-0"}`}>

          {/* ── Vote Column ─────────────────────────────── */}
          <div className={`flex flex-col items-center gap-1 bg-gray-50 dark:bg-[#15202b] ${
            view === "compact" ? "px-1" : "px-3 py-4 min-w-[56px]"
          }`}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleVote("up")}
              className={`p-1.5 rounded-xl transition ${
                userVote === "up"
                  ? "text-orange-500 bg-orange-50 dark:bg-orange-900/30"
                  : "text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
            >
              <ArrowUp size={view === "compact" ? 16 : 20} strokeWidth={2.5} />
            </motion.button>

            <span className={`font-extrabold text-sm leading-none ${
              userVote === "up" ? "text-orange-500" :
              userVote === "down" ? "text-blue-500" :
              "text-gray-700 dark:text-gray-300"
            }`}>
              {formatScore(score)}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleVote("down")}
              className={`p-1.5 rounded-xl transition ${
                userVote === "down"
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              <ArrowDown size={view === "compact" ? 16 : 20} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* ── Content ──────────────────────────────────── */}
          <div className="flex-1 min-w-0 p-4">

            {/* Meta row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {/* Community badge */}
              {(post.communityName || post.community?.name) && (
                <button
                  onClick={() => post.community?._id && navigate(`/community/${post.community._id}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-white hover:underline"
                >
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                  f/{post.communityName || post.community?.name}
                </button>
              )}

              {/* Flair */}
              {post.flair && (
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${flair.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${flair.dot}`} />
                  {post.flair}
                </span>
              )}

              {/* Author */}
              <span className="text-xs text-gray-400">
                Posted by{" "}
                <button
                  onClick={() => navigate(`/profile/${post.author?._id}`)}
                  className="font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:underline"
                >
                  u/{post.author?.username}
                </button>
                {post.author?.isVerified && (
                  <CheckCircle size={10} className={`inline ml-0.5 ${badgeColor[post.author?.accountType] || "text-blue-500"}`} />
                )}
              </span>

              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>

              {post.readingTime > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} /> {post.readingTime}m read
                </span>
              )}
            </div>

            {/* Title — big Reddit-style */}
            <h2
              onClick={() => navigate(`/post/${post._id}`)}
              className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {post.title || post.content.slice(0, 150)}
              {!post.title && post.content.length > 150 && "..."}
            </h2>

            {/* Source link */}
            {post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-blue-500 hover:underline mb-2 w-fit"
              >
                <ExternalLink size={11} />
                {post.sourceDomain || post.sourceUrl}
              </a>
            )}

            {/* Body (if has title, show truncated body) */}
            {post.title && post.content && (
              <p
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 cursor-pointer"
              >
                {post.content}
              </p>
            )}

            {/* Media */}
            {post.image && (
              <div
                onClick={() => navigate(`/post/${post._id}`)}
                className="mb-3 rounded-xl overflow-hidden cursor-pointer max-h-96 bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full object-cover max-h-96 hover:opacity-95 transition"
                />
              </div>
            )}

            {post.video && (
              <div className="mb-3 rounded-xl overflow-hidden">
                <video
                  src={post.video}
                  className="w-full max-h-80 object-cover"
                  controls
                  preload="metadata"
                />
              </div>
            )}

            {/* Awards display */}
            {Object.keys(awardCounts).length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-2">
                {Object.entries(awardCounts).map(([type, count]) => {
                  const award = AWARDS.find(a => a.type === type);
                  return award ? (
                    <span key={type} className="flex items-center gap-0.5 text-xs bg-gray-100 dark:bg-[#253341] px-2 py-0.5 rounded-full">
                      <span>{award.emoji}</span>
                      {count > 1 && <span className={`font-bold ${award.color}`}>{count}</span>}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-1 flex-wrap -ml-1 mt-1">
              <button
                onClick={() => navigate(`/post/${post._id}`)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#253341] transition"
              >
                <MessageCircle size={14} />
                {post.comments?.length || 0} Comments
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#253341] transition"
              >
                <Share2 size={14} />
                Share
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  bookmarked
                    ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#253341]"
                }`}
              >
                <Bookmark size={14} className={bookmarked ? "fill-blue-500" : ""} />
                {bookmarked ? "Saved" : "Save"}
              </button>

              <button
                onClick={() => setShowAwardModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-500 transition"
              >
                <Award size={14} />
                Award
              </button>

              {/* Three-dot menu */}
              <div className="relative ml-auto" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-[#253341] transition"
                >
                  <MoreHorizontal size={16} />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 bottom-8 w-44 bg-white dark:bg-[#1e2732] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38444d] z-20 overflow-hidden"
                    >
                      <button
                        onClick={() => { handleShare(); setShowMenu(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                      >
                        <Link size={13} /> Copy link
                      </button>
                      {isOwn ? (
                        <button
                          onClick={() => { onDelete(post._id); setShowMenu(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => { setShowReport(true); setShowMenu(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341] transition"
                        >
                          <Flag size={13} /> Report
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Thumbnail (compact view) ─────────────────── */}
          {view === "compact" && post.image && (
            <div
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden cursor-pointer self-center"
            >
              <img src={post.image} className="w-full h-full object-cover hover:opacity-90 transition" alt="thumb" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAwardModal && (
          <AwardModal
            post={post}
            onClose={() => setShowAwardModal(false)}
            onGive={handleAward}
          />
        )}
        {showReport && (
          <ReportModal
            post={post}
            onClose={() => setShowReport(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Create Headline Form ────────────────────────────────────
function CreateHeadline({ onPosted, onClose }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!title.trim()) { toast({ message: "Title is required", type: "error" }); return; }
    setPosting(true);
    try {
      const res = await api.post("/posts", {
        content: body || title,
        title,
        flair,
        sourceUrl,
        isHeadline: true,
        type: "headline",
      });
      onPosted(res.data.post);
      toast({ message: "Headline posted! 🔥", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to post", type: "error" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#15202b] rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-extrabold text-gray-900 dark:text-white text-lg">Create Post</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block uppercase tracking-wide">
              Title *
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 300))}
              placeholder="An interesting title that grabs attention..."
              className="w-full border-2 border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{title.length}/300</p>
          </div>

          {/* Flair */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wide">
              Flair
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FLAIRS.map(f => (
                <button
                  key={f.label}
                  onClick={() => setFlair(flair === f.label ? "" : f.label)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border-2 transition ${
                    flair === f.label
                      ? `${f.color} border-current`
                      : "bg-gray-50 dark:bg-[#1e2732] text-gray-500 border-gray-200 dark:border-[#38444d] hover:border-gray-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block uppercase tracking-wide">
              Body (optional)
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Add more context, your thoughts, or a summary..."
              rows={4}
              className="w-full border-2 border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none transition"
            />
          </div>

          {/* Source URL */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block uppercase tracking-wide">
              Source Link (optional)
            </label>
            <input
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full border-2 border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          <button
            onClick={submit}
            disabled={posting || !title.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-2xl font-extrabold disabled:opacity-40 hover:brightness-110 transition"
          >
            {posting ? "Posting..." : "Post 🔥"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Headlines Page ─────────────────────────────────────
export default function Headlines() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("hot");
  const [topPeriod, setTopPeriod] = useState("week");
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("list"); // list | compact
  const [activeFlairFilter, setActiveFlairFilter] = useState("");
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setFetching(true);
    else setLoadingMore(true);
    try {
      let endpoint;
      if (sort === "hot") endpoint = `/posts/headlines/hot?page=${pageNum}`;
      else if (sort === "new") endpoint = `/posts/headlines/new?page=${pageNum}`;
      else if (sort === "top") endpoint = `/posts/headlines/top?page=${pageNum}&period=${topPeriod}`;
      else endpoint = `/posts/headlines/rising?page=${pageNum}`;

      const res = await api.get(endpoint);
      const newPosts = res.data.posts || [];

      if (reset || pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => {
          const ids = new Set(prev.map(p => p._id));
          return [...prev, ...newPosts.filter(p => !ids.has(p._id))];
        });
      }
      setHasMore(res.data.hasMore ?? newPosts.length === 20);
    } catch (e) {
      toast({ message: "Failed to load posts", type: "error" });
    } finally {
      setFetching(false);
      setLoadingMore(false);
    }
  }, [sort, topPeriod]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  }, [sort, topPeriod]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !fetching) {
          const next = page + 1;
          setPage(next);
          fetchPosts(next);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, fetching, page, fetchPosts]);

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id));

  const filteredPosts = activeFlairFilter
    ? posts.filter(p => p.flair?.toLowerCase() === activeFlairFilter.toLowerCase())
    : posts;

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#15202b]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#38444d]">
        {/* Top bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Headlines</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-gray-100 dark:bg-[#1e2732] rounded-xl p-1 gap-1">
              <button
                onClick={() => setView("list")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${view === "list" ? "bg-white dark:bg-[#253341] text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}
              >
                Card
              </button>
              <button
                onClick={() => setView("compact")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${view === "compact" ? "bg-white dark:bg-[#253341] text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}
              >
                Compact
              </button>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-extrabold hover:brightness-110 transition"
            >
              + Post
            </button>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="px-4 pb-2 flex items-center gap-1">
          {SORT_TABS.map(tab => (
            <div key={tab.key} className="relative">
              <button
                onClick={() => {
                  if (tab.key === "top") setShowTopMenu(m => !m);
                  else { setSort(tab.key); setShowTopMenu(false); }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition ${
                  sort === tab.key
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e2732]"
                }`}
              >
                <tab.icon size={15} className={sort === tab.key ? tab.color : ""} />
                {tab.label}
                {tab.key === "top" && sort === "top" && (
                  <span className="text-xs text-gray-400 capitalize">({topPeriod})</span>
                )}
                {tab.key === "top" && <ChevronDown size={12} />}
              </button>

              {/* Top period dropdown */}
              <AnimatePresence>
                {tab.key === "top" && showTopMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute left-0 top-11 w-32 bg-white dark:bg-[#1e2732] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38444d] z-30 overflow-hidden"
                  >
                    {TOP_PERIODS.map(p => (
                      <button
                        key={p}
                        onClick={() => { setSort("top"); setTopPeriod(p); setShowTopMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm capitalize transition ${
                          topPeriod === p && sort === "top"
                            ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-bold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#253341]"
                        }`}
                      >
                        {p === "all" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Flair filter row */}
        <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFlairFilter("")}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border transition ${
              !activeFlairFilter
                ? "bg-gray-900 dark:bg-white dark:text-gray-900 text-white border-transparent"
                : "border-gray-200 dark:border-[#38444d] text-gray-500 dark:text-gray-400 hover:border-gray-400"
            }`}
          >
            All
          </button>
          {FLAIRS.slice(0, 8).map(f => (
            <button
              key={f.label}
              onClick={() => setActiveFlairFilter(activeFlairFilter === f.label ? "" : f.label)}
              className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${
                activeFlairFilter === f.label
                  ? `${f.color} border-current`
                  : "border-gray-200 dark:border-[#38444d] text-gray-500 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className={view === "list" ? "p-4 max-w-3xl mx-auto" : "px-4 py-3 max-w-3xl mx-auto"}>
        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    </div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="flex gap-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Flame size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-extrabold text-gray-600 dark:text-gray-400 text-xl">No posts yet</p>
            <p className="text-sm mt-2">Be the first to post a headline!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-extrabold hover:brightness-110 transition"
            >
              Create Post
            </button>
          </div>
        ) : (
          <>
            {filteredPosts.map((post, i) => (
              <HeadlineCard
                key={post._id || i}
                post={post}
                currentUserId={user?._id}
                onDelete={handleDelete}
                view={view}
              />
            ))}

            <div ref={sentinelRef} className="h-4" />

            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-gray-400 text-sm font-medium">
                You've seen it all 🎉
              </div>
            )}
          </>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateHeadline
            onPosted={(post) => setPosts(prev => [post, ...prev])}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
