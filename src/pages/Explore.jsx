import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Hash, CheckCircle, X, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

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

const suggestedUsers = [
  { name: "TechCrunch", username: "techcrunch", avatar: "https://i.pravatar.cc/150?img=12", verified: true, type: "company", bio: "Breaking tech news" },
  { name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=3", verified: false, type: "creator", bio: "UI/UX Designer & Creator" },
  { name: "Sarah Kim", username: "sarahk", avatar: "https://i.pravatar.cc/150?img=5", verified: true, type: "popstar", bio: "Singer · Songwriter" },
  { name: "Mike Chen", username: "mikechen", avatar: "https://i.pravatar.cc/150?img=8", verified: false, type: "personal", bio: "Software Engineer @ Meta" },
];

export default function Explore() {
  const { toast } = useToast();
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
    api.get("/posts").then(res => setPosts(res.data.posts || [])).catch(() => {});
  }, []);

  // ✅ Fixed search — searches both users and posts
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setUsers([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const [postsRes, usersRes] = await Promise.all([
          api.get("/posts"),
          api.get(`/users/search?q=${encodeURIComponent(query)}`),
        ]);
        const filteredPosts = (postsRes.data.posts || []).filter(p =>
          p.content?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.username?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.name?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredPosts);
        setUsers(usersRes.data.users || []);
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
      toast({ message: res.data.following ? "Following!" : "Unfollowed", type: "success" });
    } catch (err) {
      toast({ message: "Failed to follow", type: "error" });
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  const tabPosts = posts.filter(p => {
    if (activeTab === "For You") return true;
    if (activeTab === "Trending") return (p.likes?.length || 0) > 0;
    return true;
  });

  return (
    <div className="min-h-screen dark:bg-[#15202b]">

      {/* Sticky Search Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
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
            placeholder="Search people, posts, topics..."
            className="w-full pl-11 pr-10 py-2.5 bg-gray-100 dark:bg-[#253341] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-[#1e2732] transition"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setUsers([]); setSearchResults([]); }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
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
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : users.length === 0 && searchResults.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold text-gray-600 dark:text-gray-400">No results for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords or names</p>
              </div>
            ) : (
              <div>
                {/* ✅ People results */}
                {users.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-[#1e2732] border-b border-gray-100 dark:border-[#38444d]">
                      People
                    </p>
                    {users.map((u, i) => (
                      <motion.div
                        key={u._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50 dark:hover:bg-[#1e2732] transition cursor-pointer"
                        onClick={() => navigate(`/profile/${u._id}`)}
                      >
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                          alt={u.username}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                              {u.name || u.username}
                            </p>
                            {u.isVerified && (
                              <CheckCircle size={13} className={badgeColor[u.accountType] || "text-blue-500"} />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">@{u.username}</p>
                          {u.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{u.bio}</p>}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); handleFollow(u._id); }}
                          className={`flex-shrink-0 text-sm font-bold px-4 py-1.5 rounded-full transition ${
                            following[u._id]
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              : "bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:opacity-80"
                          }`}
                        >
                          {following[u._id] ? "Following" : "Follow"}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ✅ Post results */}
                {searchResults.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-[#1e2732] border-b border-gray-100 dark:border-[#38444d]">
                      Posts · {searchResults.length} results
                    </p>
                    {searchResults.map((post, i) => (
                      <motion.div
                        key={post._id || i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50 dark:hover:bg-[#1e2732] cursor-pointer transition"
                      >
                        <img
                          src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          alt="avatar"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {post.author?.name || post.author?.username}
                            </span>
                            {post.author?.isVerified && (
                              <CheckCircle size={13} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                            )}
                            <span className="text-gray-400 text-xs">@{post.author?.username}</span>
                            <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                            <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 line-clamp-2">{post.content}</p>
                          {post.image && (
                            <img src={post.image} className="mt-2 rounded-xl w-full max-h-40 object-cover border border-gray-100 dark:border-[#38444d]" alt="post" />
                          )}
                          <div className="flex gap-4 mt-1.5 text-gray-400 text-xs">
                            <span>❤️ {post.likes?.length || 0}</span>
                            <span>💬 {post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Explore Content */}
      {!query && (
        <>
          {/* Tabs — fixed alignment using border-b-2 */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-[#38444d] bg-white dark:bg-[#15202b] sticky top-[65px] z-10">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold transition border-b-2 ${
                  activeTab === tab
                    ? "text-gray-900 dark:text-white border-blue-600"
                    : "text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-50 dark:hover:bg-[#1e2732]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Trending Topics Grid */}
          <div className="border-b border-gray-100 dark:border-[#38444d]">
            <div className="px-4 py-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Trending topics</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-[#38444d]">
              {trendingTopics.slice(0, 6).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#15202b] px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
                >
                  <p className="text-xs text-gray-400 mb-1">{item.category} · Trending</p>
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-blue-600 flex-shrink-0" />
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.tag}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.posts} posts</p>
                </motion.div>
              ))}
            </div>
            <button className="w-full px-4 py-3 text-blue-500 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1e2732] transition text-left border-t border-gray-100 dark:border-[#38444d] dark:text-blue-400">
              Show more trending topics
            </button>
          </div>

          {/* Who to Follow */}
          <div className="border-b border-gray-100 dark:border-[#38444d]">
            <div className="px-4 py-3 flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Who to follow</h2>
            </div>
            {suggestedUsers.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1e2732] transition border-t border-gray-100 dark:border-[#38444d]"
              >
                <img src={u.avatar} className="w-11 h-11 rounded-full object-cover flex-shrink-0" alt={u.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{u.name}</p>
                    {u.verified && <CheckCircle size={13} className={badgeColor[u.type]} />}
                  </div>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{u.bio}</p>
                </div>
                <button
                  onClick={() => toast({ message: "Followed!", type: "success" })}
                  className="flex-shrink-0 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:opacity-80 transition"
                >
                  Follow
                </button>
              </motion.div>
            ))}
            <button className="w-full px-4 py-3 text-blue-500 dark:text-blue-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1e2732] transition text-left border-t border-gray-100 dark:border-[#38444d]">
              Show more people
            </button>
          </div>

          {/* Latest Posts */}
          <div>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
              <h2 className="font-bold text-gray-900 dark:text-white">Latest posts</h2>
            </div>
            {tabPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="font-semibold">No posts yet</p>
                <p className="text-sm mt-1">Be the first to post something!</p>
              </div>
            ) : (
              tabPosts.map((post, i) => (
                <motion.div
                  key={post._id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50 dark:hover:bg-[#1e2732] transition cursor-pointer"
                >
                  <img
                    src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt="avatar"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {post.author?.name || post.author?.username}
                      </span>
                      {post.author?.isVerified && (
                        <CheckCircle size={13} className={badgeColor[post.author?.accountType] || "text-blue-500"} />
                      )}
                      <span className="text-gray-400 text-xs">@{post.author?.username}</span>
                      <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                      <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        className="mt-2 rounded-2xl w-full max-h-52 object-cover border border-gray-100 dark:border-[#38444d]"
                        alt="post"
                      />
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