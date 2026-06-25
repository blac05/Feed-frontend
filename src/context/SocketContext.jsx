import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const SocketContext = createContext({});

// ==========================================
// BACKGROUND PUSH SUBSCRIPTION UTILITIES
// ==========================================

/**
 * Communicates with the service worker registration layer to provision 
 * push channels against the VAPID keys fetched from the application backend.
 */
const subscribeToPush = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    
    // If the browser already holds a verified token map, immediately sync it to the backend database
    if (existingSubscription) {
      await api.post("/push/subscribe", existingSubscription.toJSON());
      return;
    }

    // Retrieve the unique server encryption key
    const { data } = await api.get("/push/vapid-key");
    if (!data?.publicKey) return;

    // Initialize raw handshake registration parameters
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    await api.post("/push/subscribe", newSubscription.toJSON());
  } catch (error) {
    console.error("Push operational subscription registration error:", error.message);
  }
};

/**
 * Utility helper to safely decode base64 strings into matching binary arrays 
 * required by native browser PushManager enrollment frameworks.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// ==========================================
// CONTEXT PROVIDER COMPONENT IMPLEMENTATION
// ==========================================

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [pushEnabled, setPushEnabled] = useState(false);
  const socketRef = useRef(null);

  // --- EFFECT 1: SOCKET CONNECTION LIFECYCLE MANAGEMENT ---
  useEffect(() => {
    if (!user?._id) return;

    // Extract root socket domain cleanly from api base string paths
    const socketTargetUrl = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "https://feed-er99.onrender.com";

    socketRef.current = io(socketTargetUrl, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("join", {
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    });

    // Real-Time System Notification Hub Listener
    socket.on("notification", (data) => {
      setNotifications(prev => [{ ...data, id: data.id || Date.now() }, ...prev.slice(0, 49)]);
      setUnreadCount(prev => prev + 1);

      // System Fallback: If user has tab hidden, fire a native browser operating system alert tray
      if (document.hidden && Notification.permission === "granted") {
        new Notification(`Feed — ${data.user || "Someone"}`, {
          body: data.text || "New activity",
          icon: "/logo.png",
        });
      }
    });

    // Buddy-List Online State Evaluators
    socket.on("online_users", (userIds) => setOnlineUsers(new Set(userIds)));
    
    socket.on("user_online", ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });
    
    socket.on("user_offline", ({ userId }) => {
      setOnlineUsers(prev => {
        const nextSet = new Set(prev);
        nextSet.delete(userId);
        return nextSet;
      });
    });

    socket.on("disconnect", () => console.log("Socket connection dropped. Retrying..."));
    socket.on("connect_error", (err) => console.error("Socket error context:", err.message));

    // Cleanup: Tear down open sockets safely when user profile instances unmount
    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  // --- EFFECT 2: AUTO-INITIALIZE SECURE PUSH REGISTRATIONS ---
  useEffect(() => {
    if (!user?._id) return;
    
    const isPushGranted = "Notification" in window && Notification.permission === "granted";
    setPushEnabled(isPushGranted);
    
    if (isPushGranted) {
      subscribeToPush();
    }
  }, [user?._id]);

  // ==========================================
  // EXPORTED COMPONENT MEMOIZED CALLBACKS
  // ==========================================

  // Interactive UI Opt-In request trigger for push permissions
  const requestPush = useCallback(async () => {
    if (!("Notification" in window)) return false;
    
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPushEnabled(true);
      await subscribeToPush();
      return true;
    }
    return false;
  }, []);

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
      pushEnabled,
      isOnline,
      markAllRead,
      clearNotification,
      requestPush,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
