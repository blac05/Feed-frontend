import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Link2, Camera, Grid3X3, Bookmark,
  Calendar, CheckCircle, ArrowLeft, X, Edit3
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const accountTypeLabel = {
  personal: "Personal",
  creator: "Creator",
  company: "Company",
  prominent: "Public Figure",
  popstar: "Entertainer",
};

export default function Profile() {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = id === "me" || id === authUser?._id;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const avatarRef = useRef();
  const coverRef = useRef();

  useEffect(() => {
    const endpoint = isOwnProfile ? "/users/me" : `/users/${id}`;
    api.get(endpoint)
      .then(res => {
        setUser(res.data.user);
        setAvatar(res.data.user.avatar || null);
        setCover(res.data.user.coverImage || null);
        setEditForm({
          name: res.data.user.name || "",
          username: res.data.user.username || "",
          bio: res.data.user.bio || "",
          location: res.data.user.location || "",
          website: res.data.user.website || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch user posts
    api.get("/posts")
      .then(res => {
        const uid = isOwnProfile ? authUser?._id : id;
        setPosts((res.data.posts || []).filter(p => p.author?._id === uid));
      })
      .catch(() => {});
  }, [id]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatar(base64);
      try {
        const res = await api.put("/users/me", { avatar: base64 });
        setAuthUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setCover(base64);
      try {
        await api.put("/users/me", { coverImage: base64 });
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me", editForm);
      setUser(res.data.user);
      setAuthUser(res.data.user);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen">
      {/* Skeleton */}
      <div className="h-40 bg-gray-200 animate-pulse" />
      <div className="px-4 pb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full -mt-12 border-4 border-white animate-pulse" />
        <div className="mt-3 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-24 text-gray-400">
      <p className="text-lg font-bold">User not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm hover:underline">Go back</button>
    </div>
  );

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <p className="font-bold text-gray-900">{user.name || user.username}</p>
          <p className="text-xs text-gray-400">{posts.length} posts</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-r from-sky-400 to-blue-700 group">
        {cover && <img src={cover} className="w-full h-full object-cover" alt="cover" />}
        {isOwnProfile && (
          <button
            onClick={() => coverRef.current.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition"
          >
            <Camera size={24} className="text-white" />
          </button>
        )}
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-3">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff&size=200`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              alt={user.username}
            />
            {isOwnProfile && (
              <button
                onClick={() => avatarRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Camera size={18} className="text-white" />
              </button>
            )}
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Edit / Follow Button */}
          {isOwnProfile ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 border-2 border-gray-800 text-gray-800 px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-50 transition"
            >
              <Edit3 size={14} /> Edit profile
            </button>
          ) : (
            <button className="bg-gray-900 text-white px-5 py-1.5 rounded-full font-bold text-sm hover:bg-gray-700 transition">
              Follow
            </button>
          )}
        </div>

        {/* Name + Verification */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <h1 className="text-xl font-extrabold text-gray-900">{user.name || user.username}</h1>
          {user.isVerified && (
            <CheckCircle size={18} className={badgeColor[user.accountType] || "text-blue-500"} />
          )}
        </div>
        <p className="text-gray-400 text-sm">@{user.username}</p>

        {/* Account Type Badge */}
        {user.accountType && user.accountType !== "personal" && (
          <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            {accountTypeLabel[user.accountType]}
          </span>
        )}

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 text-sm mt-2 leading-relaxed">{user.bio}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mt-2">
          {user.location && (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin size={14} /> {user.location}
            </span>
          )}
          {user.website && (
  <a
    href={user.website}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-1 text-blue-500 text-sm hover:underline"
  >
    <Link2 size={14} /> {user.website}
  </a>
)}
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Calendar size={14} /> Joined {joinedDate}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mt-3">
          <button className="text-sm hover:underline">
            <span className="font-bold text-gray-900">{user.following?.length || 0}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </button>
          <button className="text-sm hover:underline">
            <span className="font-bold text-gray-900">{user.followers?.length || 0}</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 sticky top-[57px] bg-white z-10">
        {["posts", "saved"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-4 text-sm font-semibold capitalize relative transition ${
              tab === t ? "text-gray-900" : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            {t}
            {tab === t && (
              <motion.div
                layoutId="profile-tab"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      {tab === "posts" && (
        posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Grid3X3 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No posts yet</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post._id || i} className="border-b border-gray-100 px-4 py-3">
              <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
              {post.image && (
                <img src={post.image} className="mt-2 rounded-2xl w-full object-cover max-h-80 border border-gray-100" alt="post" />
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          ))
        )
      )}

      {tab === "saved" && (
        <div className="text-center py-16 text-gray-400">
          <Bookmark size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nothing saved yet</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowEditModal(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
                    <X size={18} />
                  </button>
                  <h2 className="font-bold text-lg text-gray-900">Edit profile</h2>
                </div>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {[
                  { key: "name", label: "Name", placeholder: "Your name" },
                  { key: "username", label: "Username", placeholder: "username" },
                  { key: "location", label: "Location", placeholder: "Where are you?" },
                  { key: "website", label: "Website", placeholder: "https://yoursite.com" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                    <input
                      value={editForm[field.key] || ""}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Bio</label>
                  <textarea
                    value={editForm.bio || ""}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell the world about yourself"
                    rows={3}
                    maxLength={160}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right">{(editForm.bio || "").length}/160</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}