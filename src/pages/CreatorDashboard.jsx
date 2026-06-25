import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Heart, MessageCircle, Eye,
  Coins, DollarSign, BarChart2, ArrowLeft, Star,
  Repeat2, FileText, Radio, ShoppingBag, Link2, Copy, Gift
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
  
  // State Initialization
  const [stats, setStats] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [referral, setReferral] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [setupTiersMode, setSetupTiersMode] = useState(false);
  const [newTiers, setNewTiers] = useState([
    { name: "Fan", price: 500, description: "Support the creator", perks: ["Early access", "Special badge"] },
    { name: "Superfan", price: 1500, description: "Exclusive content", perks: ["All Fan perks", "Exclusive posts", "Monthly Q&A"] },
  ]);

  const tabs = ["overview", "posts", "earnings", "subscribers", "analytics", "referral"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, walletRes, postsRes, referralRes, subRes, tiersRes] = await Promise.all([
        api.get(`/users/${user?._id}`),
        api.get("/wallet"),
        api.get("/posts"),
        api.get("/referral/stats").catch(() => ({ data: null })),
        api.get("/subscriptions/subscribers").catch(() => ({ data: { subscribers: [] } })),
        api.get(`/subscriptions/tiers/${user?._id}`).catch(() => ({ data: { tiers: [] } }))
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
      
      if (referralRes?.data) setReferral(referralRes.data);
      setSubscribers(subRes?.data?.subscribers || []);
      setTiers(tiersRes?.data?.tiers || []);
    } catch (e) {
      toast({ message: "Failed to load dashboard data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const setupSubscriptionTiers = async () => {
    try {
      const res = await api.post("/subscriptions/tiers", { tiers: newTiers });
      setTiers(res.data.tiers);
      setSetupTiersMode(false);
      toast({ message: "Subscription tiers saved!", type: "success" });
    } catch (e) {
      toast({ message: "Failed to save tiers", type: "error" });
    }
  };

  const copyReferral = () => {
    if (referral?.link) {
      navigator.clipboard.writeText(referral.link);
      toast({ message: "Referral link copied!", type: "success" });
    }
  };

  const generateCode = async () => {
    try {
      const res = await api.get("/referral/code");
      setReferral(res.data);
      toast({ message: "Referral code generated!", type: "success" });
    } catch (e) {
      toast({ message: "Failed to generate code", type: "error" });
    }
  };

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
        
        {/* Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition flex-shrink-0 ${
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

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ──────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Audience</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Followers" value={stats?.followers} icon={Users} color="bg-blue-600" sub="People following you" />
                    <StatCard label="Following" value={stats?.following} icon={Users} color="bg-purple-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Content</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Total Posts" value={stats?.posts} icon={FileText} color="bg-green-600" />
                    <StatCard label="Total Likes" value={stats?.totalLikes} icon={Heart} color="bg-red-500" />
                    <StatCard label="Total Comments" value={stats?.totalComments} icon={MessageCircle} color="bg-yellow-500" />
                    <StatCard label="Total Reposts" value={stats?.totalReposts} icon={Repeat2} color="bg-indigo-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
                  <p className="text-purple-200 text-xs font-medium mb-1">Engagement Rate</p>
                  <p className="text-4xl font-extrabold">{stats?.engagementRate}%</p>
                  <p className="text-purple-200 text-xs mt-1">Avg {stats?.avgLikes} likes per post</p>
                  <div className="mt-3 flex gap-3">
                    <button onClick={() => navigate("/live")} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition">
                      <Radio size={12} /> Go Live
                    </button>
                    <button onClick={() => navigate("/marketplace")} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition">
                      <ShoppingBag size={12} /> Sell Products
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── POSTS TAB ─────────────────────────────────────── */}
            {activeTab === "posts" && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your top performing content</p>
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
                          <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments?.length || 0}</span>
                          <span className="flex items-center gap-1"><Repeat2 size={12} /> {post.reposts?.length || 0}</span>
                          <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            )}

            {/* ── EARNINGS TAB ──────────────────────────────────── */}
            {activeTab === "earnings" && (
              <div className="space-y-4">
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
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => navigate("/wallet")} className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold hover:brightness-110 transition">
                  Manage Wallet
                </button>
              </div>
            )}

            {/* ── SUBSCRIBERS TAB ────────────────────────────────── */}
            {activeTab === "subscribers" && (
              <div className="space-y-4">
                {tiers.length === 0 || setupTiersMode ? (
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                      {setupTiersMode ? "Edit Subscription Tiers" : "Set Up Subscription Tiers"}
                    </h3>
                    <div className="space-y-4">
                      {newTiers.map((tier, i) => (
                        <div key={i} className="border border-gray-200 dark:border-[#38444d] rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Tier {i + 1}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Name</label>
                              <input
                                value={tier.name}
                                onChange={e => {
                                  const t = [...newTiers]; t[i].name = e.target.value; setNewTiers(t);
                                }}
                                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Price (₦/month)</label>
                              <input
                                type="number"
                                value={tier.price}
                                onChange={e => {
                                  const t = [...newTiers]; t[i].price = Number(e.target.value); setNewTiers(t);
                                }}
                                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Description</label>
                            <input
                              value={tier.description}
                              onChange={e => { const t = [...newTiers]; t[i].description = e.target.value; setNewTiers(t); }}
                              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      {setupTiersMode && (
                        <button onClick={() => setSetupTiersMode(false)} className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-sm">
                          Cancel
                        </button>
                      )}
                      <button onClick={setupSubscriptionTiers} className="flex-1 bg-blue-600 text-white py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition">
                        Save Tiers
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-xs">Active Subscribers</p>
                        <p className="text-3xl font-extrabold">{subscribers.length}</p>
                      </div>
                      <button onClick={() => setSetupTiersMode(true)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-medium transition">
                        Edit Tiers
                      </button>
                    </div>

                    {/* Tier cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {tiers.map((tier, i) => {
                        const count = subscribers.filter(s => s.tier?.name === tier.name).length;
                        return (
                          <div key={i} className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                              <span className="text-blue-600 font-bold">₦{tier.price}/mo</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{tier.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{count} subscribers</span>
                              <span className="text-xs text-green-600 font-bold">≈ ₦{(count * tier.price * 0.85).toLocaleString()}/mo</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recent subscribers */}
                    {subscribers.length > 0 && (
                      <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recent Subscribers</h3>
                        </div>
                        {subscribers.slice(0, 8).map((sub, i) => (
                          <div key={sub._id || i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0">
                            <img
                              src={sub.subscriber?.avatar || `https://ui-avatars.com/api/?name=${sub.subscriber?.username}&background=2563eb&color=fff`}
                              className="w-9 h-9 rounded-full object-cover"
                              alt={sub.subscriber?.username}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sub.subscriber?.name || sub.subscriber?.username}</p>
                              <p className="text-xs text-gray-400">{sub.tier?.name} · ₦{sub.tier?.price}/mo</p>
                            </div>
                            <span className="text-xs text-green-600 font-bold">Active</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── ANALYTICS TAB ─────────────────────────────────── */}
            {activeTab === "analytics" && stats && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Engagement Overview</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={[
                      { name: "Posts", value: stats.posts },
                      { name: "Likes", value: stats.totalLikes },
                      { name: "Comments", value: stats.totalComments },
                      { name: "Reposts", value: stats.totalReposts },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip contentStyle={{ background: "#1e2732", border: "none", borderRadius: "12px", color: "#fff" }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4 text-center">
                    <p className="text-3xl font-extrabold text-blue-600">{stats.engagementRate}%</p>
                    <p className="text-xs text-gray-400 mt-1">Engagement Rate</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4 text-center">
                    <p className="text-3xl font-extrabold text-purple-600">{stats.avgLikes}</p>
                    <p className="text-xs text-gray-400 mt-1">Avg Likes / Post</p>
                  </div>
                </div>

                {/* Post performance chart */}
                {recentPosts.length > 0 && (
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Post Performance</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={recentPosts.map((p, i) => ({
                        name: `Post ${i + 1}`,
                        likes: p.likes?.length || 0,
                        comments: p.comments?.length || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                        <Tooltip contentStyle={{ background: "#1e2732", border: "none", borderRadius: "12px", color: "#fff" }} />
                        <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="comments" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2 justify-center">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-3 h-0.5 bg-red-500 block" /> Likes</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-3 h-0.5 bg-blue-500 block" /> Comments</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── REFERRAL TAB ──────────────────────────────────── */}
            {activeTab === "referral" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift size={20} />
                    <h3 className="font-bold text-lg">Referral Program</h3>
                  </div>
                  <p className="text-green-100 text-sm mb-4">
                    Earn <strong>50 coins</strong> for every person who joins Feed using your link!
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold">{referral?.count || 0}</p>
                      <p className="text-green-100 text-xs mt-0.5">Referrals</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold">{referral?.earnings || 0}</p>
                      <p className="text-green-100 text-xs mt-0.5">Coins Earned</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold">50</p>
                      <p className="text-green-100 text-xs mt-0.5">Per Referral</p>
                    </div>
                  </div>
                </div>

                {referral?.link ? (
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-4">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wide">Your Referral Link</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] rounded-xl px-3 py-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                        {referral.link}
                      </div>
                      <button
                        onClick={copyReferral}
                        className="flex-shrink-0 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Code: <strong className="text-gray-700 dark:text-gray-300">{referral.code}</strong></p>
                  </div>
                ) : (
                  <button
                    onClick={generateCode}
                    className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Link2 size={16} /> Generate Referral Link
                  </button>
                )}

                {/* Referred users */}
                {(referral?.referredUsers || []).length > 0 && (
                  <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">People You Referred</h3>
                    </div>
                    {referral.referredUsers.slice(0, 10).map((u, i) => (
                      <div key={u._id || i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0">
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt={u.username}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name || u.username}</p>
                          <p className="text-xs text-gray-400">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-bold text-green-600">+50🪙</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
