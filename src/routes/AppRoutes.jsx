import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/for-you" element={<ForYou />} />

      {/* User Routes */}
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/group-chat" element={<GroupChat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/reels" element={<Reels />} />
      <Route path="/video-call" element={<VideoCall />} />

      {/* Content */}
      <Route path="/live" element={<Live />} />
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
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Creator */}
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
  );
}

export default AppRoutes;