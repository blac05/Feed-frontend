import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Volume2, VolumeX,
  Plus, CheckCircle, Music, X, Upload
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

// Mock reels until real video upload is wired
const mockReels = [
  {
    _id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Beautiful sunset vibes 🌅 #nature #sunset",
    author: { username: "alexj", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", isVerified: true, accountType: "creator" },
    likes: ["u1", "u2", "u3"],
    comments: [],
    music: "Original Audio - alexj",
  },
  {
    _id: "2",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Can't stop watching this 😍 #trending #viral",
    author: { username: "sarahk", name: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=2", isVerified: true, accountType: "popstar" },
    likes: ["u1"],
    comments: [],
    music: "Trending Sound",
  },
  {
    _id: "3",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Tech tip of the day 💡 #tech #tips",
    author: { username: "mikechen", name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=3", isVerified: false, accountType: "personal" },
    likes: [],
    comments: [],
    music: "Original Audio",
  },
];

function ReelCard({ reel, isActive, currentUserId }) {
  const videoRef = useRef();
  const { toast } = useToast();
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(reel.likes?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(reel.likes?.length || 0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) toast({ message: "❤️ Liked!", type: "success" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/reels/" + reel._id);
    toast({ message: "Link copied!", type: "success" });
  };

  return (
    <div className="relative w-full h-screen flex-shrink-0 bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={() => setMuted(m => !m)}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      {/* Mute indicator */}
      <AnimatePresence>
        {muted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-4 pointer-events-none"
          >
            <VolumeX size={32} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-4 right-16 z-10">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={reel.author?.avatar || `https://ui-avatars.com/api/?name=${reel.author?.username}&background=2563eb&color=fff`}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
            alt="avatar"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">{reel.author?.name || reel.author?.username}</span>
              {reel.author?.isVerified && (
                <CheckCircle size={13} className={badgeColor[reel.author?.accountType] || "text-blue-500"} />
              )}
            </div>
            <span className="text-white/70 text-xs">@{reel.author?.username}</span>
          </div>
          <button className="ml-2 border border-white text-white text-xs px-3 py-1 rounded-full font-semibold hover:bg-white hover:text-black transition">
            Follow
          </button>
        </div>

        <p className="text-white text-sm leading-relaxed line-clamp-2">{reel.caption}</p>

        <div className="flex items-center gap-2 mt-2">
          <Music size={12} className="text-white/70" />
          <p className="text-white/70 text-xs truncate">{reel.music || "Original Audio"}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div
            whileTap={{ scale: 1.3 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? "bg-red-500" : "bg-black/40"}`}
          >
            <Heart size={20} className={liked ? "fill-white text-white" : "text-white"} />
          </motion.div>
          <span className="text-white text-xs font-semibold">{likeCount}</span>
        </button>

        {/* Comment */}
        <button onClick={() => setShowComment(true)} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold">{reel.comments?.length || 0}</span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
            <Share2 size={20} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold">Share</span>
        </button>

        {/* Mute toggle */}
        <button onClick={() => setMuted(m => !m)} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
            {muted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
          </div>
        </button>

        {/* Author avatar spinning disc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
        >
          <img
            src={reel.author?.avatar || `https://ui-avatars.com/api/?name=${reel.author?.username}&background=2563eb&color=fff`}
            className="w-full h-full object-cover"
            alt="disc"
          />
        </motion.div>
      </div>

      {/* Comment drawer */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute inset-x-0 bottom-0 bg-white dark:bg-[#15202b] rounded-t-3xl z-20 max-h-[60vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
              <h3 className="font-bold text-gray-900 dark:text-white">Comments</h3>
              <button onClick={() => setShowComment(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {reel.comments?.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No comments yet</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-[#38444d] flex gap-3">
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
              />
              <button
                disabled={!comment.trim()}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40 hover:bg-blue-700 transition"
              >
                Post
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Reels() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reels, setReels] = useState(mockReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const containerRef = useRef();
  const fileRef = useRef();

  // Snap scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handler = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      const uploadRes = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newReel = {
        _id: Date.now().toString(),
        videoUrl: uploadRes.data.url,
        caption,
        author: user,
        likes: [],
        comments: [],
        music: "Original Audio",
      };
      setReels(prev => [newReel, ...prev]);
      setShowUpload(false);
      setCaption("");
      setVideoFile(null);
      setVideoPreview(null);
      toast({ message: "Reel posted!", type: "success" });
    } catch (e) {
      toast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Upload button */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed top-4 right-4 z-30 bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full border border-white/30 hover:bg-white/30 transition"
      >
        <Plus size={20} />
      </button>

      {/* Vertical scroll container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel, i) => (
          <div key={reel._id} className="snap-start snap-always" style={{ height: "100vh" }}>
            <ReelCard
              reel={reel}
              isActive={i === activeIndex}
              currentUserId={user?._id}
            />
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-[#15202b] rounded-t-3xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">New Reel</h2>
                <button onClick={() => setShowUpload(false)}>
                  <X size={22} className="text-gray-500" />
                </button>
              </div>

              {/* Video preview or select */}
              {videoPreview ? (
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-black" style={{ height: "300px" }}>
                  <video src={videoPreview} className="w-full h-full object-cover" controls />
                  <button
                    onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-200 dark:border-[#38444d] rounded-2xl p-8 flex flex-col items-center gap-3 mb-4 hover:border-blue-400 transition"
                >
                  <Upload size={32} className="text-gray-400" />
                  <p className="text-gray-500 font-medium">Select video</p>
                  <p className="text-gray-400 text-xs">MP4, MOV up to 100MB</p>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
              />

              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write a caption..."
                rows={3}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-4"
              />

              <button
                onClick={handleUpload}
                disabled={!videoFile || uploading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold text-sm disabled:opacity-40 hover:brightness-110 transition"
              >
                {uploading ? "Uploading..." : "Post Reel"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

