import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      }
    );

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("join", {
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    });

    // Notifications
    socket.on("notification", (data) => {
      setNotifications(prev => [{ ...data, id: data.id || Date.now() }, ...prev.slice(0, 49)]);
      setUnreadCount(prev => prev + 1);
    });

    // Online presence
    socket.on("online_users", (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on("user_online", ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socket.on("user_offline", ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected, will reconnect...");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const isOnline = useCallback((userId) => {
    return onlineUsers.has(userId?.toString());
  }, [onlineUsers]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      notifications,
      unreadCount,
      onlineUsers,
      isOnline,
      markAllRead,
      clearNotification,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
