import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com",
      {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket", "polling"],
      }
    );

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join", user._id);
    });

    socket.on("notification", (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllRead = () => setUnreadCount(0);
  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      notifications,
      unreadCount,
      markAllRead,
      clearNotification,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);