import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Search, ArrowLeft, CheckCheck, Check,
  Image as ImageIcon, X, Reply, Trash2,
  Smile, MoreVertical
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../context/SocketContext";
import useUpload from "../hooks/useUpload";

const REACTIONS = ["❤️", "😂", "😮", "👍", "🔥", "😢"];

function MessageBubble({ msg, isMe, contact, onReact, onReply, onDelete, currentUserId }) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const actionRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (actionRef.current && !actionRef.current.contains(e.target)) {
        setShowActions(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (msg.deleted) {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
        <p className="text-xs text-gray-400 italic px-4 py-2 bg-gray-100 dark:bg-[#1e2732] rounded-2xl">
          🚫 Message deleted
        </p>
      </div>
    );
  }

  const myReaction = msg.reactions?.find(r => r.user === currentUserId || r.userId === currentUserId);

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2 mb-1 group`}
      ref={actionRef}
    >
      {!isMe && (
        <img
          src={contact?.avatar || `https://ui-avatars.com/api/?name=${contact?.username}&background=2563eb&color=fff`}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
          alt="avatar"
        />
      )}

      <div className={`relative max-w-xs lg:max-w-sm ${isMe ? "items-end" : "items-start"} flex flex-col`}>
        {/* Reply preview */}
        {msg.replyTo && (
          <div className={`text-xs px-3 py-1.5 rounded-xl mb-1 border-l-2 border-blue-400 bg-gray-100 dark:bg-[#253341] ${isMe ? "self-end" : "self-start"}`}>
            <p className="font-semibold text-blue-500 text-[10px]">{msg.replyTo?.sender?.name || msg.replyTo?.sender?.username || "Reply"}</p>
            <p className="text-gray-600 dark:text-gray-400 truncate">{msg.replyTo?.text || "📷 Image"}</p>
          </div>
        )}

        {/* Main bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isMe
              ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-bl-sm"
          }`}
        >
          {msg.image && (
            <img
              src={msg.image}
              className="rounded-xl max-w-full mb-1 cursor-pointer hover:opacity-90 transition"
              style={{ maxHeight: "200px", objectFit: "cover" }}
              alt="image"
              onClick={() => window.open(msg.image, "_blank")}
            />
          )}
          {msg.text && <p className="break-words leading-relaxed">{msg.text}</p>}
        </div>

        {/* Reactions display */}
        {msg.reactions?.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
            {Object.entries(
              msg.reactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(msg.id || msg._id, myReaction?.emoji === emoji ? null : emoji)}
                className={`text-xs px-1.5 py-0.5 rounded-full border transition ${
                  myReaction?.emoji === emoji
                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400"
                    : "bg-white dark:bg-[#253341] border-gray-200 dark:border-[#38444d]"
                }`}
              >
                {emoji} {count > 1 && count}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
          <p className="text-[10px] text-gray-400">
            {new Date(msg.time || msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
          {isMe && (
            msg.read
              ? <CheckCheck size={12} className="text-blue-400" title="Read" />
              : <Check size={12} className="text-gray-400" title="Sent" />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className={`flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition mb-2 ${isMe ? "order-first" : ""}`}>
        <div className="relative">
          <button
            onClick={() => { setShowReactions(r => !r); setShowActions(false); }}
            className="w-6 h-6 bg-gray-100 dark:bg-[#1e2732] rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-[#253341] transition"
          >
            <Smile size={12} />
          </button>

          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${isMe ? "right-8" : "left-8"} bottom-0 z-20 bg-white dark:bg-[#1e2732] rounded-full shadow-xl border border-gray-100 dark:border-[#38444d] px-2 py-1.5 flex gap-1`}
              >
                {REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => { onReact(msg.id || msg._id, myReaction?.emoji === emoji ? null : emoji); setShowReactions(false); }}
                    className="text-lg hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onReply(msg)}
          className="w-6 h-6 bg-gray-100 dark:bg-[#1e2732] rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-[#253341] transition"
        >
          <Reply size={12} />
        </button>

        {isMe && (
          <button
            onClick={() => onDelete(msg.id || msg._id)}
            className="w-6 h-6 bg-gray-100 dark:bg-[#1e2732] rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOnline, socket: globalSocket } = useSocket();
  const { uploadImage, uploading: uploadingImg, progress } = useUpload();

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [msgSearchResults, setMsgSearchResults] = useState([]);
  const [showMsgSearch, setShowMsgSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const imageInputRef = useRef();

  // Own socket for DMs (separate from global)
  useEffect(() => {
    if (!user) return;
    const { io } = require("socket.io-client");
    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      { auth: { token: localStorage.getItem("token") }, transports: ["websocket", "polling"] }
    );
    return () => socketRef.current?.disconnect();
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("receive-dm", (msg) => {
      setMessages(prev => {
        const exists = prev.find(m => m.id === msg.id || m.tempId === msg.tempId);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socket.on("user-typing", () => setTyping(true));
    socket.on("user-stop-typing", () => setTyping(false));

    socket.on("message-reaction", ({ messageId, reactions }) => {
      setMessages(prev => prev.map(m =>
        (m.id === messageId || m._id === messageId) ? { ...m, reactions } : m
      ));
    });

    socket.on("message-deleted", ({ messageId }) => {
      setMessages(prev => prev.map(m =>
        (m.id === messageId || m._id === messageId) ? { ...m, deleted: true, text: "", image: "" } : m
      ));
    });

    socket.on("messages-read", ({ by }) => {
      if (activeContact?._id === by || activeContact?._id?.toString() === by?.toString()) {
        setMessages(prev => prev.map(m => m.senderId === user._id ? { ...m, read: true } : m));
      }
    });

    return () => {
      socket.off("receive-dm");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("message-reaction");
      socket.off("message-deleted");
      socket.off("messages-read");
    };
  }, [socketRef.current, activeContact?._id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join DM room + load persisted messages
  useEffect(() => {
    if (!activeContact || !user) return;
    socketRef.current?.emit("join-dm", { userId: user._id, otherUserId: activeContact._id });

    // Load from DB
    setLoadingMessages(true);
    api.get(`/messages/${activeContact._id}`)
      .then(res => {
        const dbMsgs = (res.data.messages || []).map(m => ({
          id: m._id,
          _id: m._id,
          senderId: m.sender?._id || m.sender,
          receiverId: m.receiver?._id || m.receiver,
          text: m.text,
          image: m.image,
          replyTo: m.replyTo,
          reactions: m.reactions || [],
          read: m.read,
          deleted: m.deleted,
          time: m.createdAt,
          senderUsername: m.sender?.username,
          senderAvatar: m.sender?.avatar,
        }));
        setMessages(dbMsgs);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [activeContact?._id]);

  // Load contacts
  useEffect(() => {
    if (!user) return;
    api.get("/users/me").then(res => {
      const following = res.data.user?.following || [];
      if (following.length > 0) {
        Promise.all(following.slice(0, 15).map(id =>
          api.get(`/users/${id}`).catch(() => null)
        ))
          .then(results => setContacts(results.map(r => r?.data?.user).filter(Boolean)));
      }
    }).catch(() => {});
  }, [user]);

  // User search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${searchQuery}`);
        setSearchResults(res.data.users || []);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Message search
  useEffect(() => {
    if (!msgSearch.trim() || !activeContact) { setMsgSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/messages/search?userId=${activeContact._id}&q=${encodeURIComponent(msgSearch)}`);
        setMsgSearchResults(res.data.messages || []);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(t);
  }, [msgSearch, activeContact?._id]);

  const selectContact = (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);
    setSearchQuery("");
    setSearchResults([]);
    setReplyTo(null);
    if (!contacts.find(c => c._id === contact._id)) {
      setContacts(prev => [contact, ...prev]);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const send = async () => {
    if ((!text.trim() && !imageFile) || !activeContact) return;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, { compress: true, maxWidth: 800 });
      if (!imageUrl) { toast({ message: "Image upload failed", type: "error" }); return; }
    }

    const tempId = `temp_${Date.now()}`;
    const msg = {
      id: tempId,
      tempId,
      senderId: user._id,
      receiverId: activeContact._id,
      text: text.trim(),
      image: imageUrl || "",
      replyTo: replyTo || null,
      senderAvatar: user.avatar,
      senderUsername: user.username,
      time: new Date().toISOString(),
      read: false,
      reactions: [],
    };

    // Optimistic add
    setMessages(prev => [...prev, msg]);
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setReplyTo(null);

    // Emit socket
    socketRef.current?.emit("send-dm", {
      tempId,
      senderId: user._id,
      receiverId: activeContact._id,
      text: msg.text,
      image: imageUrl || "",
      senderAvatar: user.avatar,
      senderUsername: user.username,
      replyTo: replyTo?._id || replyTo?.id || null,
    });

    // Persist to DB
    api.post("/messages", {
      receiverId: activeContact._id,
      text: msg.text,
      image: imageUrl || "",
      replyToId: replyTo?._id || replyTo?.id || null,
    }).catch(() => {});
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socketRef.current?.emit("typing", { senderId: user._id, receiverId: activeContact?._id });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", { senderId: user._id, receiverId: activeContact?._id });
    }, 1500);
  };

  const handleReact = (messageId, emoji) => {
    const convId = [user._id, activeContact._id].sort().join("-");
    socketRef.current?.emit("dm-reaction", { messageId, emoji, userId: user._id, conversationId: convId });
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId && m._id !== messageId) return m;
      const reactions = (m.reactions || []).filter(r => r.user !== user._id && r.userId !== user._id);
      if (emoji) reactions.push({ user: user._id, emoji });
      return { ...m, reactions };
    }));
    // Persist
    api.post(`/messages/${messageId}/react`, { emoji }).catch(() => {});
  };

  const handleDelete = (messageId) => {
    const convId = [user._id, activeContact._id].sort().join("-");
    socketRef.current?.emit("dm-delete", { messageId, conversationId: convId });
    setMessages(prev => prev.map(m =>
      (m.id === messageId || m._id === messageId)
        ? { ...m, deleted: true, text: "", image: "" }
        : m
    ));
    api.delete(`/messages/${messageId}`).catch(() => {});
  };

  const displayMessages = showMsgSearch && msgSearch
    ? msgSearchResults.map(m => ({
        id: m._id, _id: m._id,
        senderId: m.sender?._id || m.sender,
        text: m.text, image: m.image,
        replyTo: m.replyTo, reactions: m.reactions || [],
        read: m.read, deleted: m.deleted, time: m.createdAt,
      }))
    : messages;

  return (
    <div className="h-screen flex dark:bg-[#15202b] overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-gray-100 dark:border-[#38444d] flex flex-col bg-white dark:bg-[#15202b] ${showMobileChat ? "hidden md:flex" : "flex"}`}>
        <div className="px-4 py-4 border-b border-gray-100 dark:border-[#38444d]">
          <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="border-b border-gray-100 dark:border-[#38444d] max-h-52 overflow-y-auto">
            {searchResults.map(u => (
              <div
                key={u._id}
                onClick={() => selectContact(u)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1e2732] cursor-pointer transition"
              >
                <div className="relative flex-shrink-0">
                  <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                    className="w-10 h-10 rounded-full object-cover" alt={u.username} />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#15202b] ${isOnline(u._id) ? "bg-green-400" : "bg-gray-300 dark:bg-gray-600"}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{u.name || u.username}</p>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 && !searchQuery && (
            <div className="text-center py-12 text-gray-400 px-4">
              <p className="font-semibold text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Search for people to message</p>
            </div>
          )}
          {contacts.map(c => (
            <div
              key={c._id}
              onClick={() => selectContact(c)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                activeContact?._id === c._id ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-[#1e2732]"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.username}&background=2563eb&color=fff`}
                  className="w-11 h-11 rounded-full object-cover" alt={c.username} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#15202b] ${isOnline(c._id) ? "bg-green-400" : "bg-gray-300 dark:bg-gray-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{c.name || c.username}</p>
                <p className="text-xs text-gray-400">@{c.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 ${showMobileChat ? "flex" : "hidden md:flex"} flex-col dark:bg-[#15202b]`}>
        {activeContact ? (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex items-center gap-3 bg-white dark:bg-[#15202b]">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition"
              >
                <ArrowLeft size={18} className="text-gray-600 dark:text-gray-300" />
              </button>

              <div className="relative flex-shrink-0">
                <img
                  src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.username}&background=2563eb&color=fff`}
                  className="w-9 h-9 rounded-full object-cover"
                  alt={activeContact.username}
                />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#15202b] ${isOnline(activeContact._id) ? "bg-green-400" : "bg-gray-300 dark:bg-gray-600"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800 dark:text-white">{activeContact.name || activeContact.username}</p>
                {typing ? (
                  <p className="text-xs text-blue-500 animate-pulse">typing...</p>
                ) : isOnline(activeContact._id) ? (
                  <p className="text-xs text-green-500 font-medium">Online</p>
                ) : (
                  <p className="text-xs text-gray-400">Offline</p>
                )}
              </div>

              {/* Search messages toggle */}
              <button
                onClick={() => setShowMsgSearch(s => !s)}
                className={`p-2 rounded-full transition ${showMsgSearch ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e2732]"}`}
              >
                <Search size={16} />
              </button>
            </div>

            {/* Message search */}
            <AnimatePresence>
              {showMsgSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-gray-100 dark:border-[#38444d] bg-white dark:bg-[#15202b]"
                >
                  <div className="px-4 py-2 relative">
                    <Search size={14} className="absolute left-7 top-3.5 text-gray-400" />
                    <input
                      value={msgSearch}
                      onChange={e => setMsgSearch(e.target.value)}
                      placeholder="Search messages..."
                      className="w-full pl-9 pr-8 py-2 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-2xl text-sm focus:outline-none"
                      autoFocus
                    />
                    {msgSearch && (
                      <button onClick={() => setMsgSearch("")} className="absolute right-7 top-3.5 text-gray-400">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {msgSearch && (
                    <p className="px-4 pb-2 text-xs text-gray-400">
                      {msgSearchResults.length} results
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-white dark:bg-[#15202b]">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : displayMessages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">👋</div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">
                    {msgSearch ? "No messages found" : `Say hello to ${activeContact.name || activeContact.username}!`}
                  </p>
                </div>
              ) : (
                displayMessages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id || msg._id || i}
                    msg={msg}
                    isMe={msg.senderId === user._id || msg.senderId?.toString() === user._id?.toString()}
                    contact={activeContact}
                    onReact={handleReact}
                    onReply={setReplyTo}
                    onDelete={handleDelete}
                    currentUserId={user._id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply preview */}
            <AnimatePresence>
              {replyTo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 border-t border-gray-100 dark:border-[#38444d] bg-gray-50 dark:bg-[#1e2732] flex items-center gap-3"
                >
                  <div className="flex-1 border-l-2 border-blue-500 pl-3">
                    <p className="text-xs font-bold text-blue-500">
                      {replyTo.senderId === user._id ? "You" : activeContact.username}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {replyTo.text || "📷 Image"}
                    </p>
                  </div>
                  <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 border-t border-gray-100 dark:border-[#38444d] bg-white dark:bg-[#15202b]"
                >
                  <div className="relative inline-block">
                    <img src={imagePreview} className="h-20 rounded-xl object-cover" alt="preview" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  {uploadingImg && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-blue-600 h-1 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-[#38444d] flex gap-3 items-end bg-white dark:bg-[#15202b]">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e2732] transition"
              >
                <ImageIcon size={18} />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

              <input
                value={text}
                onChange={handleTyping}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Start a message..."
                className="flex-1 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <button
                onClick={send}
                disabled={(!text.trim() && !imageFile) || uploadingImg}
                className="bg-gradient-to-r from-sky-500 to-blue-700 text-white p-2.5 rounded-xl hover:brightness-110 transition disabled:opacity-40 flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">Your Messages</p>
            <p className="text-sm mt-1">Select a conversation or search for someone</p>
          </div>
        )}
      </div>
    </div>
  );
}
