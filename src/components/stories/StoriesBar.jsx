import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useUpload from "../../hooks/useUpload";
import api from "../../api/axios";

const mockStories = [
  { _id: "1", user: { username: "alexj", avatar: "https://i.pravatar.cc/150?img=1" }, image: "https://picsum.photos/400/700?random=1", seen: false },
  { _id: "2", user: { username: "sarahk", avatar: "https://i.pravatar.cc/150?img=2" }, image: "https://picsum.photos/400/700?random=2", seen: false },
  { _id: "3", user: { username: "mikechen", avatar: "https://i.pravatar.cc/150?img=3" }, image: "https://picsum.photos/400/700?random=3", seen: true },
  { _id: "4", user: { username: "emmad", avatar: "https://i.pravatar.cc/150?img=4" }, image: "https://picsum.photos/400/700?random=4", seen: true },
  { _id: "5", user: { username: "jameslee", avatar: "https://i.pravatar.cc/150?img=5" }, image: "https://picsum.photos/400/700?random=5", seen: false },
  { _id: "6", user: { username: "techcrunch", avatar: "https://i.pravatar.cc/150?img=12" }, image: "https://picsum.photos/400/700?random=6", seen: true },
];

function StoryViewer({ story, onClose, onPrev, onNext }) {
  const [progress, setProgress] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full max-w-sm h-full max-h-[700px]" onClick={e => e.stopPropagation()}>
        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              onAnimationComplete={onNext}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={story.user?.avatar} className="w-9 h-9 rounded-full border-2 border-white object-cover" alt="avatar" />
            <span className="text-white font-semibold text-sm">{story.user?.username}</span>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition">
            <X size={22} />
          </button>
        </div>

        {/* Story Image */}
        <img
          src={story.image}
          className="w-full h-full object-cover rounded-2xl"
          alt="story"
        />

        {/* Navigation */}
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
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
  const { uploadImage, uploading } = useUpload();
  const [stories, setStories] = useState(mockStories);
  const [viewingIndex, setViewingIndex] = useState(null);
  const fileRef = useRef();

  const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      const newStory = {
        _id: Date.now().toString(),
        user: { username: user?.username, avatar: user?.avatar },
        image: url,
        seen: false,
        isOwn: true,
      };
      setStories(prev => [newStory, ...prev]);
      try {
        await api.post("/stories", { image: url });
      } catch (e) {}
    }
  };

  const openStory = (index) => setViewingIndex(index);
  const closeStory = () => setViewingIndex(null);
  const prevStory = () => setViewingIndex(prev => Math.max(0, prev - 1));
  const nextStory = () => {
    if (viewingIndex < stories.length - 1) {
      setViewingIndex(prev => prev + 1);
    } else {
      closeStory();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#15202b] border-b border-gray-100 dark:border-[#38444d] px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {/* Add Story */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="relative w-14 h-14 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={20} className="text-blue-600" />
              )}
              {user?.avatar && (
                <img
                  src={user.avatar}
                  className="absolute inset-0 w-full h-full rounded-full object-cover opacity-30"
                  alt="your avatar"
                />
              )}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-14 text-center">Your story</span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAddStory} />
          </div>

          {/* Stories */}
          {stories.map((story, i) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
              onClick={() => openStory(i)}
            >
              <div className={`w-14 h-14 rounded-full p-0.5 ${story.seen ? "bg-gray-200 dark:bg-gray-600" : "bg-gradient-to-tr from-blue-500 to-purple-500"}`}>
                <img
                  src={story.user?.avatar || `https://ui-avatars.com/api/?name=${story.user?.username}&background=2563eb&color=fff`}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#15202b]"
                  alt={story.user?.username}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-14 text-center">
                {story.user?.username}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewingIndex !== null && (
          <StoryViewer
            story={stories[viewingIndex]}
            onClose={closeStory}
            onPrev={prevStory}
            onNext={nextStory}
          />
        )}
      </AnimatePresence>
    </>
  );
}