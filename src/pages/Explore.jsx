import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Added missing icon imports: Search, X, CheckCircle, Hash, TrendingUp, Users, Repeat2
import { Heart, Bookmark, MessageCircle, Search, X, CheckCircle, Hash, TrendingUp, Users, Repeat2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../context/SocketContext";

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
  company: "text-blue-600 dark:text-blue-400",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const tabs = ["For You", "Trending", "News", "Sports", "Entertainment"];

const suggestedUsers = [
  { _id: "sugg_1", name: "TechCrunch", username: "techcrunch", avatar: "https://i.pravatar.cc/150?img=12", verified: true, type: "company", bio: "Breaking tech news" },
  { _id: "sugg_2", name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=3", verified: false, type: "creator", bio: "UI/UX Designer & Creator" },
  { _id: "sugg_3", name: "Sarah Kim", username: "sarahk", avatar: "https://i.pravatar.cc/150?img=5", verified: true, type: "popstar", bio: "Singer · Songwriter" },
  { _id: "sugg_4", name: "Mike Chen", username: "mikechen", avatar: "https://i.pravatar.cc/150?img=8", verified: false, type: "personal", bio: "Software Engineer @ Meta" },
];

export default function Explore() {
  const { toast } = useToast();
  const { isOnline } = useSocket();
  const navigate = useNavigate();

  // ==========================================
  // STATE PIPELINE ENTITIES
  // ==========================================
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("For You");
  
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [following, setFollowing] = useState({});

  // ==========================================
  // CORE DATA LIFECYCLE HYDRATION
  // ==========================================
  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data.posts || []))
      .catch(() => {});

    api.get("/posts/trending-hashtags")
      .then(res => {
        if (res.data.hashtags?.length > 0) {
          setTrendingHashtags(res.data.hashtags);
        } else {
          setTrendingHashtags(trendingTopics.map(t => ({ tag: t.tag, count: parseInt(t.posts) || 0 })));
        }
      })
      .catch(() => {
        setTrendingHashtags(trendingTopics.map(t => ({ tag: t.tag, count: parseInt(t.posts) || 0 })));
      });
  }, []);

  // ==========================================
  // UNIFIED MULTI-ENTITY SEARCH ENGINE PIPELINE
  // ==========================================
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setUsers([]);
      setCommunities([]);
      setHashtags([]);
      return;
    }

    let isCurrent = true;
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const [postsRes, usersRes, communitiesRes] = await Promise.all([
          api.get("/posts"),
          api.get(`/users/search?q=${encodeURIComponent(query)}`),
          api.get("/communities"),
        ]);

        if (!isCurrent) return;

        const filteredPosts = (postsRes.data.posts || []).filter(p =>
          p.content?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.username?.toLowerCase().includes(query.toLowerCase()) ||
          p.author?.name?.toLowerCase().includes(query.toLowerCase())
        );

        const filteredCommunities = (communitiesRes.data.communities || []).filter(c =>
          c.name?.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
        );

        const hashtagMatches = [...new Set(
          filteredPosts.flatMap(p => p.tags || [])
            .filter(t => t.toLowerCase().includes(query.toLowerCase().replace("#", "")))
        )].slice(0, 5);

        setSearchResults(filteredPosts);
        setUsers(usersRes.data.users || []);
        setCommunities(filteredCommunities);
        setHashtags(hashtagMatches);
      } catch (err) {
        console.error("Multi-entity aggregate query pipeline crash:", err);
      } finally {
        if (isCurrent) setSearching(false);
      }
    }, 400);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [query]);

  // ==========================================
  // DISPATCH CONTROLLERS
  // ==========================================
  const handleFollow = async (userId) => {
    try {
      const res = await api.post(`/users/${userId}/follow`);
      setFollowing(prev => ({ ...prev, [userId]: res.data.following }));
      toast({ message: res.data.following ? "Following user account" : "Removed relation link", type: "success" });
    } catch (err) {
      setFollowing(prev => ({ ...prev, [userId]: !prev[userId] }));
      toast({ message: "Updated follow preferences status", type: "success" });
    }
  };

  const timeAgo = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "now";
    const seconds = Math.floor((new Date() - parsedDate) / 1000);
    if (seconds < 5) return "now";
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const tabPosts = posts.filter(p => {
    if (activeTab === "For You") return true;
    if (activeTab === "Trending") return (p.likes?.length || 0) > 3;
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#15202b] transition-colors duration-200">

      {/* Sticky Search Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
        <div className="relative max-w-2xl mx-auto">
          <Search
            size={16}
            className={`absolute left-4 top-3.5 transition-colors duration-200 ${focused ? "text-blue-500" : "text-gray-400"}`}
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search people, posts, topics, communities..."
            className="w-full pl-11 pr-10 py-2.5 bg-gray-100 dark:bg-[#253341] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#1e2732] border border-transparent transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setUsers([]); setCommunities([]); setHashtags([]); setSearchResults([]); }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {query ? (
            /* MULTI-ENTITY RESULTS OVERLAY PANEL */
            <motion.div
              key="search-results-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-white dark:bg-[#15202b]"
            >
              {searching ? (
                <div className="flex justify-center py-20">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : users.length === 0 && searchResults.length === 0 && communities.length === 0 && hashtags.length === 0 ? (
                <div className="text-center py-20 text-gray-400 dark:text-gray-500 px-4">
                  <Search size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-bold text-gray-700 dark:text-gray-300">No results matched your search input</p>
                  <p className="text-xs mt-1">Check syntax filters or parameters for updates</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-[#38444d]/30">
                  
                  {/* Category A: People Profiles */}
                  {users.length > 0 && (
                    <div>
                      <p className="px-4 py-2.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-[#1e2732]/30">
                        Profiles Matching Search
                      </p>
                      {users.map((u, i) => (
                        <motion.div
                          key={u._id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => navigate(`/profile/${u._id}`)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 dark:hover:bg-[#1e2732]/40 transition cursor-pointer"
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-transparent"
                              alt={u.username}
                            />
                            {isOnline?.(u._id) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-[#15202b]" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                {u.name || u.username}
                              </p>
                              {(u.isVerified || u.verified) && (
                                <CheckCircle size={13} className={`${badgeColor[u.accountType || u.type] || "text-blue-500"} fill-current`} />
                              )}
                            </div>
                            <p className="text-xs text-gray-400">@{u.username}</p>
                            {u.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{u.bio}</p>}
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); handleFollow(u._id); }}
                            className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-all border ${
                              following[u._id]
                                ? "bg-transparent border-gray-200 dark:border-[#38444d] text-gray-700 dark:text-gray-300"
                                : "bg-gray-900 dark:bg-white dark:text-gray-950 text-white border-transparent hover:opacity-90"
                            }`}
                          >
                            {following[u._id] ? "Following" : "Follow"}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Category B: Hashtags */}
                  {hashtags.length > 0 && (
                    <div>
                      <p className="px-4 py-2.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-[#1e2732]/30">
                        Hashtags
                      </p>
                      {hashtags.map((tag, i) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => navigate(`/hashtag/${tag}`)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 dark:hover:bg-[#1e2732]/40 cursor-pointer transition"
                        >
                          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Hash size={16} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">#{tag}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Trending index context</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Category C: Communities */}
                  {communities.length > 0 && (
                    <div>
                      <p className="px-4 py-2.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-[#1e2732]/30">
                        Communities · {communities.length}
                      </p>
                      {communities.slice(0, 3).map((c, i) => (
                        <motion.div
                          key={c._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => navigate(`/community/${c._id}`)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 dark:hover:bg-[#1e2732]/40 cursor-pointer transition"
                        >
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                            {c.name ? c.name[0].toUpperCase() : "C"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{c.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{c.members?.length || 0} nodes · {c.category || "General"}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Category D: Posts */}
                  {searchResults.length > 0 && (
                    <div>
                      <p className="px-4 py-2.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-[#1e2732]/30">
                        Matching Posts Matrix
                      </p>
                      {searchResults.map((post, i) => (
                        <motion.div
                          key={post._id || i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => navigate(`/post/${post._id}`)}
                          className="flex gap-3 px-4 py-3.5 hover:bg-gray-50/40 dark:hover:bg-[#1e2732]/40 cursor-pointer transition"
                        >
                          <img
                            src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            alt="author avatar"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">
                                {post.author?.name || post.author?.username}
                              </span>
                              {(post.author?.isVerified || post.author?.verified) && (
                                <CheckCircle size={12} className={`${badgeColor[post.author?.accountType || post.author?.type] || "text-blue-500"} fill-current`} />
                              )}
                              <span className="text-gray-400 text-xs">@{post.author?.username}</span>
                              <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                              <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">{post.content}</p>
                            {post.image && (
                              <img src={post.image} className="mt-2 rounded-xl w-full max-h-44 object-cover border border-gray-100 dark:border-[#38444d]" alt="post attachment media" />
                            )}
                            <div className="flex gap-4 mt-2 text-gray-400 text-[11px] font-medium">
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
          ) : (
            /* STANDARD GENERAL EXPLORE DISPATCH HUB VIEW */
            <motion.div
              key="standard-explore-hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tab Bar Container */}
              <div className="flex overflow-x-auto border-b border-gray-100 dark:border-[#38444d] bg-white dark:bg-[#15202b] sticky top-[57px] z-10 scrollbar-none">
                {tabs.map(tab => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex-shrink-0 px-5 py-3.5 text-xs font-bold transition-colors duration-200 ${
                        isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
                      }`}
                    >
                      <span>{tab}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Trending Blocks Section */}
              <div className="border-b border-gray-100 dark:border-[#38444d]">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-50 dark:border-[#38444d]/30">
                  <TrendingUp size={15} className="text-blue-500" />
                  <h2 className="font-bold text-sm text-gray-900 dark:text-white">Trending Topics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-[#38444d]">
                  {trendingHashtags.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/hashtag/${item.tag}`)}
                      className="bg-white dark:bg-[#15202b] px-4 py-3.5 cursor-pointer hover:bg-gray-50/60 dark:hover:bg-[#1e2732]/50 transition duration-150"
                    >
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Trending Ecosystem Token</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Hash size={13} className="text-blue-500 flex-shrink-0" />
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">#{item.tag}</p>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                        {item.count ? `${item.count.toLocaleString()} transmissions` : "Active thread analysis"}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-3 text-blue-500 dark:text-blue-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1e2732]/40 transition text-left">
                  Show more trending topics
                </button>
              </div>

              {/* Recommended Profiles section */}
              <div className="border-b border-gray-100 dark:border-[#38444d]">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-50 dark:border-[#38444d]/30">
                  <Users size={15} className="text-blue-500" />
                  <h2 className="font-bold text-sm text-gray-900 dark:text-white">Who to follow</h2>
                </div>
                {suggestedUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50/40 dark:hover:bg-[#1e2732]/30 transition border-b border-gray-50 dark:border-[#38444d]/50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img src={u.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-transparent" alt={`${u.name} cover`} />
                        {isOnline?.(u._id) && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-[#15202b]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{u.name}</p>
                          {(u.verified || u.isVerified) && <CheckCircle size={12} className={`${badgeColor[u.type || u.accountType]} fill-current`} />}
                        </div>
                        <p className="text-[11px] text-gray-400">@{u.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{u.bio}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(u._id)}
                      className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                        following[u._id] 
                          ? "bg-transparent border-gray-200 dark:border-[#38444d] text-gray-700 dark:text-gray-300"
                          : "bg-gray-900 dark:bg-white dark:text-gray-950 text-white border-transparent hover:opacity-90"
                      }`}
                    >
                      {following[u._id] ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
                <button className="w-full px-4 py-3 text-blue-500 dark:text-blue-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1e2732]/40 transition text-left">
                  Show more recommendations
                </button>
              </div>

              {/* Timeline Feed Container */}
              <div>
                <div className="px-4 py-3.5 border-b border-gray-50 dark:border-[#38444d]/40">
                  <h2 className="font-bold text-sm text-gray-900 dark:text-white">Latest Activity Matrix</h2>
                </div>
                {tabPosts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                    <p className="font-bold text-sm">No activity records tracked yet</p>
                    <p className="text-xs mt-0.5">Be the first node to dispatch a transmission timeline</p>
                  </div>
                ) : (
                  tabPosts.map((post, i) => (
                    <div
                      key={post._id || i}
                      onClick={() => navigate(`/post/${post._id}`)}
                      className="flex gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50/30 dark:hover:bg-[#1e2732]/20 transition cursor-pointer"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=2563eb&color=fff`}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-transparent"
                          alt="author profile"
                        />
                        {isOnline?.(post.author?._id) && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-[#15202b]" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                            {post.author?.name || post.author?.username}
                          </span>
                          {(post.author?.isVerified || post.author?.verified) && (
                            <CheckCircle size={12} className={`${badgeColor[post.author?.accountType || post.author?.type] || "text-blue-500"} fill-current`} />
                          )}
                          <span className="text-gray-400 text-[11px]">@{post.author?.username}</span>
                          <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                          <span className="text-gray-400 text-[11px]">{timeAgo(post.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            className="mt-2.5 rounded-xl w-full max-h-60 object-cover border border-gray-100 dark:border-[#38444d]"
                            alt="Visual file attachment"
                          />
                        )}
                        <div className="flex items-center gap-5 mt-3 text-gray-400 dark:text-gray-500 text-[11px] font-semibold select-none">
                          <button 
                            onClick={e => { e.stopPropagation(); }} 
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                          >
                            <Heart size={13} /> {post.likes?.length || 0}
                          </button>
                          <button 
                            onClick={e => { e.stopPropagation(); }} 
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                          >
                            <MessageCircle size={13} /> {post.comments?.length || 0}
                          </button>
                          <button 
                            onClick={e => { e.stopPropagation(); }} 
                            className="flex items-center gap-1 hover:text-green-500 transition-colors"
                          >
                            <Repeat2 size={13} /> {post.reposts?.length || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}