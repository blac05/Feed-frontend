import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Hits your bookmark API endpoint
    api.get("/posts/bookmarks")
      .then(res => setPosts(res.data.posts || []))
      .catch(() => toast({ message: "Failed to load bookmarks", type: "error" }))
      .finally(() => setFetching(false));
  }, [toast]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#15202b] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1e2732] rounded-full transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-tight">Bookmarks</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Saved items</p>
        </div>
      </div>

      {/* Main Content Area */}
      {fetching ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400 px-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#1e2732] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={28} className="text-gray-400" />
          </div>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Save posts for later</p>
          <p className="text-sm mt-1 max-w-xs mx-auto text-gray-400 dark:text-gray-500">
            Don’t let the good ones get away! Bookmark posts to easily find them again here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-[#38444d]">
          {posts.map(post => (
            <div 
              key={post._id} 
              onClick={() => navigate(`/post/${post._id}`)}
              className="p-4 hover:bg-gray-50/50 dark:hover:bg-[#1e2732]/50 transition cursor-pointer"
            >
              <p className="text-sm text-gray-800 dark:text-gray-200">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}