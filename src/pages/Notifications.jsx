import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";

const mockNotifications = [
  { id: 1, type: "like", user: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", text: "liked your post", time: "2m ago", read: false },
  { id: 2, type: "comment", user: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=2", text: "commented on your photo", time: "15m ago", read: false },
  { id: 3, type: "follow", user: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=3", text: "started following you", time: "1h ago", read: true },
  { id: 4, type: "mention", user: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=4", text: "mentioned you in a post", time: "3h ago", read: true },
  { id: 5, type: "like", user: "James Lee", avatar: "https://i.pravatar.cc/150?img=5", text: "liked your comment", time: "5h ago", read: true },
];

const icons = {
  like: <Heart size={14} className="text-red-500" />,
  comment: <MessageCircle size={14} className="text-blue-500" />,
  follow: <UserPlus size={14} className="text-green-500" />,
  mention: <AtSign size={14} className="text-purple-500" />,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const remove = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
          {unread > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-blue-600 font-medium hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition ${
              n.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
            }`}
          >
            <div className="relative">
              <img src={n.avatar} className="w-11 h-11 rounded-full object-cover" alt={n.user} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                {icons[n.type]}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{n.user}</span> {n.text}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
            <button
              onClick={() => remove(n.id)}
              className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications yet</p>
        </div>
      )}
    </div>
  );
}