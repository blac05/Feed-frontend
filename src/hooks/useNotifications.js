import { useEffect } from "react";
import socket from "./useSocket";

export default function useNotifications(
  callback
) {
  useEffect(() => {
    socket.on(
      "notification",
      callback
    );

    return () => {
      socket.off(
        "notification",
        callback
      );
    };
  }, [callback]);
}