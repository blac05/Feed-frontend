// Notifications.js
import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";

export default function Notifications() {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useNotifications((data) => {
    setNotifications((prev) => {
      // Add a unique ID to each notification for easier deletion
      const newNotifications = [...prev];
      newNotifications.push({ id: Date.now(), ...data });
      return newNotifications;
    });
  });

  // Filter out notifications older than 24 hours
  const filteredNotifications = notifications.filter(
    (notification) =>
      Date.now() - notification.timestamp <= 24 * 60 * 60 * 1000
  );

  return (
    <Layout>
      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h3 className="text-lg font-bold mb-2">
              {notification.title}
            </h3>
            <p className="text-gray-600">{notification.message}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}