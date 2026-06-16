import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Link2, Camera, Grid, Bookmark } from "lucide-react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [tab, setTab] = useState("posts");
  const fileRef = useRef();

  useEffect(() => {
    api.get("/users/me").then(res => {
      setUser(res.data.user);
      setAvatar(res.data.user.avatar || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatar(base64);
      try {
        await api.put("/users/me", { avatar: base64 });
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="text-center py-20 text-gray-400">
      <p>Could not load profile. Please log in.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-sky-400 to-blue-700 relative">
          {user.coverImage && (
            <img src={user.coverImage} className="w-full h-full object-cover" alt="cover" />
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative inline-block -mt-12 mb-3">
            <img
              src={avatar || "https://i.pravatar.cc/200"}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
              alt={user.username}
            />
            <button
              onClick={() => fileRef.current.click()}
              className="absolute bottom-1 right-1 bg-blue-600 text-white p-1.5 rounded-full shadow hover:bg-blue-700 transition"
            >
              <Camera size={12} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <h1 className="text-xl font-bold text-gray-800">{user.username}</h1>
          {user.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}

          <div className="flex flex-wrap gap-3 mt-2">
            {user.location && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={12} /> {user.location}
              </span>
            )}
            {user.website && (
              <a href={user.website} className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                <Link2 size={12} /> {user.website}
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="font-bold text-gray-800">0</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">{user.followers ?? 0}</p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">{user.following ?? 0}</p>
              <p className="text-xs text-gray-400">Following</p>
            </div>
          </div>

          <button className="mt-4 w-full border-2 border-blue-600 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50 transition text-sm">
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab("posts")}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition ${tab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            <Grid size={16} /> Posts
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition ${tab === "saved" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            <Bookmark size={16} /> Saved
          </button>
        </div>
        <div className="p-8 text-center text-gray-400">
          <p className="text-sm">No {tab} yet</p>
        </div>
      </div>
    </div>
  );
}