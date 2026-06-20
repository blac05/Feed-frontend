import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronLeft, ChevronRight, Heart, Eye, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import useUpload from "../../hooks/useUpload";
import api from "../../api/axios";

function StoryViewer({ stories, startIndex, onClose, currentUserId }) {
  const [index, setIndex] = useState(startIndex);
  const story = stories[index];
  const { toast } = useToast();

  useEffect(() => {
    // Mark as viewed
    if (story?._id && !story._id.startsWith("temp-")) {
      api.put(`/stories/${story._id}/view`).catch(() => {});
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

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm h-[85vh] max-h-[700px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              {i === index && (
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  onAnimationComplete={next}
                />
              )}
              {i < index && <div className="h-full w-full bg-white rounded-full" />}
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
              <p className="text-white/60 text-xs">
                {story.views?.length || 0} views
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {story.user?._id === currentUserId && (
              <button onClick={handleDelete} className="text-white/80 hover:text-red-400 transition">
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={onClose} className="text-white hover:text-gray-300 transition">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Story Image */}
        <img
          src={story.image}
          className="w-full h-full object-cover rounded-2xl"
          alt="story"
        />

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

export default function StoriesBar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImage, uploading } = useUpload();
  const [stories, setStories] = useState([]);
  const [viewingIndex, setViewingIndex] = useState(null);
  const fileRef = useRef();

  // ✅ Load real stories from API
  useEffect(() => {
    api.get("/stories")
      .then(res => setStories(res.data.stories || []))
      .catch(() => {});
  }, []);

  const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) {
      toast({ message: "Upload failed", type: "error" });
      return;
    }
    try {
      const res = await api.post("/stories", { image: url });
      setStories(prev => [res.data.story, ...prev]);
      toast({ message: "Story posted!", type: "success" });
    } catch (e) {
      toast({ message: "Failed to post story", type: "error" });
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="relative w-14 h-14 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition overflow-hidden"
            >
              {user?.avatar && (
                <img src={user.avatar} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="you" />
              )}
              {uploading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <div className="relative z-10 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Plus size={12} className="text-white" />
                </div>
              )}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-14 text-center">
              {uploading ? "Posting..." : "Add story"}
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAddStory} />
          </div>

          {/* Stories List */}
          {stories.map((story, i) => {
            const isSeen = story.views?.includes(user?._id);
            const isOwn = story.user?._id === user?._id || story.user === user?._id;
            return (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
                onClick={() => setViewingIndex(i)}
              >
                <div className={`w-14 h-14 rounded-full p-0.5 ${
                  isSeen
                    ? "bg-gray-200 dark:bg-gray-600"
                    : isOwn
                    ? "bg-gradient-to-tr from-blue-500 to-blue-700"
                    : "bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500"
                }`}>
                  <img
                    src={story.user?.avatar || `https://ui-avatars.com/api/?name=${story.user?.username}&background=2563eb&color=fff`}
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#15202b]"
                    alt={story.user?.username}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-14 text-center">
                  {isOwn ? "Your story" : story.user?.username}
                </span>
              </motion.div>
            );
          })}

          {stories.length === 0 && !uploading && (
            <div className="flex items-center text-gray-400 text-xs py-2 px-2">
              No stories yet — be the first!
            </div>
          )}
        </div>
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewingIndex !== null && (
          <StoryViewer
            stories={stories}
            startIndex={viewingIndex}
            onClose={() => setViewingIndex(null)}
            currentUserId={user?._id}
          />
        )}
      </AnimatePresence>
    </>
  );
}
