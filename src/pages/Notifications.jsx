import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, CheckCheck } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const iconMap = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  mention: { icon: AtSign, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
};

const mockNotifications = [
  { id: 1, type: "like", user: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", text: "liked your post", time: "2m ago", read: false },
  { id: 2, type: "comment", user: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=2", text: 'commented: "This is amazing!"', time: "15m ago", read: false },
  { id: 3, type: "follow", user: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=3", text: "started following you", time: "1h ago", read: true },
  { id: 4, type: "mention", user: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=4", text: "mentioned you in a post", time: "3h ago", read: true },
  { id: 5, type: "like", user: "James Lee", avatar: "https://i.pravatar.cc/150?img=5", text: "liked your comment", time: "5h ago", read: true },
];

export default function Notifications() {
  const { notifications: liveNotifications, unreadCount, markAllRead, clearNotification } = useSocket();
  const [staticNotifs, setStaticNotifs] = useState(mockNotifications);

  // Combine live + static notifications
  const allNotifications = [...liveNotifications, ...staticNotifs];
  const totalUnread = unreadCount + staticNotifs.filter(n => !n.read).length;

  const markAllAsRead = () => {
    markAllRead();
    setStaticNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const remove = (id) => {
    clearNotification(id);
    setStaticNotifs(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen dark:bg-[#15202b]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#38444d] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          {totalUnread > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {totalUnread}
            </span>
          )}
        </div>
        {totalUnread > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-blue-500 text-sm font-medium hover:text-blue-700 transition"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div>
        <AnimatePresence>
          {allNotifications.map((n, i) => {
            const config = iconMap[n.type] || iconMap.like;
            const IconComponent = config.icon;
            return (
              <motion.div
                key={n.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-3 px-4 py-4 border-b border-gray-100 dark:border-[#38444d] hover:bg-gray-50 dark:hover:bg-[#1e2732] transition cursor-pointer ${
                  !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : "bg-white dark:bg-[#15202b]"
                }`}
              >
                {/* Avatar with icon overlay */}
                <div className="relative flex-shrink-0">
                  <img
                    src={n.avatar || `https://ui-avatars.com/api/?name=${n.user}&background=2563eb&color=fff`}
                    className="w-11 h-11 rounded-full object-cover"
                    alt={n.user}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${config.bg} border-2 border-white dark:border-[#15202b]`}>
                    <IconComponent size={12} className={config.color} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{n.user}</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{n.text}</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-0.5 font-medium">{n.time}</p>
                </div>

                {/* Unread dot + close */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                    className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {allNotifications.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold text-gray-600 dark:text-gray-400">No notifications yet</p>
            <p className="text-sm mt-1">When someone likes or comments, you'll see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}