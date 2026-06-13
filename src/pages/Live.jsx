import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import LiveChat from "../components/live/LiveChat";
import GiftPanel from "../components/live/GiftPanel";

export default function Live() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Gradient background with animated particles (optional for extra flair) */}
      <div className="relative min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 overflow-hidden">
        {/* Optional particles background can be added here for extra coolness */}

        <div className="max-w-7xl mx-auto p-4 lg:p-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video stream area with notification badge */}
            <div className="lg:col-span-2 relative">
              <div className="h-[600px] rounded-2xl bg-gray-900 shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl relative">
                {loading ? (
                  // Skeleton loader
                  <div className="animate-pulse h-full w-full bg-gray-700 rounded-2xl" />
                ) : (
                  // Actual video placeholder
                  <div className="h-full w-full flex items-center justify-center text-white text-xl font-semibold">
                    Live Stream
                  </div>
                )}
                {/* Live badge with pulsing animation */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse font-semibold shadow-lg">
                  Live
                </div>
              </div>
            </div>

            {/* Chat and Gift panels with entrance animation */}
            <div className="flex flex-col space-y-4 opacity-0 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-md p-4 transform transition-transform hover:scale-105">
                <LiveChat />
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 transform transition-transform hover:scale-105">
                <GiftPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}