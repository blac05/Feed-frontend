import { useState, useEffect } from "react";
import { Search, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const suggestions = [
  { name: "TechCrunch", username: "techcrunch", avatar: "https://i.pravatar.cc/150?img=12", verified: true, type: "company" },
  { name: "Beyoncé", username: "beyonce", avatar: "https://i.pravatar.cc/150?img=5", verified: true, type: "popstar" },
  { name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=3", verified: false, type: "personal" },
  { name: "Elon Musk", username: "elonmusk", avatar: "https://i.pravatar.cc/150?img=11", verified: true, type: "prominent" },
];

const badgeColor = {
  personal: "text-blue-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
  creator: "text-purple-500",
};

const fallbackTrending = [
  { tag: "Technology", count: 125 },
  { tag: "AI", count: 98 },
  { tag: "Design", count: 67 },
  { tag: "Startups", count: 54 },
  { tag: "Music", count: 43 },
  { tag: "Football", count: 38 },
  { tag: "Gaming", count: 31 },
];

export default function RightPanel() {
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState(fallbackTrending);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/posts/trending-hashtags")
      .then(res => {
        if (res.data.hashtags?.length > 0) {
          setTrending(res.data.hashtags);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full py-2">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && query && navigate(`/explore?q=${query}`)}
          placeholder="Search Feed"
          className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-[#253341] transition"
        />
      </div>

      {/* Trending Hashtags — real data */}
      <div className="bg-gray-50 dark:bg-[#1e2732] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <h2 className="font-bold text-gray-800 dark:text-white">Trending for you</h2>
          </div>
        </div>
        {trending.slice(0, 7).map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(`/hashtag/${item.tag}`)}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#253341] cursor-pointer transition border-b border-gray-100 dark:border-[#38444d] last:border-0"
          >
            <p className="text-xs text-gray-400">Trending</p>
            <p className="font-bold text-gray-800 dark:text-white text-sm">#{item.tag}</p>
            <p className="text-xs text-gray-400">{item.count} posts</p>
          </div>
        ))}
        <div
          onClick={() => navigate("/explore")}
          className="px-4 py-3 text-blue-500 text-sm hover:bg-gray-100 dark:hover:bg-[#253341] cursor-pointer transition"
        >
          Show more
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-gray-50 dark:bg-[#1e2732] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-bold text-gray-800 dark:text-white">Who to follow</h2>
        </div>
        {suggestions.map((u, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[#253341] transition border-b border-gray-100 dark:border-[#38444d] last:border-0">
            <img src={u.avatar} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt={u.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm text-gray-800 dark:text-white truncate">{u.name}</p>
                {u.verified && <CheckCircle size={13} className={badgeColor[u.type]} />}
              </div>
              <p className="text-xs text-gray-400">@{u.username}</p>
            </div>
            <button
              onClick={() => toast({ message: "Followed!", type: "success" })}
              className="text-sm bg-gray-800 dark:bg-white dark:text-gray-900 text-white px-4 py-1.5 rounded-2xl font-bold hover:opacity-80 transition flex-shrink-0"
            >
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3 text-blue-500 text-sm hover:bg-gray-100 dark:hover:bg-[#253341] cursor-pointer transition">
          Show more
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 flex flex-wrap gap-2 text-xs text-gray-400">
        <span className="hover:underline cursor-pointer">Terms</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span className="hover:underline cursor-pointer">Cookies</span>
        <span className="hover:underline cursor-pointer">About</span>
        <span>© 2026 Feed</span>
      </div>
    </div>
  );
}

}