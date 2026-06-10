import Layout from "../src/components/layout/Layout";
import { useState } from "react";

import useNotifications from "../hooks/useNotifications";

export default function Notifications() {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useNotifications(data => {
    setNotifications(prev => [
      data,
      ...prev,
    ]);
  });

  return (
    <Layout>
      <div className="space-y-3">
        {notifications.map(
          (notification, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow"
            >
              {notification.message}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}