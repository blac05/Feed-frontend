import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Link2, Camera, Grid3X3, Bookmark,
  Calendar, CheckCircle, ArrowLeft, X, Edit3,
  Heart, MessageCircle
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import useUpload from "../hooks/useUpload";

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
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = id === "me" || id === authUser?._id;
  const { uploadAvatar, uploadImage, uploading: uploadingMedia } = useUpload();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("grid");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const avatarRef = useRef();
  const coverRef = useRef();

  useEffect(() => {
    const endpoint = isOwnProfile ? "/users/me" : `/users/${id}`;
    api.get(endpoint)
      .then(res => {
        const u = res.data.user;
        setUser(u);
        setAvatar(u.avatar || null);
        setCover(u.coverImage || null);
        setFollowerCount(u.followers?.length || 0);
        setIsFollowing(u.followers?.includes(authUser?._id));
        setEditForm({
          name: u.name || "",
          username: u.username || "",
          bio: u.bio || "",
          location: u.location || "",
          website: u.website || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load user posts
    api.get("/posts")
      .then(res => {
        const uid = isOwnProfile ? authUser?._id : id;
        setPosts((res.data.posts || []).filter(p => p.author?._id === uid));
      })
      .catch(() => {});

    // Load bookmarks if own profile
    if (isOwnProfile) {
      api.get("/users/bookmarks")
        .then(res => setBookmarks(res.data.bookmarks || []))
        .catch(() => {});
    }
  }, [id]);

  const handleFollow = async () => {
    try {
      const res = await api.post(`/users/${user._id}/follow`);
      setIsFollowing(res.data.following);
      setFollowerCount(prev => res.data.following ? prev + 1 : prev - 1);
      toast({ message: res.data.following ? `Following ${user.username}!` : "Unfollowed", type: "success" });
    } catch (err) {
      toast({ message: "Failed to follow", type: "error" });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    const url = await uploadAvatar(file);
    if (url) {
      setAvatar(url);
      try {
        const res = await api.put("/users/me", { avatar: url });
        setAuthUser(res.data.user);
        toast({ message: "Avatar updated!", type: "success" });
      } catch (err) {
        toast({ message: "Failed to update avatar", type: "error" });
      }
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCover(reader.result);
    reader.readAsDataURL(file);
    const url = await uploadImage(file);
    if (url) {
      setCover(url);
      try {
        await api.put("/users/me", { coverImage: url });
        toast({ message: "Cover updated!", type: "success" });
      } catch (err) {}
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me", editForm);
      setUser(res.data.user);
      setAuthUser(res.data.user);
      setShowEditModal(false);
      toast({ message: "Profile saved!", type: "success" });
    } catch (err) {
      toast({ message: "Failed to save", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-[#15202b]">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="px-4 pb-4">
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full -mt-12 border-4 border-white animate-pulse" />
        <div className="mt-3 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-24 text-gray-400 dark:bg-[#15202b] min-h-screen">
      <p className="text-lg font-bold">User not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm hover:underline">Go back</button>
    </div>
  );

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const imagePosts = posts.filter(p => p.image);
  const tabs = isOwnProfile
    ? ["grid", "posts", "saved"]
    : ["grid", "posts"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#15202b]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{user.name || user.username}</p>
          <p className="text-xs text-gray-400">{posts.length} posts</p>
        </div>
      </div>

      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-r from-sky-400 to-blue-700 group">
        {cover && <img src={cover} className="w-full h-full object-cover" alt="cover" />}
        {uploadingMedia && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
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
      <div className="px-4 pb-4 dark:bg-[#15202b]">
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative group">
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff&size=200`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#15202b] shadow-md"
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

          {isOwnProfile ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 border-2 border-gray-800 dark:border-gray-400 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
            >
              <Edit3 size={14} /> Edit profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-5 py-1.5 rounded-full font-bold text-sm transition ${
                isFollowing
                  ? "bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#38444d] hover:bg-red-50 hover:text-red-500 hover:border-red-300"
                  : "bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{user.name || user.username}</h1>
          {user.isVerified && (
            <CheckCircle size={18} className={badgeColor[user.accountType] || "text-blue-500"} />
          )}
        </div>
        <p className="text-gray-400 text-sm">@{user.username}</p>

        {user.accountType && user.accountType !== "personal" && (
          <span className="inline-block mt-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
            {accountTypeLabel[user.accountType]}
          </span>
        )}

        {user.bio && <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 leading-relaxed">{user.bio}</p>}

        <div className="flex flex-wrap gap-3 mt-2">
          {user.location && (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin size={14} /> {user.location}
            </span>
          )}
          {user.website && (
            <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 text-sm hover:underline">
              <Link2 size={14} /> {user.website}
            </a>
          )}
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Calendar size={14} /> Joined {joinedDate}
          </span>
        </div>

        <div className="flex gap-5 mt-3">
          <button className="text-sm hover:underline">
            <span className="font-bold text-gray-900 dark:text-white">{user.following?.length || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
          </button>
          <button className="text-sm hover:underline">
            <span className="font-bold text-gray-900 dark:text-white">{followerCount}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
          </button>
          <div className="text-sm">
            <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-[#38444d] sticky top-[57px] bg-white dark:bg-[#15202b] z-10">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition flex items-center justify-center gap-1.5 ${
              tab === t
                ? "text-gray-900 dark:text-white border-blue-600"
                : "text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-50 dark:hover:bg-[#1e2732]"
            }`}
          >
            {t === "grid" && <Grid3X3 size={16} />}
            {t === "saved" && <Bookmark size={16} />}
            {t === "posts" && <MessageCircle size={16} />}
            <span className="hidden sm:inline">{t}</span>
          </button>
        ))}
      </div>

      {/* ✅ Photo Grid Tab — Instagram style */}
      {tab === "grid" && (
        imagePosts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Grid3X3 size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No photos yet</p>
            <p className="text-sm mt-1">Posts with images appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 bg-gray-100 dark:bg-[#38444d]">
            {imagePosts.map((post, i) => (
              <motion.div
                key={post._id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/post/${post._id}`)}
                className="relative aspect-square bg-gray-200 dark:bg-gray-700 cursor-pointer group overflow-hidden"
              >
                <img
                  src={post.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  alt="post"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <span className="text-white font-bold text-sm flex items-center gap-1">
                    <Heart size={16} className="fill-white" /> {post.likes?.length || 0}
                  </span>
                  <span className="text-white font-bold text-sm flex items-center gap-1">
                    <MessageCircle size={16} className="fill-white" /> {post.comments?.length || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Posts Tab */}
      {tab === "posts" && (
        posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No posts yet</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div
              key={post._id || i}
              className="border-b border-gray-100 dark:border-[#38444d] px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2732] transition"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{post.content}</p>
              {post.image && (
                <img src={post.image} className="mt-2 rounded-2xl w-full object-cover max-h-80 border border-gray-100 dark:border-[#38444d]" alt="post" />
              )}
              <div className="flex gap-4 mt-2 text-gray-400 text-xs">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
                <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          ))
        )
      )}

      {/* ✅ Saved/Bookmarks Tab */}
      {tab === "saved" && (
        bookmarks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bookmark size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">Nothing saved yet</p>
            <p className="text-sm mt-1">Tap the bookmark icon on any post to save it</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 bg-gray-100 dark:bg-[#38444d]">
            {bookmarks.filter(p => p.image).map((post, i) => (
              <motion.div
                key={post._id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/post/${post._id}`)}
                className="relative aspect-square bg-gray-200 dark:bg-gray-700 cursor-pointer group overflow-hidden"
              >
                <img
                  src={post.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  alt="post"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <span className="text-white font-bold text-sm flex items-center gap-1">
                    <Heart size={16} className="fill-white" /> {post.likes?.length || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Edit Modal */}
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
              className="bg-white dark:bg-[#1e2732] rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#38444d]">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowEditModal(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#253341] transition">
                    <X size={18} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">Edit profile</h2>
                </div>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-80 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {[
                  { key: "name", label: "Name", placeholder: "Your name" },
                  { key: "username", label: "Username", placeholder: "username" },
                  { key: "location", label: "Location", placeholder: "Where are you?" },
                  { key: "website", label: "Website", placeholder: "https://yoursite.com" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">{field.label}</label>
                    <input
                      value={editForm[field.key] || ""}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Bio</label>
                  <textarea
                    value={editForm.bio || ""}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell the world about yourself"
                    rows={3}
                    maxLength={160}
                    className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
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

