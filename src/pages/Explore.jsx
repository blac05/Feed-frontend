import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Hash, Users } from "lucide-react";

const trending = [
  { tag: "technology", posts: "12.4k" },
  { tag: "design", posts: "8.1k" },
  { tag: "startup", posts: "6.7k" },
  { tag: "photography", posts: "5.2k" },
  { tag: "music", posts: "4.9k" },
  { tag: "gaming", posts: "3.8k" },
];

const suggested = [
  { name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Sarah Kim", username: "sarahk", avatar: "https://i.pravatar.cc/150?img=2" },
  { name: "Mike Chen", username: "mikechen", avatar: "https://i.pravatar.cc/150?img=3" },
  { name: "Emma Davis", username: "emmad", avatar: "https://i.pravatar.cc/150?img=4" },
];

export default function Explore() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Feed..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </motion.div>

      {/* Trending Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800">Trending Topics</h2>
        </div>
        <div className="space-y-3">
          {trending.map((item, i) => (
            <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-xl cursor-pointer transition">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Hash size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">#{item.tag}</p>
                  <p className="text-xs text-gray-400">{item.posts} posts</p>
                </div>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">Trending</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800">People to Follow</h2>
        </div>
        <div className="space-y-3">
          {suggested.map((u, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" alt={u.name} />
                <div>
                  <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                </div>
              </div>
              <button className="text-sm bg-gradient-to-r from-sky-500 to-blue-700 text-white px-4 py-1.5 rounded-xl font-medium hover:brightness-110 transition">
                Follow
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}