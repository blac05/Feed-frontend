import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Lock, Globe, Settings } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    api.get(`/communities/${id}`)
      .then(res => setCommunity(res.data.community))
      .catch(() => toast({ message: "Community not found", type: "error" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await api.post(`/communities/${id}/join`);
      setCommunity(prev => ({
        ...prev,
        members: res.data.joined
          ? [...(prev.members || []), { _id: user._id }]
          : (prev.members || []).filter(m => m._id !== user._id),
      }));
      toast({ message: res.data.joined ? "Joined!" : "Left community", type: "success" });
    } catch (e) {
      toast({ message: "Failed to join", type: "error" });
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!community) return (
    <div className="min-h-screen dark:bg-[#15202b] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <p className="font-bold text-lg">Community not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-500 text-sm hover:underline">Go back</button>
      </div>
    </div>
  );

  const isMember = community.members?.some(m => m._id === user?._id || m === user?._id);
  const isCreator = community.creator?._id === user?._id;

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="font-bold text-gray-900 dark:text-white truncate">{community.name}</h1>
      </div>

      {/* Cover */}
      <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {community.coverImage && <img src={community.coverImage} className="w-full h-full object-cover" alt="cover" />}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
          {community.isPrivate ? <><Lock size={11} /> Private</> : <><Globe size={11} /> Public</>}
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-100 dark:border-[#38444d]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{community.name}</h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              {community.category}
            </span>
          </div>
          {!isCreator && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className={`px-5 py-2 rounded-full font-bold text-sm transition ${
                isMember
                  ? "bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#38444d] hover:bg-red-50 hover:text-red-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {joining ? "..." : isMember ? "Joined" : "Join"}
            </button>
          )}
        </div>

        {community.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{community.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users size={14} /> {community.members?.length || 0} members
          </span>
          {isCreator && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">Creator</span>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Members</h3>
        <div className="grid grid-cols-1 gap-2">
          {(community.members || []).slice(0, 10).map((member, i) => (
            <div key={member._id || i} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d]">
              <img
                src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}&background=2563eb&color=fff`}
                className="w-9 h-9 rounded-full object-cover"
                alt={member.username}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.name || member.username}</p>
                <p className="text-xs text-gray-400">@{member.username}</p>
              </div>
              {community.creator?._id === member._id && (
                <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">Creator</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}