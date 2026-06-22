import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Heart, MessageCircle, Eye,
  Coins, DollarSign, BarChart2, ArrowLeft, Star,
  Repeat2, FileText, Radio, ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function StatCard({ label, value, icon: Icon, color, sub, prefix = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
        {prefix}{typeof value === "number" ? value.toLocaleString() : value || 0}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, walletRes, postsRes] = await Promise.all([
        api.get(`/users/${user?._id}`),
        api.get("/wallet"),
        api.get("/posts"),
      ]);

      const profileUser = profileRes.data.user;
      const allPosts = postsRes.data.posts || [];
      const myPosts = allPosts.filter(p => p.author?._id === user?._id);

      const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
      const totalComments = myPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
      const totalReposts = myPosts.reduce((sum, p) => sum + (p.reposts?.length || 0), 0);

      setStats({
        followers: profileUser.followers?.length || 0,
        following: profileUser.following?.length || 0,
        posts: myPosts.length,
        totalLikes,
        totalComments,
        totalReposts,
        avgLikes: myPosts.length ? Math.round(totalLikes / myPosts.length) : 0,
        engagementRate: myPosts.length && profileUser.followers?.length
          ? ((totalLikes + totalComments) / (myPosts.length * profileUser.followers.length) * 100).toFixed(2)
          : "0.00",
      });
      setWallet(walletRes.data.wallet);
      setRecentPosts(myPosts.slice(0, 5));
    } catch (e) {
      toast({ message: "Failed to load dashboard", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["overview", "posts", "earnings"];

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">Creator Dashboard</h1>
              <p className="text-xs text-gray-400">@{user?.username}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e2732]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Audience */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Audience</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Followers" value={stats?.followers} icon={Users} color="bg-blue-600" sub="People following you" />
                    <StatCard label="Following" value={stats?.following} icon={Users} color="bg-purple-600" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Content</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Total Posts" value={stats?.posts} icon={FileText} color="bg-green-600" />
                    <StatCard label="Total Likes" value={stats?.totalLikes} icon={Heart} color="bg-red-500" />
                    <StatCard label="Total Comments" value={stats?.totalComments} icon={MessageCircle} color="bg-yellow-500" />
                    <StatCard label="Total Reposts" value={stats?.totalReposts} icon={Repeat2} color="bg-indigo-600" />
                  </div>
                </div>

                {/* Engagement */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
                  <p className="text-purple-200 text-xs font-medium mb-1">Engagement Rate</p>
                  <p className="text-4xl font-extrabold">{stats?.engagementRate}%</p>
                  <p className="text-purple-200 text-xs mt-1">Avg {stats?.avgLikes} likes per post</p>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => navigate("/live")}
                      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition"
                    >
                      <Radio size={12} /> Go Live
                    </button>
                    <button
                      onClick={() => navigate("/marketplace")}
                      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition"
                    >
                      <ShoppingBag size={12} /> Sell Products
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your top performing posts</p>
                {recentPosts.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p>No posts yet</p>
                  </div>
                ) : (
                  recentPosts
                    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                    .map((post, i) => (
                      <motion.div
                        key={post._id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4 cursor-pointer hover:shadow-md transition"
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1 font-semibold text-red-500">
                            <Heart size={12} className="fill-red-500" /> {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} /> {post.comments?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat2 size={12} /> {post.reposts?.length || 0}
                          </span>
                          <span className="ml-auto">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            )}

            {activeTab === "earnings" && (
              <div className="space-y-4">
                {/* Earnings overview */}
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 text-white">
                  <p className="text-yellow-100 text-xs font-medium mb-1">Coin Balance</p>
                  <p className="text-3xl font-extrabold">🪙 {(wallet?.coins || 0).toLocaleString()}</p>
                  <p className="text-yellow-100 text-xs mt-1">≈ ₦{((wallet?.coins || 0) / 10).toLocaleString()} value</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Wallet Balance" value={wallet?.balance || 0} icon={DollarSign} color="bg-green-600" prefix="₦" />
                  <StatCard label="Total Earned" value={wallet?.totalEarned || 0} icon={TrendingUp} color="bg-blue-600" prefix="₦" />
                </div>

                <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Monetization Tips</h3>
                  <div className="space-y-3">
                    {[
                      { icon: "🎙️", tip: "Go live regularly — viewers send coin gifts during streams" },
                      { icon: "🛍️", tip: "List products in the marketplace to earn directly from your audience" },
                      { icon: "⭐", tip: "Get verified to unlock creator subscription features" },
                      { icon: "💝", tip: "Engage with your audience — more engagement = more tips" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/wallet")}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold hover:brightness-110 transition"
                >
                  Manage Wallet
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}