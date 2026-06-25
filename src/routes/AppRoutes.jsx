import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { 
  Search, 
  Home as HomeIcon, 
  Wallet as WalletIcon, 
  ShoppingBag, 
  Radio, 
  BarChart2, 
  Newspaper as NewspaperIcon,
  Volume2,
  Flame 
} from "lucide-react";

// Auth
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";

// Core pages
import Home from "../pages/Home";
import Headlines from "../pages/Headlines";
import Explore from "../pages/Explore";
import Profile from "../pages/Profile";
import PostDetail from "../pages/PostDetail"; // Added missing import statement to resolve runtime error
import HashtagPage from "../pages/HashtagPage";
import Bookmarks from "../pages/Bookmarks";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Messages from "../pages/Messages";
import Reels from "../pages/Reels";

// Features
import Live from "../pages/Live";
import Events from "../pages/Events";
import Marketplace from "../pages/Marketplace";
import ProductDetails from "../pages/ProductDetails";
import Communities from "../pages/Communities";
import CommunityDetails from "../pages/CommunityDetails";
import Wallet from "../pages/Wallet";
import AdminDashboard from "../pages/AdminDashboard";
import CreatorDashboard from "../pages/CreatorDashboard";

// Coming soon stubs / Implementations
import ForYou from "../pages/ForYou";
import Chat from "../pages/Chat";
import GroupChat from "../pages/GroupChat";
import VideoCall from "../pages/VideoCall";
import Stories from "../pages/Stories";
import Podcasts from "../pages/Podcasts";
import PodcastPlayer from "../pages/PodcastPlayer";
import AudioSpaces from "../pages/AudioSpaces";
import EventsHub from "../pages/EventsHub";
import TicketCheckout from "../pages/TicketCheckout"; 
import Checkout from "../pages/Checkout";
import CreatorStore from "../pages/CreatorStore";
import Sponsorships from "../pages/Sponsorships";
import RevenueAnalytics from "../pages/RevenueAnalytics";
import BusinessDashboard from "../pages/BusinessDashboard";
import AdsManager from "../pages/AdsManager";
import CampaignBuilder from "../pages/CampaignBuilder";
import Reports from "../pages/Reports";
import VerificationRequests from "../pages/VerificationRequests";
import PlatformAnalytics from "../pages/PlatformAnalytics";
import ComingSoon from "../pages/ComingSoon";

// Command palette
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(p => !p); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const links = [
    { name: "Home Feed", url: "/home", icon: <HomeIcon size={15} /> },
    { name: "Headlines Feed", url: "/headlines", icon: <Flame size={15} /> },
    { name: "Audio Spaces", url: "/audio-spaces", icon: <Volume2 size={15} /> },
    { name: "Creator Dashboard", url: "/creator-dashboard", icon: <BarChart2 size={15} /> },
    { name: "Wallet & Balance", url: "/wallet", icon: <WalletIcon size={15} /> },
    { name: "Marketplace", url: "/marketplace", icon: <ShoppingBag size={15} /> },
    { name: "Live Streams", url: "/live", icon: <Radio size={15} /> },
    { name: "Bookmarks", url: "/bookmarks", icon: <Search size={15} /> },
    { name: "Explore", url: "/explore", icon: <Search size={15} /> },
    { name: "Settings", url: "/settings", icon: <Search size={15} /> },
  ];

  const filtered = links.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div
        className="bg-white dark:bg-[#1e2732] border border-gray-100 dark:border-[#38444d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#38444d]">
          <Search className="text-gray-400" size={18} />
          <input
            autoFocus
            type="text"
            placeholder="Search pages... (⌘K to toggle)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-[#15202b] text-gray-400 px-2 py-1 rounded cursor-pointer" onClick={() => setOpen(false)}>ESC</span>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No results</p>
          ) : (
            filtered.map(link => (
              <div
                key={link.url}
                onClick={() => { navigate(link.url); setOpen(false); setQuery(""); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#253341] text-gray-700 dark:text-gray-300 transition text-sm font-medium"
              >
                {link.icon}
                {link.name}
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-[#38444d]">
          <p className="text-xs text-gray-400">Press <kbd className="bg-gray-100 dark:bg-[#15202b] px-1.5 py-0.5 rounded text-[10px] font-bold">⌘K</kbd> to open anywhere</p>
        </div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <>
      <CommandPalette />
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Core */}
        <Route path="/home" element={<Home />} />
        <Route path="/headlines" element={<Headlines />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/hashtag/:tag" element={<HashtagPage />} />

        {/* Social */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/reels" element={<Reels />} />

        {/* Streaming */}
        <Route path="/live" element={<Live />} />
        <Route path="/live/:id" element={<Live />} />
        <Route path="/audio-spaces" element={<AudioSpaces />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events-hub" element={<EventsHub />} />
        <Route path="/ticket-checkout" element={<TicketCheckout />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/store/:creatorId" element={<CreatorStore />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Creator */}
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/creator-store" element={<CreatorStore />} />
        <Route path="/sponsorships" element={<Sponsorships />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/revenue-analytics" element={<RevenueAnalytics />} />
        <Route path="/ai-studio" element={<ComingSoon title="AI Studio" description="AI-powered content creation tools coming soon." />} />

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
        <Route path="*" element = {
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-[#15202b] gap-4">
            <p className="text-6xl font-extrabold text-blue-600">404</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">Page not found</p>
            <button onClick={() => window.history.back()} className="text-blue-500 hover:underline text-sm">
              Go back
            </button>
          </div>
        } />
      </Routes>
    </>
  );
}