import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Hash, CheckCircle, X, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const trendingTopics = [
  { tag: "Technology", posts: "125K", category: "Technology" },
  { tag: "AI", posts: "98K", category: "Technology" },
  { tag: "Design", posts: "67K", category: "Art & Design" },
  { tag: "Startups", posts: "54K", category: "Business" },
  { tag: "Music", posts: "43K", category: "Entertainment" },
  { tag: "Football", posts: "38K", category: "Sports" },
  { tag: "Gaming", posts: "31K", category: "Gaming" },
  { tag: "Photography", posts: "29K", category: "Art & Design" },
  { tag: "Crypto", posts: "24K", category: "Finance" },
  { tag: "Climate", posts: "19K", category: "Science" },
];

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const tabs = ["For You", "Trending", "News", "Sports", "Entertainment"];

export default function Explore() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("For You");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [following, setFollowing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Load all posts for explore
    api.get("/posts").then(res => setPosts(res.data.posts || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get("/posts");
        const filtered = (res.data.posts || []).filter(p =>
          p.content?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.username?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.name?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleFollow = async (userId) => {
    try {
      const res = await api.post(`/users/${userId}/follow`);
      setFollowing(prev => ({ ...prev, [userId]: res.data.following }));
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  // Filter posts by tab
  const tabPosts = posts.filter(p => {
    if (activeTab === "For You") return true;
    if (activeTab === "Trending") return p.likes?.length > 0;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search
            size={17}
            className={`absolute left-4 top-3 transition ${focused ? "text-blue-500" : "text-gray-400"}`}
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search Feed"
            className="w-full pl-11 pr-10 py-2.5 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {searching ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No results for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              <div>
                <p className="px-4 py-3 text-sm font-bold text-gray-500 border-b border-gray-100">
                  {searchResults.length} results for "{query}"
                </p>
                {searchResults.map((post, i) => (
                  <motion.div
                    key={post._id || i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <img
                      src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      alt="avatar"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-gray-900">{post.author?.name || post.author?.username}</span>
                        {post.author?.isVerified && (
                          <CheckCircle size={13} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                        )}
                        <span className="text-gray-400 text-xs">· {timeAgo(post.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5 line-clamp-2">{post.content}</p>
                      {post.image && (
                        <img src={post.image} className="mt-2 rounded-xl w-full max-h-40 object-cover" alt="post" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Explore Content */}
      {!query && (
        <>
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-white sticky top-[65px] z-10">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold transition relative ${
                  activeTab === tab ? "text-gray-900" : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="explore-tab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Trending Topics Grid */}
          <div className="border-b border-gray-100">
            <div className="px-4 py-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <h2 className="font-bold text-gray-900">Trending topics</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100">
              {trendingTopics.slice(0, 6).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white px-4 py-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <p className="text-xs text-gray-400 mb-1">{item.category} · Trending</p>
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-blue-600 flex-shrink-0" />
                    <p className="font-bold text-gray-900 text-sm truncate">{item.tag}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.posts} posts</p>
                </motion.div>
              ))}
            </div>
            <button className="w-full px-4 py-3 text-blue-500 text-sm font-medium hover:bg-gray-50 transition text-left border-t border-gray-100">
              Show more trending topics
            </button>
          </div>

          {/* Who to Follow */}
          <div className="border-b border-gray-100">
            <div className="px-4 py-3 flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <h2 className="font-bold text-gray-900">Who to follow</h2>
            </div>
            {[
              { name: "TechCrunch", username: "techcrunch", avatar: "https://i.pravatar.cc/150?img=12", verified: true, type: "company", bio: "Breaking tech news" },
              { name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=3", verified: false, type: "creator", bio: "UI/UX Designer & Creator" },
              { name: "Sarah Kim", username: "sarahk", avatar: "https://i.pravatar.cc/150?img=5", verified: true, type: "popstar", bio: "Singer · Songwriter" },
              { name: "Mike Chen", username: "mikechen", avatar: "https://i.pravatar.cc/150?img=8", verified: false, type: "personal", bio: "Software Engineer @ Meta" },
            ].map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100"
              >
                <img src={u.avatar} className="w-11 h-11 rounded-full object-cover flex-shrink-0" alt={u.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm text-gray-900 truncate">{u.name}</p>
                    {u.verified && (
                      <CheckCircle size={13} className={badgeColor[u.type]} />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{u.bio}</p>
                </div>
                <button className="flex-shrink-0 bg-gray-900 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-gray-700 transition">
                  Follow
                </button>
              </motion.div>
            ))}
            <button className="w-full px-4 py-3 text-blue-500 text-sm font-medium hover:bg-gray-50 transition text-left border-t border-gray-100">
              Show more people
            </button>
          </div>

          {/* Latest Posts */}
          <div>
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Latest posts</h2>
            </div>
            {tabPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="font-semibold">No posts yet</p>
              </div>
            ) : (
              tabPosts.map((post, i) => (
                <motion.div
                  key={post._id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                >
                  <img
                    src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt="avatar"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{post.author?.name || post.author?.username}</span>
                      {post.author?.isVerified && (
                        <CheckCircle size={13} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                      )}
                      <span className="text-gray-400 text-xs">@{post.author?.username}</span>
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-3">{post.content}</p>
                    {post.image && (
                      <img src={post.image} className="mt-2 rounded-2xl w-full max-h-52 object-cover border border-gray-100" alt="post" />
                    )}
                    <div className="flex gap-4 mt-2 text-gray-400 text-xs">
                      <span>❤️ {post.likes?.length || 0}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                      <span>🔁 {post.reposts?.length || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
