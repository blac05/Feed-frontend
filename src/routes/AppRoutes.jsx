import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Search, Terminal, Home as HomeIcon, User, Wallet as WalletIcon, ShoppingBag, Radio } from "lucide-react";

// Auth / Recovery & Basic Vectors
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";

// Feed & Profile Navigation
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import ForYou from "../pages/ForYou";
import Profile from "../pages/Profile";
import PostDetail from "../pages/PostDetail";
import HashtagPage from "../pages/HashtagPage";
import Bookmarks from "../pages/Bookmarks";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

// Messaging & Core Social Systems
import Chat from "../pages/Chat";
import Messages from "../pages/Messages";
import GroupChat from "../pages/GroupChat";
import VideoCall from "../pages/VideoCall";
import Stories from "../pages/Stories";
import Reels from "../pages/Reels";

// Multi-Media, Streaming & Live Events
import Live from "../pages/Live";
import Podcasts from "../pages/Podcasts";
import PodcastPlayer from "../pages/PodcastPlayer";
import AudioSpaces from "../pages/AudioSpaces";
import SpaceRoom from "../pages/SpaceRoom";
import Events from "../pages/Events";
import EventsHub from "../pages/EventsHub";
import TicketCheckout from "../pages/TicketCheckout";

// Marketplace E-Commerce Core
import Marketplace from "../pages/Marketplace";
import ProductDetails from "../pages/ProductDetails";
import CreatorStore from "../pages/CreatorStore";
import Checkout from "../pages/Checkout";

// Creator Engine & Asset Toolkits
import CreatorDashboard from "../pages/CreatorDashboard";
import AIStudio from "../pages/AIStudio";
import Sponsorships from "../pages/Sponsorships";
import Wallet from "../pages/Wallet";
import RevenueAnalytics from "../pages/RevenueAnalytics";

// Commercial & Business Operations
import BusinessDashboard from "../pages/BusinessDashboard";
import AdsManager from "../pages/AdsManager";
import CampaignBuilder from "../pages/CampaignBuilder";
import Communities from "../pages/Communities";
import CommunityDetails from "../pages/CommunityDetails";

// Platform Oversight & Admin Controls
import AdminDashboard from "../pages/AdminDashboard";
import Reports from "../pages/Reports";
import VerificationRequests from "../pages/VerificationRequests";
import PlatformAnalytics from "../pages/PlatformAnalytics";

// ==========================================
// COMMAND PALETTE ENGINE CORE
// ==========================================
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

// ==========================================
// SYSTEM APPLICATION ROUTING TREE
// ==========================================
function AppRoutes() {
  return (
    <>
      <CommandPalette />
      <Routes>
        {/* Auth Lifecycle Vectors */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Global Consumption Feeds */}
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/for-you" element={<ForYou />} />

        {/* Dynamic Profiling & Personal Engine */}
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/hashtag/:tag" element={<HashtagPage />} />

        {/* Immersive Social Operations */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/reels" element={<Reels />} />

        {/* Content Streaming & Live Audio Arrays */}
        <Route path="/live" element={<Live />} />
        <Route path="/live/:id" element={<Live />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/podcast/:id" element={<PodcastPlayer />} />
        <Route path="/audio-spaces" element={<AudioSpaces />} />
        <Route path="/space/:id" element={<SpaceRoom />} />

        {/* Experiential & Ticketing Systems */}
        <Route path="/events" element={<Events />} />
        <Route path="/events-hub" element={<EventsHub />} />
        <Route path="/ticket-checkout" element={<TicketCheckout />} />

        {/* Distributed Marketplace Contexts */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/store/:creatorId" element={<CreatorStore />} />

        {/* Extended Vendor Overrides */}
        <Route path="/creator/:creatorId/product/:id" element={<ProductDetails />} />
        <Route path="/creator/:creatorId/store" element={<CreatorStore />} />

        {/* Advanced Creator Tooling */}
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/creator-store" element={<CreatorStore />} />
        <Route path="/ai-studio" element={<AIStudio />} />
        <Route path="/sponsorships" element={<Sponsorships />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/revenue-analytics" element={<RevenueAnalytics />} />

        {/* Corporate Advertising Dashboards */}
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/ads-manager" element={<AdsManager />} />
        <Route path="/campaign-builder" element={<CampaignBuilder />} />

        {/* Community Hub Networks */}
        <Route path="/communities" element={<Communities />} />
        <Route path="/community/:id" element={<CommunityDetails />} />

        {/* High-Level Admin Moderation Console */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/verifications" element={<VerificationRequests />} />
        <Route path="/admin/analytics" element={<PlatformAnalytics />} />

        {/* Catch-All Error Redirection */}
        <Route
          path="*"
          element (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#15202b]">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">404 | Page Not Found</h1>
            </div>
          )
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
