import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, Video, Smile, Send } from "lucide-react";
import api from "../api/axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me").then(res => setUser(res.data.user)).catch(() => {});
    api.get("/posts").then(res => setPosts(res.data.posts || [])).catch(() => {});
  }, []);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/posts", { content: text });
      setPosts(prev => [res.data.post, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
      >
        <div className="flex gap-3 items-start">
          <img
            src={user?.avatar || "https://i.pravatar.cc/200"}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 text-sm pt-2"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-4">
            <button className="flex items-center gap-1.5 text-blue-500 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
              <Image size={16} /> Photo
            </button>
            <button className="flex items-center gap-1.5 text-purple-500 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition">
              <Video size={16} /> Video
            </button>
            <button className="flex items-center gap-1.5 text-yellow-500 text-sm font-medium hover:bg-yellow-50 px-3 py-1.5 rounded-lg transition">
              <Smile size={16} /> Feeling
            </button>
          </div>
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="bg-gradient-to-r from-sky-500 to-blue-700 text-white px-5 py-1.5 rounded-xl text-sm font-semibold disabled:opacity-40 hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Send size={14} /> Post
          </button>
        </div>
      </motion.div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <motion.div
            key={post._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.author?.avatar || "https://i.pravatar.cc/200"}
                className="w-9 h-9 rounded-full object-cover"
                alt="avatar"
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">{post.author?.username || "User"}</p>
                <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
            {post.image && (
              <img src={post.image} className="mt-3 rounded-xl w-full object-cover max-h-80" alt="post" />
            )}
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
              <button className="text-gray-400 text-sm hover:text-blue-500 transition">👍 Like</button>
              <button className="text-gray-400 text-sm hover:text-blue-500 transition">💬 Comment</button>
              <button className="text-gray-400 text-sm hover:text-blue-500 transition">↗️ Share</button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}