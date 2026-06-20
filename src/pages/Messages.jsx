import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, ArrowLeft, CheckCheck } from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Connect socket
  useEffect(() => {
    if (!user) return;
    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      { auth: { token: localStorage.getItem("token") }, transports: ["websocket", "polling"] }
    );
    return () => socketRef.current?.disconnect();
  }, [user]);

  // Load contacts from following list
  useEffect(() => {
    if (!user) return;
    api.get("/users/me").then(res => {
      // Load following as contacts
      const following = res.data.user?.following || [];
      if (following.length > 0) {
        Promise.all(following.slice(0, 10).map(id => api.get(`/users/${id}`)))
          .then(results => {
            setContacts(results.map(r => r.data.user).filter(Boolean));
          })
          .catch(() => {});
      }
    }).catch(() => {});
  }, [user]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("receive-dm", (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socketRef.current.on("user-typing", () => setTyping(true));
    socketRef.current.on("user-stop-typing", () => setTyping(false));
    return () => {
      socketRef.current?.off("receive-dm");
      socketRef.current?.off("user-typing");
      socketRef.current?.off("user-stop-typing");
    };
  }, [socketRef.current]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join DM room when active contact changes
  useEffect(() => {
    if (!activeContact || !user || !socketRef.current) return;
    socketRef.current.emit("join-dm", {
      userId: user._id,
      otherUserId: activeContact._id,
    });
    setMessages([]); // Clear messages when switching contacts
  }, [activeContact]);

  // Search users
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${searchQuery}`);
        setSearchResults(res.data.users || []);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const selectContact = (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);
    setSearchQuery("");
    setSearchResults([]);
    // Add to contacts if not already there
    if (!contacts.find(c => c._id === contact._id)) {
      setContacts(prev => [contact, ...prev]);
    }
  };

  const send = () => {
    if (!text.trim() || !activeContact) return;
    const msg = {
      id: Date.now(),
      senderId: user._id,
      text,
      senderAvatar: user.avatar,
      senderUsername: user.username,
      time: new Date().toISOString(),
    };
    socketRef.current?.emit("send-dm", {
      senderId: user._id,
      receiverId: activeContact._id,
      text,
      senderAvatar: user.avatar,
      senderUsername: user.username,
    });
    setMessages(prev => [...prev, msg]);
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socketRef.current?.emit("typing", { senderId: user._id, receiverId: activeContact?._id });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", { senderId: user._id, receiverId: activeContact?._id });
    }, 1500);
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const ChatArea = () => (
    <div className="flex-1 flex flex-col dark:bg-[#15202b]">
      {/* Chat Header */}
      {activeContact ? (
        <>
          <div className="px-4 py-3 border-b border-gray-100 dark:border-[#38444d] flex items-center gap-3 bg-white dark:bg-[#15202b]">
            <button
              onClick={() => setShowMobileChat(false)}
              className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e2732] transition"
            >
              <ArrowLeft size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            <img src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.username}&background=2563eb&color=fff`}
              className="w-9 h-9 rounded-full object-cover" alt={activeContact.username} />
            <div>
              <p className="font-bold text-sm text-gray-800 dark:text-white">{activeContact.name || activeContact.username}</p>
              {typing ? (
                <p className="text-xs text-blue-500">typing...</p>
              ) : (
                <p className="text-xs text-green-500">Online</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#15202b]">
            {messages.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">👋</div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">Say hello to {activeContact.name || activeContact.username}!</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user._id;
              return (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {!isMe && (
                    <img
                      src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.username}&background=2563eb&color=fff`}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      alt="avatar"
                    />
                  )}
                  <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 rounded-bl-sm"
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <p className="text-[10px] text-gray-400">{formatTime(msg.time)}</p>
                      {isMe && <CheckCheck size={12} className="text-blue-400" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-[#38444d] flex gap-3 bg-white dark:bg-[#15202b]">
            <input
              value={text}
              onChange={handleTyping}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Start a message..."
              className="flex-1 bg-gray-100 dark:bg-[#1e2732] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              className="bg-gradient-to-r from-sky-500 to-blue-700 text-white p-2.5 rounded-xl hover:brightness-110 transition disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:bg-[#15202b]">
          <div className="text-6xl mb-4">💬</div>
          <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">Your Messages</p>
          <p className="text-sm mt-1">Select a conversation or search for someone</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex dark:bg-[#15202b] overflow-hidden">
      {/* Sidebar — contacts */}
      <div className={`w-full md:w-80 border-r border-gray-100 dark:border-[#38444d] flex flex-col bg-white dark:bg-[#15202b] ${showMobileChat ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
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

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border-b border-gray-100 dark:border-[#38444d]">
            {searchResults.map(u => (
              <div
                key={u._id}
                onClick={() => selectContact(u)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1e2732] cursor-pointer transition"
              >
                <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                  className="w-10 h-10 rounded-full object-cover" alt={u.username} />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">{u.name || u.username}</p>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts List */}
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
                activeContact?._id === c._id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-[#1e2732]"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.username}&background=2563eb&color=fff`}
                  className="w-11 h-11 rounded-full object-cover" alt={c.username} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-[#15202b]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{c.name || c.username}</p>
                <p className="text-xs text-gray-400 truncate">@{c.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${showMobileChat ? "flex" : "hidden md:flex"} flex-col`}>
        <ChatArea />
      </div>
    </div>
  );
}
