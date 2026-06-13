import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function useNotifications(handler) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    // Socket or polling logic can be wired here later
  }, [user]);
}
