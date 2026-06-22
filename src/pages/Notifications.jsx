import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Heart, MessageCircle, UserPlus, AtSign,
  CheckCheck, Trash2, Gift, Info
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

const iconMap = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  mention: { icon: AtSign, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  gift: { icon: Gift, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  system: { icon: Info, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-800" },
};

export default function Notifications() {
  const { notifications: liveNotifications, unreadCount: socketUnread, markAllRead: markSocketRead } = useSocket();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dbNotifications, setDbNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    loadNotifications();
    checkPushPermission();
  }, []);

  // Request push permission and show browser notifications for new socket events
  useEffect(() => {
    if (liveNotifications.length > 0 && pushEnabled) {
      const latest = liveNotifications[0];
      if (document.hidden && "Notification" in window && Notification.permission === "granted") {
        new Notification(`Feed — ${latest.user}`, {
          body: latest.text,
          icon: "/logo.png",
        });
      }
    }
  }, [liveNotifications]);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setDbNotifications(res.data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkPushPermission = () => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      toast({ message: "Push notifications not supported in this browser", type: "error" });
      return;
    }
    const permission = await Notification.requestPermission();
    setPushEnabled(permission === "granted");
    if (permission === "granted") {
      toast({ message: "Push notifications enabled! 🔔", type: "success" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setDbNotifications(prev => prev.map(n => ({ ...n, read: true })));
      markSocketRead();
      toast({ message: "All marked as read", type: "success" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id, isLive) => {
    if (isLive) {
      // handled by socket context
      return;
    }
    try {
      await api.delete(`/notifications/${id}`);
      setDbNotifications(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/notifications/clear-all");
      setDbNotifications([]);
      toast({ message: "All notifications cleared", type: "success" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = async (n) => {
    // Mark as read
    if (!n.read && n._id) {
      await api.put(`/notifications/${n._id}/read`).catch(() => {});
      setDbNotifications(prev => prev.map(notif => notif._id === n._id ? { ...notif, read: true } : notif));
    }
    // Navigate
    if (n.link) navigate(n.link);
    else if (n.postId) navigate(`/post/${n.postId}`);
  };

  // Merge live + DB notifications
  const allNotifications = [
    ...liveNotifications.map(n => ({ ...n, isLive: true })),
    ...dbNotifications,
  ];

  const totalUnread = socketUnread + dbNotifications.filter(n => !n.read).length;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!pushEnabled && (
              <button
                onClick={requestPushPermission}
                className="text-xs text-blue-500 font-medium hover:text-blue-700 transition"
              >
                Enable Push
              </button>
            )}
            {totalUnread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:text-blue-700 transition"
              >
                <CheckCheck size={15} /> All read
              </button>
            )}
            {allNotifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-gray-400 hover:text-red-500 transition"
                title="Clear all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {pushEnabled && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Push notifications active
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div>
        {loading ? (
          <div className="space-y-0">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-[#38444d] animate-pulse">
                <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400 text-lg">All caught up!</p>
            <p className="text-sm mt-1">When someone likes or comments, you'll see it here</p>
          </div>
        ) : (
          <AnimatePresence>
            {allNotifications.map((n, i) => {
              const type = n.type || "like";
              const config = iconMap[type] || iconMap.like;
              const IconComponent = config.icon;
              const isRead = n.read;
              const displayUser = n.user || n.sender?.username || n.sender?.name || "Someone";
              const displayAvatar = n.avatar || n.sender?.avatar ||
                `https://ui-avatars.com/api/?name=${displayUser}&background=2563eb&color=fff`;
              const displayText = n.text;
              const displayTime = n.time || (n.createdAt ? timeAgo(n.createdAt) : "");

              return (
                <motion.div
                  key={n._id || n.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => handleClick(n)}
                  className={`flex items-start gap-3 px-4 py-4 border-b border-gray-100 dark:border-[#38444d] transition cursor-pointer ${
                    !isRead
                      ? "bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      : "bg-white dark:bg-[#15202b] hover:bg-gray-50 dark:hover:bg-[#1e2732]"
                  }`}
                >
                  {/* Avatar + icon */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={displayAvatar}
                      className="w-11 h-11 rounded-full object-cover"
                      alt={displayUser}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${config.bg} border-2 border-white dark:border-[#15202b]`}>
                      <IconComponent size={10} className={config.color} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      <span className="font-bold">{displayUser}</span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">{displayText}</span>
                    </p>
                    <p className="text-xs text-blue-500 mt-0.5 font-medium">{displayTime}</p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(n._id || n.id, n.isLive); }}
                      className="text-gray-300 hover:text-red-400 transition p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
