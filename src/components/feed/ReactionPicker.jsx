import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like", color: "text-blue-500" },
  { type: "love", emoji: "❤️", label: "Love", color: "text-red-500" },
  { type: "haha", emoji: "😂", label: "Haha", color: "text-yellow-400" },
  { type: "wow", emoji: "😮", label: "Wow", color: "text-yellow-400" },
  { type: "sad", emoji: "😢", label: "Sad", color: "text-yellow-400" },
  { type: "angry", emoji: "😡", label: "Angry", color: "text-orange-500" },
];

const reactionEmoji = {
  like: "👍", love: "❤️", haha: "😂", wow: "😮", sad: "😢", angry: "😡",
};

export default function ReactionPicker({ postId, likes = [], reactions = [], currentUserId, onReact }) {
  const [showPicker, setShowPicker] = useState(false);
  const [hovered, setHovered] = useState(null);
  const timerRef = useRef();
  const pickerRef = useRef();

  // Find current user's reaction
  const userReaction = reactions.find(r => r.user === currentUserId || r.user?._id === currentUserId);
  const hasLiked = likes.includes(currentUserId);
  const activeReaction = userReaction?.type || (hasLiked ? "like" : null);

  // Count reactions by type
  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});
  const totalReactions = likes.length || reactions.length || 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowPicker(true), 400);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowPicker(false), 300);
  };

  const handleClick = () => {
    if (activeReaction) {
      onReact(null); // Remove reaction
    } else {
      onReact("like"); // Default like
    }
  };

  const handleReact = (type) => {
    setShowPicker(false);
    onReact(activeReaction === type ? null : type);
  };

  return (
    <div
      className="relative"
      ref={pickerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reaction Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-10 left-0 z-30 bg-white dark:bg-[#1e2732] rounded-full shadow-xl border border-gray-100 dark:border-[#38444d] px-3 py-2 flex gap-1"
          >
            {REACTIONS.map(({ type, emoji, label }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.4, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(type)}
                onMouseEnter={() => setHovered(type)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-col items-center"
                title={label}
              >
                <span className="text-2xl leading-none">{emoji}</span>
                {hovered === type && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 text-[10px] font-semibold bg-gray-800 text-white px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm transition group ${
          activeReaction
            ? "text-blue-500"
            : "text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        }`}
      >
        {activeReaction ? (
          <span className="text-base leading-none">{reactionEmoji[activeReaction]}</span>
        ) : (
          <Heart size={17} className="group-hover:scale-110 transition" />
        )}
        <span className="text-xs">{totalReactions}</span>
      </button>
    </div>
  );
}
