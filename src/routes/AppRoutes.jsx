import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Terminal, Home as HomeIcon, User, Wallet as WalletIcon, ShoppingBag, Radio } from "lucide-react";

import Landing from "../pages/Landing";
import AdminDashboard from "../pages/AdminDashboard";
import AdsManager from "../pages/AdsManager";
import AIStudio from "../pages/AIStudio";
import AudioSpaces from "../pages/AudioSpaces";
import BusinessDashboard from "../pages/BusinessDashboard";
import CampaignBuilder from "../pages/CampaignBuilder";
import Chat from "../pages/Chat";
import Checkout from "../pages/Checkout";
import Communities from "../pages/Communities";
import CommunityDetails from "../pages/CommunityDetails";
import CreatorDashboard from "../pages/CreatorDashboard";
import CreatorStore from "../pages/CreatorStore";
import Events from "../pages/Events";
import EventsHub from "../pages/EventsHub";
import Explore from "../pages/Explore";
import ForYou from "../pages/ForYou";
import GroupChat from "../pages/GroupChat";
import Home from "../pages/Home";
import Live from "../pages/Live";
import Login from "../pages/Login";
import Marketplace from "../pages/Marketplace";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";
import PlatformAnalytics from "../pages/PlatformAnalytics";
import PodcastPlayer from "../pages/PodcastPlayer";
import Podcasts from "../pages/Podcasts";
import ProductDetails from "../pages/ProductDetails";
import Profile from "../pages/Profile";
import Reels from "../pages/Reels";
import Register from "../pages/Register";
import Reports from "../pages/Reports";
import RevenueAnalytics from "../pages/RevenueAnalytics";
import Settings from "../pages/Settings";
import SpaceRoom from "../pages/SpaceRoom";
import Sponsorships from "../pages/Sponsorships";
import Stories from "../pages/Stories";
import TicketCheckout from "../pages/TicketCheckout";
import VerificationRequests from "../pages/VerificationRequests";
import VideoCall from "../pages/VideoCall";
import Wallet from "../pages/Wallet";
import PostDetail from "../pages/PostDetail";
import HashtagPage from "../pages/HashtagPage";
import Bookmarks from "../pages/Bookmarks";

// Global Command Palette Plugin for rapid dashboard switching
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    { name: "Go to Home Feed", url: "/home", icon: <HomeIcon size={16} /> },
    { name: "Open Creator Dashboard", url: "/creator-dashboard", icon: <Terminal size={16} /> },
    { name: "View Wallet & Balance", url: "/wallet", icon: <WalletIcon size={16} /> },
    { name: "Explore Marketplace", url: "/marketplace", icon: <ShoppingBag size={16} /> },
    { name: "Watch Live Streams", url: "/live", icon: <Radio size={16} /> },
    { name: "View Saved Bookmarks", url: "/bookmarks", icon: <User size={16} /> },
  ];

  const filtered = links.filter((link) =>
    link.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
      <div className="bg-white dark:bg-[#1e2732] border border-gray-100 dark:border-[#38444d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden m-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
          <Search className="text-gray-400" size={18} />
          <input
            autoFocus
            type="text"
            placeholder="Search pages and dashboards... (e.g., Wallet)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-[#15202b] text-gray-400 px-2 py-1 rounded">ESC</span>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No shortcuts found</p>
          ) : (
            filtered.map((link) => (
              <div
                key={link.url}
                onClick={() => {
                  navigate(link.url);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#253341] text-gray-700 dark:text-gray-300 transition text-sm font-medium"
              >
                {link.icon}
                {link.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <CommandPalette />
      <Routes>
        {/* Auth / Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Feed */}
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/for-you" element={<ForYou />} />

        {/* User */}
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/hashtag/:tag" element={<HashtagPage />} />
        <Route path="/bookmarks" element={<Bookmarks />} />

        {/* Content & Streaming */}
        <Route path="/live" element={<Live />} />
        <Route path="/live/:id" element={<Live />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/podcast/:id" element={<PodcastPlayer />} />
        <Route path="/audio-spaces" element={<AudioSpaces />} />
        <Route path="/space/:id" element={<SpaceRoom />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events-hub" element={<EventsHub />} />
        <Route path="/ticket-checkout" element={<TicketCheckout />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* General Access Routes */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/store/:creatorId" element={<CreatorStore />} />

        {/* Creator-Specific Scope Routes */}
        <Route path="/creator/:creatorId/product/:id" element={<ProductDetails />} />
        <Route path="/creator/:creatorId/store" element={<CreatorStore />} />

        {/* Creator Tools */}
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/creator-store" element={<CreatorStore />} />
        <Route path="/ai-studio" element={<AIStudio />} />
        <Route path="/sponsorships" element={<Sponsorships />} />

        {/* Wallet */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/revenue-analytics" element={<RevenueAnalytics />} />

        {/* Business */}
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/ads-manager" element={<AdsManager />} />
        <Route path="/campaign-builder" element={<CampaignBuilder />} />

        {/* Communities */}
        <Route path="/communities" element={<Communities />} />
        <Route path="/community/:id" element={<CommunityDetails />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/verifications" element={<VerificationRequests />} />
        <Route path="/admin/analytics" element={<PlatformAnalytics />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">404 | Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
