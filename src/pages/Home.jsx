import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, Video, Smile, Send, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, CheckCircle } from "lucide-react";
import api from "../api/axios";

const verifiedBadge = (user) => {
  if (!user?.isVerified) return null;
  const colors = {
    personal: "text-blue-500",
    creator: "text-purple-500",
    company: "text-blue-700",
    prominent: "text-yellow-500",
    popstar: "text-pink-500",
  };
  return <CheckCircle size={14} className={`inline ml-1 ${colors[user.accountType] || "text-blue-500"}`} />;
};

const tabs = ["For You", "Following", "News", "Trending"];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("For You");
  const [image, setImage] = useState(null);

  useEffect(() => {
    api.get("/users/me").then(res => setUser(res.data.user)).catch(() => {});
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const res = await api.get("/posts");
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
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/posts", { content: text, image });
      setPosts(prev => [res.data.post, ...prev]);
      setText("");
      setImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id) => {
    try {
      await api.put(`/posts/${id}/like`);
      setPosts(prev => prev.map(p =>
        p._id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes.slice(0, -1) : [...p.likes, "me"] }
          : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
      >
        <div className="flex gap-3 items-start">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=2563eb&color=fff`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's happening?"
            className="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 text-sm pt-1"
            rows={2}
          />
        </div>

        {image && (
          <div className="relative mt-3">
            <img src={image} className="rounded-xl w-full max-h-60 object-cover" alt="preview" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >×</button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 text-blue-500 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer">
              <Image size={16} /> Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
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

      {/* Feed */}
      {fetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <motion.div
            key={post._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm text-gray-800">{post.author?.name || post.author?.username}</p>
                    {verifiedBadge(post.author)}
                  </div>
                  <p className="text-xs text-gray-400">
                    @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-500 transition">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                className="rounded-2xl w-full object-cover max-h-96 mb-3"
                alt="post"
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <button
                onClick={() => likePost(post._id)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition ${
                  post.liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart size={16} className={post.liked ? "fill-red-500" : ""} />
                {post.likes?.length || 0}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition">
                <MessageCircle size={16} />
                {post.comments?.length || 0}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-500 hover:bg-green-50 px-3 py-1.5 rounded-xl transition">
                <Repeat2 size={16} />
                {post.reposts?.length || 0}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition">
                <Share size={16} />
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}