import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, FileText, Radio, Globe, TrendingUp,
  Search, CheckCircle, X, Shield, Ban, Crown,
  AlertTriangle, UserCheck, Eye, Trash2, ArrowLeft,
  BarChart2, Activity
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value?.toLocaleString() || 0}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

const FILTERS = ["all", "verified", "pending", "banned", "unverified_email"];

export default function AdminDashboard() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState({ recentUsers: [], recentPosts: [] });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      navigate("/home");
    }
  }, [authUser]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
  }, [activeTab, debouncedSearch, filter]);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/activity"),
      ]);
      setStats(statsRes.data.stats);
      setRecentActivity(activityRes.data);
    } catch (e) {
      toast({ message: "Failed to load dashboard", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filter !== "all") params.set("filter", filter);
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
    } catch (e) {
      toast({ message: "Failed to load users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await api.put(`/admin/users/${userId}/verify`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isVerified: res.data.isVerified, verificationPending: false } : u));
      toast({ message: res.data.message, type: "success" });
    } catch (e) {
      toast({ message: "Action failed", type: "error" });
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleBan = async () => {
    if (!banModal) return;
    setActionLoading(prev => ({ ...prev, [banModal._id]: true }));
    try {
      await api.put(`/admin/users/${banModal._id}/ban`, { reason: banReason });
      setUsers(prev => prev.map(u => u._id === banModal._id ? { ...u, isBanned: true, banReason } : u));
      toast({ message: "User banned", type: "success" });
      setBanModal(null);
      setBanReason("");
    } catch (e) {
      toast({ message: "Action failed", type: "error" });
    } finally {
      setActionLoading(prev => ({ ...prev, [banModal._id]: false }));
    }
  };

  const handleUnban = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await api.put(`/admin/users/${userId}/unban`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: false, banReason: "" } : u));
      toast({ message: "User unbanned", type: "success" });
    } catch (e) {
      toast({ message: "Action failed", type: "error" });
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/make-admin`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: res.data.role } : u));
      toast({ message: `Role updated to ${res.data.role}`, type: "success" });
    } catch (e) {
      toast({ message: "Action failed", type: "error" });
    }
  };

  const tabs = ["overview", "users"];

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate("/home")} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Feed Control Center</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="bg-blue-600" sub={`${stats?.newUsersToday} joined today`} />
                <StatCard label="Total Posts" value={stats?.totalPosts} icon={FileText} color="bg-purple-600" />
                <StatCard label="Live Now" value={stats?.activeStreams} icon={Radio} color="bg-red-600" />
                <StatCard label="Communities" value={stats?.totalCommunities} icon={Globe} color="bg-green-600" />
                <StatCard label="Verified Users" value={stats?.verifiedUsers} icon={CheckCircle} color="bg-yellow-500" />
                <StatCard label="Banned Users" value={stats?.bannedUsers} icon={Ban} color="bg-gray-600" />
              </div>
            )}

            {/* Recent Activity */}
            {!loading && (
              <div className="space-y-3">
                <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Signups</h3>
                  </div>
                  {recentActivity.recentUsers?.map((u, i) => (
                    <div key={u._id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0">
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                        className="w-9 h-9 rounded-full object-cover"
                        alt={u.username}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{u.name || u.username}</p>
                        <p className="text-xs text-gray-400">@{u.username} · {u.accountType}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {u.isVerified && <CheckCircle size={14} className={badgeColor[u.accountType] || "text-blue-500"} />}
                        {u.isBanned && <Ban size={14} className="text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Posts</h3>
                  </div>
                  {recentActivity.recentPosts?.map((p, i) => (
                    <div key={p._id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0">
                      <img
                        src={p.author?.avatar || `https://ui-avatars.com/api/?name=${p.author?.username}&background=2563eb&color=fff`}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        alt="author"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">@{p.author?.username}</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{p.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            {/* Search + Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users by name, username, email..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full capitalize transition ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {f.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-20 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{users.length} users found</p>
                </div>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p>No users found</p>
                  </div>
                ) : (
                  users.map((u, i) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`px-4 py-3 border-b border-gray-50 dark:border-[#253341] last:border-0 ${
                        u.isBanned ? "bg-red-50/50 dark:bg-red-900/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          alt={u.username}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{u.name || u.username}</p>
                            {u.isVerified && <CheckCircle size={13} className={badgeColor[u.accountType] || "text-blue-500"} />}
                            {u.role === "admin" && (
                              <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>
                            )}
                            {u.isBanned && (
                              <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded-full">BANNED</span>
                            )}
                            {u.verificationPending && (
                              <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 px-1.5 py-0.5 rounded-full">PENDING</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">@{u.username} · {u.email}</p>
                          <p className="text-xs text-gray-400 capitalize">{u.accountType} · {u.emailVerified ? "✓ email" : "✗ email"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-2 ml-13">
                        <button
                          onClick={() => handleVerify(u._id)}
                          disabled={actionLoading[u._id]}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-medium transition ${
                            u.isVerified
                              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 hover:bg-yellow-200"
                              : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          <CheckCircle size={11} />
                          {u.isVerified ? "Unverify" : "Verify"}
                        </button>

                        {u.isBanned ? (
                          <button
                            onClick={() => handleUnban(u._id)}
                            disabled={actionLoading[u._id]}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-medium bg-green-100 dark:bg-green-900/20 text-green-600 hover:bg-green-200 transition"
                          >
                            <UserCheck size={11} /> Unban
                          </button>
                        ) : (
                          u.role !== "admin" && (
                            <button
                              onClick={() => setBanModal(u)}
                              disabled={actionLoading[u._id]}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-medium bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 transition"
                            >
                              <Ban size={11} /> Ban
                            </button>
                          )
                        )}

                        <button
                          onClick={() => handleMakeAdmin(u._id)}
                          disabled={u._id === authUser?._id}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-medium bg-gray-100 dark:bg-[#253341] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2d3d4e] transition disabled:opacity-40"
                        >
                          <Crown size={11} /> {u.role === "admin" ? "Demote" : "Admin"}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ban Modal */}
      <AnimatePresence>
        {banModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-[#1e2732] rounded-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Ban size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Ban @{banModal.username}?</h3>
                  <p className="text-xs text-gray-400">This will prevent them from using Feed</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Reason</label>
                <textarea
                  value={banReason}
                  onChange={e => setBanReason(e.target.value)}
                  placeholder="Violated community guidelines..."
                  rows={3}
                  className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setBanModal(null); setBanReason(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBan}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
                >
                  Ban User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
