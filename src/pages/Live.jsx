import { useEffect, useState } from "react";
import LiveChat from "../components/live/LiveChat";
import GiftPanel from "../components/live/GiftPanel";

export default function Live() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-500">Loading Live Stream...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-black relative">
        {/* Placeholder for live video stream */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl">Live Video Stream</div>
        </div>
      </div>
      <div className="w-full md:w-1/3 bg-gray-100 dark:bg-[#1e2732] p-4 flex flex-col">
        <LiveChat />
        <GiftPanel />
      </div>
    </div>
  );
  
}