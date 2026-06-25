import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Hand, Phone, Users, Plus,
  CheckCircle, X, Radio, Clock, Share2,
  Volume2, Settings
} from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const TOPICS = ["Tech", "Music", "Sports", "Business", "Education", "Entertainment", "Politics", "Health", "Other"];

const badgeColor = {
  personal: "text-blue-500", creator: "text-purple-500",
  company: "text-blue-700", prominent: "text-yellow-500", popstar: "text-pink-500",
};

// ── Space Card ──────────────────────────────────────────────
function SpaceCard({ space, onJoin }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e2732] border border-gray-100 dark:border-[#38444d] rounded-2xl p-4 hover:shadow-md transition cursor-pointer"
      onClick={() => onJoin(space)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-600 dark:text-green-400">LIVE</span>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-[#253341] px-2 py-0.5 rounded-full">
            {space.topic}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Users size={12} />
          {space.listeners?.length || 0}
        </div>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-3">
        {space.title}
      </h3>

      {/* Speakers row */}
      <div className="flex items-center gap-2 flex-wrap">
        {(space.speakers || []).slice(0, 4).map((speaker, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="relative">
              <img
                src={speaker.user?.avatar || `https://ui-avatars.com/api/?name=${speaker.user?.username}&background=7c3aed&color=fff`}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                alt={speaker.user?.username}
              />
              {!speaker.isMuted && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic size={8} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-500 truncate w-10 text-center">
              {speaker.user?.username}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">
          Hosted by @{space.host?.username}
        </p>
        <button
          onClick={e => { e.stopPropagation(); onJoin(space); }}
          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-purple-700 transition"
        >
          Join
        </button>
      </div>
    </motion.div>
  );
}

// ── Active Space Room ───────────────────────────────────────
function SpaceRoom({ space: initialSpace, onLeave, currentUser }) {
  const { toast } = useToast();
  const [space, setSpace] = useState(initialSpace);
  const [isMuted, setIsMuted] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [listeners, setListeners] = useState(initialSpace.listeners?.length || 0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  const isHost = space.host?._id === currentUser?._id;
  const isSpeaker = space.speakers?.some(s =>
    s.user?._id === currentUser?._id || s.user === currentUser?._id
  );

  useEffect(() => {
    // Connect to space socket
    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      { auth: { token: localStorage.getItem("token") } }
    );

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("space-join-room", {
        roomId: space.roomId,
        userId: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        role: isHost ? "host" : isSpeaker ? "speaker" : "listener",
      });
    });

    socket.on("space-listener-joined", ({ listenerCount }) => {
      setListeners(listenerCount);
    });

    socket.on("space-hand-raised", ({ userId, username, raised }) => {
      toast({ message: raised ? `${username} raised their hand ✋` : `${username} lowered their hand`, type: "info" });
      setSpace(prev => {
        const hands = prev.raisedHands || [];
        if (raised) return { ...prev, raisedHands: [...hands, { _id: userId, username }] };
        return { ...prev, raisedHands: hands.filter(h => h._id !== userId) };
      });
    });

    socket.on("space-ended", () => {
      toast({ message: "Space has ended", type: "info" });
      onLeave();
    });

    socket.on("space-speaker-muted", ({ userId, isMuted: muted }) => {
      setSpace(prev => ({
        ...prev,
        speakers: prev.speakers.map(s =>
          (s.user?._id === userId || s.user === userId) ? { ...s, isMuted: muted } : s
        ),
      }));
    });

    // WebRTC for speakers
    if (isSpeaker || isHost) {
      initAudio();
    }

    return () => {
      socket.emit("space-leave", { roomId: space.roomId, userId: currentUser._id });
      socket.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      // Mute by default
      stream.getAudioTracks().forEach(t => { t.enabled = false; });
    } catch (e) {
      toast({ message: "Microphone access denied", type: "error" });
    }
  };

  const toggleMute = async () => {
    if (!isSpeaker && !isHost) return;

    if (!localStreamRef.current) await initAudio();

    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !newMuted; });
    }

    socketRef.current?.emit("space-mute-toggle", {
      roomId: space.roomId,
      userId: currentUser._id,
      isMuted: newMuted,
    });
  };

  const toggleHand = async () => {
    try {
      const res = await api.post(`/spaces/${space._id}/raise-hand`);
      setHandRaised(res.data.raised);
    } catch (e) {
      toast({ message: "Failed to raise hand", type: "error" });
    }
  };

  const inviteSpeaker = async (userId) => {
    try {
      await api.post(`/spaces/${space._id}/invite-speaker`, { userId });
      toast({ message: "Speaker invited!", type: "success" });
    } catch (e) {
      toast({ message: "Failed to invite", type: "error" });
    }
  };

  const sendChat = () => {
    if (!chatText.trim()) return;
    const msg = {
      id: Date.now(),
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: chatText,
      time: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, msg]);
    socketRef.current?.emit("live-comment", {
      roomId: space.roomId,
      text: chatText,
      username: currentUser.username,
      avatar: currentUser.avatar,
    });
    setChatText("");
  };

  const handleEnd = async () => {
    try {
      await api.put(`/spaces/${space._id}/end`);
      onLeave();
    } catch (e) {
      toast({ message: "Failed to end space", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black dark:from-purple-950 dark:via-indigo-950 dark:to-black flex flex-col">
      {/* Header */}
      <div className="px-4 pt-safe pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold">LIVE SPACE</span>
            </div>
            <span className="text-white/60 text-xs flex items-center gap-1">
              <Users size={11} /> {listeners}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/space/${space._id}`);
                toast({ message: "Link copied!", type: "success" });
              }}
              className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition"
            >
              <Share2 size={16} />
            </button>
            {isHost && (
              <button
                onClick={handleEnd}
                className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 transition"
              >
                End Space
              </button>
            )}
            {!isHost && (
              <button
                onClick={onLeave}
                className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white/20 transition"
              >
                Leave
              </button>
            )}
          </div>
        </div>

        <h2 className="text-white font-extrabold text-lg leading-snug">{space.title}</h2>
        <p className="text-white/50 text-xs mt-0.5">{space.topic}</p>
      </div>

      {/* Speakers grid */}
      <div className="px-4 py-4 flex-shrink-0">
        <p className="text-white/60 text-xs font-bold uppercase tracking-wide mb-3">
          Speakers · {space.speakers?.length || 0}
        </p>
        <div className="grid grid-cols-4 gap-4">
          {(space.speakers || []).map((speaker, i) => {
            const isMe = speaker.user?._id === currentUser?._id;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full p-0.5 ${
                    !speaker.isMuted
                      ? "bg-gradient-to-tr from-green-400 to-emerald-500 shadow-lg shadow-green-500/30"
                      : "bg-white/20"
                  }`}>
                    <img
                      src={speaker.user?.avatar || `https://ui-avatars.com/api/?name=${speaker.user?.username}&background=7c3aed&color=fff`}
                      className="w-full h-full rounded-full object-cover"
                      alt={speaker.user?.username}
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-purple-900 ${
                    speaker.isMuted ? "bg-red-500" : "bg-green-500"
                  }`}>
                    {speaker.isMuted
                      ? <MicOff size={10} className="text-white" />
                      : <Mic size={10} className="text-white" />
                    }
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white text-xs font-semibold truncate max-w-[64px]">
                    {isMe ? "You" : speaker.user?.username}
                  </p>
                  {i === 0 && (
                    <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">Host</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Raised hands */}
      {(space.raisedHands?.length > 0) && (
        <div className="px-4 py-2">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wide mb-2">
            ✋ Raised Hands · {space.raisedHands.length}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {space.raisedHands.slice(0, 8).map((u, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="relative">
                  <img
                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=6b7280&color=fff`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400/50"
                    alt={u.username}
                  />
                </div>
                <p className="text-[9px] text-white/60 truncate max-w-[40px]">{u.username}</p>
                {isHost && (
                  <button
                    onClick={() => inviteSpeaker(u._id)}
                    className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full"
                  >
                    Invite
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listeners */}
      <div className="px-4 py-2">
        <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-1">
          Listeners · {listeners}
        </p>
      </div>

      {/* Chat */}
      <div className="flex-1 mx-4 mb-2 bg-white/5 rounded-2xl flex flex-col min-h-0 max-h-48 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.length === 0 && (
            <p className="text-white/30 text-xs text-center py-4">No messages yet</p>
          )}
          {chatMessages.map((msg, i) => (
            <div key={msg.id || i} className="flex items-start gap-2">
              <img
                src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.username}&background=7c3aed&color=fff`}
                className="w-5 h-5 rounded-full flex-shrink-0"
                alt={msg.username}
              />
              <p className="text-xs text-white/80">
                <span className="font-bold text-purple-300">{msg.username}: </span>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-2 border-t border-white/10">
          <input
            value={chatText}
            onChange={e => setChatText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendChat()}
            placeholder="Say something..."
            className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          />
          <button
            onClick={sendChat}
            disabled={!chatText.trim()}
            className="bg-purple-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-8 pt-2 flex items-center justify-center gap-6">
        {(isSpeaker || isHost) && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-full transition ${
              isMuted
                ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                : "bg-green-500/20 border-2 border-green-500/50 text-green-400"
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>
        )}

        {!isHost && !isSpeaker && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleHand}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-full transition ${
              handRaised
                ? "bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-400"
                : "bg-white/10 border-2 border-white/20 text-white/60"
            }`}
          >
            <Hand size={24} />
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onLeave}
          className="flex flex-col items-center gap-1.5 p-4 rounded-full bg-red-600 text-white"
        >
          <Phone size={24} />
        </motion.button>
      </div>
    </div>
  );
}

// ── Create Space Modal ──────────────────────────────────────
function CreateSpaceModal({ onClose, onCreate }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", description: "", topic: "Tech" });
  const [creating, setCreating] = useState(false);

  const submit = async () => {
    if (!form.title.trim()) { toast({ message: "Title is required", type: "error" }); return; }
    setCreating(true);
    try {
      const res = await api.post("/spaces", form);
      onCreate(res.data.space);
      onClose();
    } catch (e) {
      toast({ message: "Failed to create space", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-t-3xl w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Radio size={20} className="text-purple-400" />
            <h2 className="font-bold text-xl text-white">Start a Space</h2>
          </div>
          <button onClick={onClose}><X size={22} className="text-white/60" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-white/60 mb-1 block uppercase tracking-wide">Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What will you talk about?"
              className="w-full bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-wide">Topic</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, topic: t })}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    form.topic === t
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={creating || !form.title.trim()}
            className="w-full bg-purple-600 text-white py-3.5 rounded-2xl font-extrabold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {creating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Starting...</>
            ) : (
              <><Radio size={18} /> Start Space</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main AudioSpaces Page ───────────────────────────────────
export default function AudioSpaces() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);

  useEffect(() => {
    fetchSpaces();
    const interval = setInterval(fetchSpaces, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await api.get("/spaces");
      setSpaces(res.data.spaces || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const joinSpace = async (space) => {
    try {
      await api.post(`/spaces/${space._id}/join`);
      setActiveSpace(space);
    } catch (e) {
      toast({ message: "Failed to join space", type: "error" });
    }
  };

  if (activeSpace) {
    return (
      <SpaceRoom
        space={activeSpace}
        currentUser={user}
        onLeave={() => { setActiveSpace(null); fetchSpaces(); }}
      />
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Volume2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Spaces</h1>
            <p className="text-xs text-gray-400">Live audio conversations</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-700 transition"
        >
          <Plus size={15} /> Start Space
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Volume2 size={36} className="text-purple-500" />
            </div>
            <p className="font-extrabold text-gray-600 dark:text-gray-400 text-xl">No active Spaces</p>
            <p className="text-sm mt-2 mb-6">Start a live audio conversation with your followers</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition"
            >
              Start Your Space
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {spaces.map((space, i) => (
              <SpaceCard key={space._id || i} space={space} onJoin={joinSpace} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateSpaceModal
            onClose={() => setShowCreate(false)}
            onCreate={(space) => { setSpaces(prev => [space, ...prev]); setActiveSpace(space); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
