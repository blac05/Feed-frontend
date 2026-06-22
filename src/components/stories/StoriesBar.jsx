import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, ChevronLeft, ChevronRight, Heart,
  Trash2, Type, Image as ImageIcon, Video,
  Bookmark, Eye
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import useUpload from "../../hooks/useUpload";
import api from "../../api/axios";

const TEXT_BACKGROUNDS = [
  { id: "blue", value: "linear-gradient(135deg,#0ea5e9,#2563eb)", label: "Blue" },
  { id: "purple", value: "linear-gradient(135deg,#7c3aed,#db2777)", label: "Purple" },
  { id: "green", value: "linear-gradient(135deg,#10b981,#059669)", label: "Green" },
  { id: "orange", value: "linear-gradient(135deg,#f59e0b,#ef4444)", label: "Orange" },
  { id: "dark", value: "linear-gradient(135deg,#111827,#374151)", label: "Dark" },
  { id: "pink", value: "linear-gradient(135deg,#ec4899,#f43f5e)", label: "Pink" },
  { id: "teal", value: "linear-gradient(135deg,#14b8a6,#0891b2)", label: "Teal" },
  { id: "gold", value: "linear-gradient(135deg,#d97706,#b45309)", label: "Gold" },
];

// ── Story Viewer ───────────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose, currentUserId }) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const story = stories[index];
  const { toast } = useToast();
  const videoRef = useRef();
  const DURATION = story?.mediaType === "video" ? 15 : 5;

  useEffect(() => {
    if (story?._id) {
      api.put(`/stories/${story._id}/view`).catch(() => {});
    }
  }, [index]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [index]);

  const next = () => {
    if (index < stories.length - 1) setIndex(i => i + 1);
    else onClose();
  };

  const prev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const handleLike = async () => {
    try {
      await api.put(`/stories/${story._id}/like`);
      toast({ message: "❤️ Liked!", type: "success" });
    } catch (e) {}
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/stories/${story._id}`);
      toast({ message: "Story deleted", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to delete", type: "error" });
    }
  };

  const handleHighlight = async () => {
    try {
      await api.post("/stories/highlight", {
        storyId: story._id,
        highlightTitle: "Highlights",
      });
      toast({ message: "Saved to highlights!", type: "success" });
    } catch (e) {
      toast({ message: "Failed to save highlight", type: "error" });
    }
  };

  if (!story) return null;
  const isOwn = story.user?._id === currentUserId || story.user === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm h-[90vh] max-h-[750px] rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              {i === index && !paused && (
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION, ease: "linear" }}
                  onAnimationComplete={next}
                />
              )}
              {i < index && <div className="h-full w-full bg-white" />}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-7 left-3 right-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={story.user?.avatar || `https://ui-avatars.com/api/?name=${story.user?.username}&background=2563eb&color=fff`}
              className="w-9 h-9 rounded-full border-2 border-white object-cover"
              alt="avatar"
            />
            <div>
              <span className="text-white font-bold text-sm">{story.user?.username}</span>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <Eye size={10} /> {story.views?.length || 0} views
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwn && (
              <>
                <button onClick={handleHighlight} className="text-white/80 hover:text-yellow-400 transition">
                  <Bookmark size={18} />
                </button>
                <button onClick={handleDelete} className="text-white/80 hover:text-red-400 transition">
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={onClose} className="text-white hover:text-gray-300 transition">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Story Content */}
        {story.mediaType === "text" ? (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{ background: story.background }}
          >
            <p
              className="text-3xl font-extrabold text-center leading-tight"
              style={{ color: story.textColor }}
            >
              {story.text}
            </p>
          </div>
        ) : story.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={story.video}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />
        ) : (
          <img src={story.image} className="w-full h-full object-cover" alt="story" />
        )}

        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-16 left-4 right-4 z-10">
            <p className="text-white text-sm font-medium bg-black/40 rounded-xl px-3 py-2">{story.caption}</p>
          </div>
        )}

        {/* Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-end">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition"
          >
            <Heart size={16} /> {story.likes?.length || 0}
          </button>
        </div>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Story Creator Modal ────────────────────────────────────
function StoryCreator({ onClose, onStoryCreated }) {
  const { toast } = useToast();
  const { uploadStoryMedia, uploading, progress } = useUpload();
  const [mode, setMode] = useState("choose"); // choose | text | media
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [caption, setCaption] = useState("");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [background, setBackground] = useState(TEXT_BACKGROUNDS[0].value);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    setMediaType(isVideo ? "video" : "image");
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMode("media");
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      let storyData = { caption };

      if (mode === "text") {
        if (!text.trim()) { toast({ message: "Please add some text", type: "error" }); return; }
        storyData = { ...storyData, mediaType: "text", text, textColor, background };
      } else {
        if (!mediaFile) { toast({ message: "Please select a photo or video", type: "error" }); return; }
        const result = await uploadStoryMedia(mediaFile);
        if (!result) { toast({ message: "Upload failed", type: "error" }); return; }
        storyData = {
          ...storyData,
          mediaType: result.type,
          [result.type === "video" ? "video" : "image"]: result.url,
        };
      }

      const res = await api.post("/stories", storyData);
      onStoryCreated(res.data.story);
      toast({ message: "Story posted! 🎉", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to post story", type: "error" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white dark:bg-[#15202b] rounded-t-3xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">New Story</h2>
          <button onClick={onClose}><X size={22} className="text-gray-500" /></button>
        </div>

        {mode === "choose" && (
          <div className="p-6 grid grid-cols-3 gap-3">
            {[
              {
                icon: ImageIcon, label: "Photo", color: "from-blue-500 to-cyan-500",
                action: () => { setMediaType("image"); fileRef.current.click(); }
              },
              {
                icon: Video, label: "Video", color: "from-purple-500 to-pink-500",
                action: () => { setMediaType("video"); fileRef.current.click(); }
              },
              {
                icon: Type, label: "Text", color: "from-orange-500 to-red-500",
                action: () => setMode("text")
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex flex-col items-center gap-2 p-5 bg-gradient-to-br ${item.color} rounded-2xl text-white hover:brightness-110 transition`}
              >
                <item.icon size={28} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {mode === "text" && (
          <div className="p-5 space-y-4">
            {/* Preview */}
            <div
              className="w-full rounded-2xl flex items-center justify-center p-6"
              style={{ background, minHeight: "160px" }}
            >
              <p
                className="text-2xl font-extrabold text-center leading-tight"
                style={{ color: textColor }}
              >
                {text || "Your story text..."}
              </p>
            </div>

            {/* Text input */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your story..."
              maxLength={200}
              rows={3}
              className="w-full bg-gray-50 dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{text.length}/200</p>

            {/* Background picker */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Background</p>
              <div className="flex gap-2 flex-wrap">
                {TEXT_BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.value)}
                    className={`w-8 h-8 rounded-full border-4 transition ${
                      background === bg.value ? "border-blue-600 scale-110" : "border-transparent"
                    }`}
                    style={{ background: bg.value }}
                    title={bg.label}
                  />
                ))}
              </div>
            </div>

            {/* Text color */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Text color:</p>
              {["#ffffff", "#000000", "#fbbf24", "#34d399", "#f472b6"].map(c => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${textColor === c ? "border-blue-600 scale-110" : "border-gray-300"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Caption */}
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Add a caption... (optional)"
              className="w-full bg-gray-50 dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setMode("choose")} className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-sm font-medium">
                Back
              </button>
              <button
                onClick={handlePost}
                disabled={posting || !text.trim()}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-2.5 rounded-2xl font-bold text-sm disabled:opacity-40 hover:brightness-110 transition"
              >
                {posting ? "Posting..." : "Post Story"}
              </button>
            </div>
          </div>
        )}

        {mode === "media" && mediaPreview && (
          <div className="p-5 space-y-4">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ height: "240px" }}>
              {mediaType === "video" ? (
                <video src={mediaPreview} className="w-full h-full object-cover" controls />
              ) : (
                <img src={mediaPreview} className="w-full h-full object-cover" alt="story preview" />
              )}
              <button
                onClick={() => { setMediaFile(null); setMediaPreview(null); setMode("choose"); }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5"
              >
                <X size={14} />
              </button>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Caption */}
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Add a caption... (optional)"
              className="w-full bg-gray-50 dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setMode("choose")} className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-sm font-medium">
                Back
              </button>
              <button
                onClick={handlePost}
                disabled={posting || uploading}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white py-2.5 rounded-2xl font-bold text-sm disabled:opacity-40 hover:brightness-110 transition"
              >
                {posting || uploading ? `${uploading ? progress + "%" : "Posting..."}` : "Post Story"}
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Main StoriesBar ────────────────────────────────────────
export default function StoriesBar() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [viewingIndex, setViewingIndex] = useState(null);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    api.get("/stories")
      .then(res => setStories(res.data.stories || []))
      .catch(() => {});
  }, []);

  // Group by user — show each user's avatar once, open all their stories
  const grouped = stories.reduce((acc, story) => {
    const uid = story.user?._id || story.user;
    if (!acc[uid]) acc[uid] = { user: story.user, stories: [] };
    acc[uid].stories.push(story);
    return acc;
  }, {});
  const userGroups = Object.values(grouped);

  // Put own stories first
  const sorted = [...userGroups].sort((a, b) => {
    if (a.user?._id === user?._id) return -1;
    if (b.user?._id === user?._id) return 1;
    return 0;
  });

  // Flat index map for viewer
  const flatStories = sorted.flatMap(g => g.stories);

  const getGroupStartIndex = (groupIndex) => {
    let count = 0;
    for (let i = 0; i < groupIndex; i++) {
      count += sorted[i].stories.length;
    }
    return count;
  };

  return (
    <>
      <div className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowCreator(true)}
              className="relative w-14 h-14 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition overflow-hidden"
            >
              {user?.avatar && (
                <img src={user.avatar} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="you" />
              )}
              <div className="relative z-10 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <Plus size={12} className="text-white" />
              </div>
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-14 text-center">Add story</span>
          </div>

          {/* Story Groups */}
          {sorted.map((group, gi) => {
            const isSeen = group.stories.every(s => s.views?.includes(user?._id));
            const isOwn = group.user?._id === user?._id;
            const startIdx = getGroupStartIndex(gi);
            return (
              <motion.div
                key={group.user?._id || gi}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.04 }}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
                onClick={() => setViewingIndex(startIdx)}
              >
                <div className={`w-14 h-14 rounded-full p-0.5 ${
                  isSeen
                    ? "bg-gray-200 dark:bg-gray-600"
                    : isOwn
                    ? "bg-gradient-to-tr from-blue-500 to-blue-700"
                    : "bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500"
                }`}>
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-[#15202b] overflow-hidden bg-gray-100">
                    {group.stories[0]?.mediaType === "text" ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: group.stories[0].background }}
                      >
                        <span className="text-[8px] font-bold text-white text-center px-0.5 line-clamp-2">
                          {group.stories[0].text}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={group.user?.avatar || `https://ui-avatars.com/api/?name=${group.user?.username}&background=2563eb&color=fff`}
                        className="w-full h-full object-cover"
                        alt={group.user?.username}
                      />
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-14 text-center">
                  {isOwn ? "Your story" : group.user?.username}
                </span>
                {group.stories.length > 1 && (
                  <span className="text-[9px] text-blue-500 -mt-1">{group.stories.length} stories</span>
                )}
              </motion.div>
            );
          })}

          {userGroups.length === 0 && (
            <div className="flex items-center text-gray-400 text-xs py-2 px-2">
              No stories yet — be the first!
            </div>
          )}
        </div>
      </div>

      {/* Story Creator */}
      <AnimatePresence>
        {showCreator && (
          <StoryCreator
            onClose={() => setShowCreator(false)}
            onStoryCreated={(story) => {
              setStories(prev => [story, ...prev]);
              setShowCreator(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewingIndex !== null && (
          <StoryViewer
            stories={flatStories}
            startIndex={viewingIndex}
            onClose={() => setViewingIndex(null)}
            currentUserId={user?._id}
          />
        )}
      </AnimatePresence>
    </>
  );
}
