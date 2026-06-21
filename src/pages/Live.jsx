import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Users, Heart, Gift, Send, X, Play,
  CheckCircle, Eye, Mic, MicOff, Video, VideoOff,
  ChevronLeft, BarChart2, Share2
} from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";

const badgeColor = {
  personal: "text-blue-500",
  creator: "text-purple-500",
  company: "text-blue-700",
  prominent: "text-yellow-500",
  popstar: "text-pink-500",
};

const GIFTS = [
  { id: "rose", emoji: "🌹", name: "Rose", coins: 1 },
  { id: "heart", emoji: "💝", name: "Heart", coins: 5 },
  { id: "star", emoji: "⭐", name: "Star", coins: 10 },
  { id: "crown", emoji: "👑", name: "Crown", coins: 50 },
  { id: "diamond", emoji: "💎", name: "Diamond", coins: 100 },
  { id: "rocket", emoji: "🚀", name: "Rocket", coins: 500 },
];

const CATEGORIES = ["Just Chatting", "Gaming", "Music", "Talk", "Sports", "Education", "Art", "Other"];

// Gift floating animation
function FloatingGift({ gift, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -120, scale: 1.5 }}
      transition={{ duration: 2, ease: "easeOut" }}
      onAnimationComplete={onDone}
      className="absolute bottom-20 right-8 text-4xl pointer-events-none z-30"
    >
      {gift.emoji}
    </motion.div>
  );
}

// Live chat component
function LiveChat({ roomId, streamId, socket, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [gifts, setGifts] = useState([]);
  const [showGifts, setShowGifts] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState([]);
  const chatRef = useRef();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    socket.on("live-comment", (data) => {
      setComments(prev => [...prev.slice(-99), data]);
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    });

    socket.on("live-gift", (data) => {
      setComments(prev => [...prev.slice(-99), {
        ...data,
        isGift: true,
        text: `sent ${data.gift.emoji} ${data.gift.name}!`,
      }]);
      setFloatingGifts(prev => [...prev, { ...data.gift, id: Date.now() }]);
    });

    socket.on("user-joined", (data) => {
      setComments(prev => [...prev.slice(-99), { ...data, isSystem: true }]);
    });

    return () => {
      socket.off("live-comment");
      socket.off("live-gift");
      socket.off("user-joined");
    };
  }, [socket]);

  const sendComment = () => {
    if (!text.trim() || !socket) return;
    socket.emit("live-comment", {
      roomId, text, streamId,
      username: user?.username,
      avatar: user?.avatar,
      userId: user?._id,
    });
    setText("");
  };

  const sendGift = (gift) => {
    if (!socket) return;
    socket.emit("live-gift", {
      roomId, gift, streamId,
      username: user?.username,
      userId: user?._id,
    });
    setShowGifts(false);
    toast({ message: `Sent ${gift.emoji} ${gift.name}!`, type: "success" });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Floating gifts */}
      <AnimatePresence>
        {floatingGifts.map(g => (
          <FloatingGift
            key={g.id}
            gift={g}
            onDone={() => setFloatingGifts(prev => prev.filter(x => x.id !== g.id))}
          />
        ))}
      </AnimatePresence>

      {/* Comments */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-2 p-3 scrollbar-hide"
      >
        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-xs text-center py-4">
            Be the first to comment!
          </p>
        )}
        {comments.map((c, i) => (
          <motion.div
            key={c.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 ${c.isSystem ? "justify-center" : ""}`}
          >
            {c.isSystem ? (
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#253341] px-3 py-1 rounded-full">
                {c.message}
              </span>
            ) : (
              <>
                <img
                  src={c.avatar || `https://ui-avatars.com/api/?name=${c.username}&background=2563eb&color=fff`}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                  alt="avatar"
                />
                <div className={`rounded-2xl px-3 py-1.5 max-w-xs ${
                  c.isGift
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                    : "bg-gray-100 dark:bg-[#253341]"
                }`}>
                  <span className={`text-xs font-bold ${c.isGift ? "text-white" : "text-blue-600"}`}>
                    {c.username}
                  </span>
                  <span className={`text-xs ml-1 ${c.isGift ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {c.text}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Gift panel */}
      <AnimatePresence>
        {showGifts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 dark:border-[#38444d] p-3 grid grid-cols-3 gap-2"
          >
            {GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => sendGift(gift)}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#253341] transition"
              >
                <span className="text-2xl">{gift.emoji}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{gift.name}</span>
                <span className="text-xs font-bold text-yellow-500">{gift.coins}🪙</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-[#38444d] p-3 flex gap-2">
        <button
          onClick={() => setShowGifts(!showGifts)}
          className={`p-2.5 rounded-xl transition flex-shrink-0 ${
            showGifts ? "bg-yellow-100 text-yellow-600" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-[#253341]"
          }`}
        >
          <Gift size={18} />
        </button>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendComment()}
          placeholder="Say something..."
          className="flex-1 bg-gray-100 dark:bg-[#253341] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendComment}
          disabled={!text.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// Stream card for discovery
function StreamCard({ stream, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="bg-white dark:bg-[#1e2732] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-100 dark:border-[#38444d]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
        {stream.thumbnail ? (
          <img src={stream.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio size={32} className="text-white/30" />
          </div>
        )}
        {/* LIVE badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
        {/* Viewer count */}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye size={11} /> {stream.viewerCount || 0}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={stream.host?.avatar || `https://ui-avatars.com/api/?name=${stream.host?.username}&background=2563eb&color=fff`}
            className="w-7 h-7 rounded-full object-cover"
            alt="host"
          />
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{stream.host?.name || stream.host?.username}</p>
            <p className="text-xs text-gray-400">@{stream.host?.username}</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{stream.title}</p>
        <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-[#253341] text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
          {stream.category}
        </span>
      </div>
    </motion.div>
  );
}

export default function Live() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [streams, setStreams] = useState([]);
  const [activeStream, setActiveStream] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveForm, setGoLiveForm] = useState({ title: "", description: "", category: "Just Chatting" });
  const [starting, setStarting] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [liveHearts, setLiveHearts] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchStreams();
    if (id) loadStream(id);
  }, [id]);

  // Socket connection for active stream
  useEffect(() => {
    if (!activeStream || !user) return;

    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      { auth: { token: localStorage.getItem("token") } }
    );

    const socket = socketRef.current;
    socket.on("connect", () => {
      socket.emit("join-live", {
        roomId: activeStream.roomName,
        streamId: activeStream._id,
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    });

    socket.on("viewer-count", ({ count }) => setViewerCount(count));
    socket.on("live-like", () => setLiveHearts(prev => prev + 1));
    socket.on("stream-ended", () => {
      toast({ message: "Stream has ended", type: "info" });
      setActiveStream(null);
    });

    // Join stream in backend
    api.get(`/live/join/${activeStream._id}`).catch(() => {});

    return () => {
      socket.emit("leave-live", { roomId: activeStream.roomName, username: user.username });
      api.put(`/live/leave/${activeStream._id}`).catch(() => {});
      socket.disconnect();
    };
  }, [activeStream?._id]);

  const fetchStreams = async () => {
    try {
      const res = await api.get("/live");
      setStreams(res.data.streams || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const loadStream = async (streamId) => {
    try {
      const res = await api.get(`/live/${streamId}`);
      setActiveStream(res.data.stream);
      setViewerCount(res.data.stream.viewerCount || 0);
    } catch (e) {
      toast({ message: "Stream not found", type: "error" });
    }
  };

  const startLive = async () => {
    if (!goLiveForm.title.trim()) {
      toast({ message: "Please add a title", type: "error" });
      return;
    }
    setStarting(true);
    try {
      const res = await api.post("/live/start", goLiveForm);
      setMyStream(res.data.stream);
      setActiveStream(res.data.stream);
      setShowGoLive(false);
      toast({ message: "You're live! 🔴", type: "success" });
    } catch (e) {
      toast({ message: "Failed to start stream", type: "error" });
    } finally {
      setStarting(false);
    }
  };

  const endLive = async () => {
    if (!myStream) return;
    try {
      await api.put(`/live/end/${myStream._id}`);
      setMyStream(null);
      setActiveStream(null);
      toast({ message: "Stream ended", type: "success" });
      fetchStreams();
    } catch (e) {
      toast({ message: "Failed to end stream", type: "error" });
    }
  };

  const sendHeart = () => {
    setLiveHearts(prev => prev + 1);
    if (socketRef.current && activeStream) {
      socketRef.current.emit("live-like", {
        roomId: activeStream.roomName,
        userId: user._id,
      });
    }
  };

  // Active stream view
  if (activeStream) {
    const isHost = activeStream.host?._id === user?._id || myStream?._id === activeStream._id;

    return (
      <div className="flex flex-col md:flex-row h-screen bg-black dark:bg-[#0d1117]">
        {/* Video area */}
        <div className="flex-1 relative min-h-[50vh] md:min-h-0">
          {/* Simulated stream */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <div className="text-center">
              {isHost ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Radio size={36} className="text-white" />
                  </div>
                  <p className="text-white font-bold text-xl">You're Live!</p>
                  <p className="text-gray-400 text-sm">Your audience can see you</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-4 border-red-600">
                    <img
                      src={activeStream.host?.avatar || `https://ui-avatars.com/api/?name=${activeStream.host?.username}&background=2563eb&color=fff`}
                      className="w-full h-full object-cover"
                      alt="host"
                    />
                  </div>
                  <p className="text-white font-bold">{activeStream.host?.name || activeStream.host?.username}</p>
                  <p className="text-gray-400 text-sm">is live</p>
                </div>
              )}
            </div>
          </div>

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStream(null)}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
              <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <Eye size={12} /> {viewerCount}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ message: "Link copied!", type: "success" }); }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <Share2 size={16} />
              </button>
              {isHost && (
                <button
                  onClick={endLive}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 transition"
                >
                  End Live
                </button>
              )}
            </div>
          </div>

          {/* Stream title */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={activeStream.host?.avatar || `https://ui-avatars.com/api/?name=${activeStream.host?.username}&background=2563eb&color=fff`}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                alt="host"
              />
              <span className="text-white font-bold text-sm">{activeStream.host?.username}</span>
            </div>
            <p className="text-white font-semibold">{activeStream.title}</p>
            <span className="text-xs text-gray-300 bg-black/40 px-2 py-0.5 rounded-full">{activeStream.category}</span>
          </div>

          {/* Heart button */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={sendHeart}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition"
            >
              <Heart size={22} className={liveHearts > 0 ? "fill-red-500 text-red-500" : ""} />
            </motion.button>
            {liveHearts > 0 && (
              <span className="text-white text-xs font-bold">{liveHearts}</span>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-full md:w-80 bg-white dark:bg-[#15202b] border-l border-gray-200 dark:border-[#38444d] flex flex-col h-[50vh] md:h-screen">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Live Chat</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users size={12} /> {viewerCount} watching
            </div>
          </div>

          <LiveChat
            roomId={activeStream.roomName}
            streamId={activeStream._id}
            socket={socketRef.current}
            user={user}
          />
        </div>
      </div>
    );
  }

  // Discovery view
  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={20} className="text-red-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Live</h1>
        </div>
        <button
          onClick={() => setShowGoLive(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition"
        >
          <Radio size={14} /> Go Live
        </button>
      </div>

      {/* Live streams grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-video animate-pulse" />
            ))}
          </div>
        ) : streams.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Radio size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">No live streams right now</p>
            <p className="text-sm mt-1">Be the first to go live!</p>
            <button
              onClick={() => setShowGoLive(true)}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition"
            >
              Start Streaming
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {streams.map(stream => (
              <StreamCard
                key={stream._id}
                stream={stream}
                onClick={() => setActiveStream(stream)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Go Live Modal */}
      <AnimatePresence>
        {showGoLive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-[#15202b] rounded-t-3xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white">Go Live</h2>
                </div>
                <button onClick={() => setShowGoLive(false)}>
                  <X size={22} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Stream Title *</label>
                  <input
                    value={goLiveForm.title}
                    onChange={e => setGoLiveForm({ ...goLiveForm, title: e.target.value })}
                    placeholder="What are you streaming today?"
                    className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setGoLiveForm({ ...goLiveForm, category: cat })}
                        className={`text-xs px-2 py-2 rounded-xl border transition ${
                          goLiveForm.category === cat
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600"
                            : "border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Description (optional)</label>
                  <textarea
                    value={goLiveForm.description}
                    onChange={e => setGoLiveForm({ ...goLiveForm, description: e.target.value })}
                    placeholder="Tell your audience what to expect..."
                    rows={2}
                    className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                </div>

                <button
                  onClick={startLive}
                  disabled={starting || !goLiveForm.title.trim()}
                  className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-red-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {starting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Starting...</>
                  ) : (
                    <><Radio size={18} /> Start Live Stream</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
