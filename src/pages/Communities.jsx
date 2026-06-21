import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, Lock, Globe, X, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Technology", "Sports", "Music", "Gaming", "Art", "Business", "Education", "Other"];

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const categoryColors = {
  Technology: "bg-blue-100 text-blue-700",
  Sports: "bg-green-100 text-green-700",
  Music: "bg-purple-100 text-purple-700",
  Gaming: "bg-red-100 text-red-700",
  Art: "bg-pink-100 text-pink-700",
  Business: "bg-yellow-100 text-yellow-700",
  Education: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-700",
};

function CreateCommunityModal({ onClose, onCreate }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", description: "", category: "Other", isPrivate: false,
  });
  const [creating, setCreating] = useState(false);

  const submit = async () => {
    if (!form.name.trim()) {
      toast({ message: "Please add a community name", type: "error" });
      return;
    }
    setCreating(true);
    try {
      const res = await api.post("/communities", form);
      onCreate(res.data.community);
      toast({ message: "Community created!", type: "success" });
      onClose();
    } catch (e) {
      toast({ message: "Failed to create community", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#15202b] rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Create Community</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Name *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Community name"
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What's this community about?"
              rows={3}
              className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`text-xs px-2 py-2 rounded-xl border transition ${
                    form.category === cat
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1e2732] rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Private Community</p>
              <p className="text-xs text-gray-400">Only invited members can join</p>
            </div>
            <button
              onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.isPrivate ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isPrivate ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <button
            onClick={submit}
            disabled={creating || !form.name.trim()}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-2xl font-bold disabled:opacity-40 hover:brightness-110 transition"
          >
            {creating ? "Creating..." : "Create Community"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Communities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [joining, setJoining] = useState({});

  useEffect(() => {
    api.get("/communities")
      .then(res => setCommunities(res.data.communities || []))
      .catch(() => toast({ message: "Failed to load communities", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (communityId) => {
    setJoining(prev => ({ ...prev, [communityId]: true }));
    try {
      const res = await api.post(`/communities/${communityId}/join`);
      setCommunities(prev => prev.map(c =>
        c._id === communityId
          ? { ...c, members: res.data.joined ? [...c.members, user._id] : c.members.filter(m => m !== user._id) }
          : c
      ));
      toast({ message: res.data.joined ? "Joined community!" : "Left community", type: "success" });
    } catch (e) {
      toast({ message: "Failed to join", type: "error" });
    } finally {
      setJoining(prev => ({ ...prev, [communityId]: false }));
    }
  };

  const filtered = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Communities</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            <Plus size={14} /> Create
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-[#1e2732] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#253341]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">No communities found</p>
            <p className="text-sm mt-1">Be the first to create one!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
            >
              Create Community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((community, i) => {
              const isMember = community.members?.includes(user?._id);
              const isCreator = community.creator?._id === user?._id;
              return (
                <motion.div
                  key={community._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] overflow-hidden hover:shadow-md transition"
                >
                  {/* Cover */}
                  <div
                    className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer relative"
                    onClick={() => navigate(`/community/${community._id}`)}
                  >
                    {community.coverImage && (
                      <img src={community.coverImage} className="w-full h-full object-cover" alt="cover" />
                    )}
                    <div className="absolute top-2 right-2">
                      {community.isPrivate ? (
                        <div className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} /> Private
                        </div>
                      ) : (
                        <div className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Globe size={10} /> Public
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="cursor-pointer"
                        onClick={() => navigate(`/community/${community._id}`)}
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white">{community.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[community.category] || "bg-gray-100 text-gray-600"}`}>
                          {community.category}
                        </span>
                      </div>
                      {!isCreator && (
                        <button
                          onClick={() => handleJoin(community._id)}
                          disabled={joining[community._id]}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition flex-shrink-0 ${
                            isMember
                              ? "bg-gray-100 dark:bg-[#253341] text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {joining[community._id] ? "..." : isMember ? "Joined" : "Join"}
                        </button>
                      )}
                      {isCreator && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Creator</span>
                      )}
                    </div>

                    {community.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{community.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex -space-x-1">
                        {(community.members || []).slice(0, 3).map((m, idx) => (
                          <div key={idx} className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-[#1e2732] flex items-center justify-center text-white text-[8px] font-bold">
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {community.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateCommunityModal
            onClose={() => setShowCreate(false)}
            onCreate={(c) => setCommunities(prev => [c, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
