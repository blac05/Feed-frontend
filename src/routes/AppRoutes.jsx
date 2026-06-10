import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";

import Stories from "../pages/Stories";
import Live from "../pages/Live";
import Events from "../pages/Events";

import Marketplace from "../pages/Marketplace";
import ProductDetails from "../pages/ProductDetails";
import CreatorStore from "../pages/CreatorStore";
import Checkout from "../pages/Checkout";

import ForYou from "../pages/ForYou";
import AIStudio from "../pages/AIStudio";

import Reels from "../pages/Reels";
import Messages from "../pages/Messages";

import Wallet from "../pages/Wallet";
import Withdraw from "../src/pages/Withdraw";
import Earnings from "../src/pages/Earnings";

import AdminDashboard from "../pages/AdminDashboard";
import Reports from "../pages/Reports";
import VerificationRequests from "../pages/VerificationRequests";
import PlatformAnalytics from "../pages/PlatformAnalytics";

import BusinessDashboard from "../pages/BusinessDashboard";
import AdsManager from "../pages/AdsManager";
import CampaignBuilder from "../pages/CampaignBuilder";
import Sponsorships from "../pages/Sponsorships";
import RevenueAnalytics from "../pages/RevenueAnalytics";

import Communities from "../pages/Communities";
import CommunityDetails from "../pages/CommunityDetails";

import AdminDashboard from "../pages/AdminDashboard";
import Reports from "../pages/Reports";
import VerificationRequests from "../pages/VerificationRequests";
import PlatformAnalytics from "../pages/PlatformAnalytics";

import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
  path="/admin"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/reports"
  element={<Reports />}
/>

<Route
  path="/admin/verifications"
  element={<VerificationRequests />}
/>

<Route
  path="/admin/analytics"
  element={<PlatformAnalytics />}
/>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Feed */}

      <Route
        path="/for-you"
        element={<ForYou />}
      />

      <Route
        path="/stories"
        element={<Stories />}
      />

      <Route
        path="/reels"
        element={<Reels />}
      />

      <Route
        path="/live"
        element={<Live />}
      />

      <Route
        path="/events"
        element={<Events />}
      />

      {/* User */}

      <Route
        path="/profile/:id"
        element={<Profile />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
        path="/messages"
        element={<Messages />}
      />

      {/* AI */}

      <Route
        path="/ai-studio"
        element={<AIStudio />}
      />

      {/* Marketplace */}

      <Route
        path="/marketplace"
        element={<Marketplace />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/store/:id"
        element={<CreatorStore />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      {/* Wallet */}

      <Route
        path="/wallet"
        element={<Wallet />}
      />

      <Route
        path="/withdraw"
        element={<Withdraw />}
      />

      <Route
        path="/earnings"
        element={<Earnings />}
      />

      {/* Business */}

      <Route
        path="/business"
        element={<BusinessDashboard />}
      />

      <Route
        path="/ads"
        element={<AdsManager />}
      />

      <Route
        path="/campaigns"
        element={<CampaignBuilder />}
      />

      <Route
        path="/sponsorships"
        element={<Sponsorships />}
      />

      <Route
        path="/revenue"
        element={<RevenueAnalytics />}
      />

      {/* Admin */}

      <Route
        path="/admin"
        element={
          user?.role === "admin"
            ? <AdminDashboard />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/admin/reports"
        element={
          user?.role === "admin"
            ? <Reports />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/admin/verifications"
        element={
          user?.role === "admin"
            ? <VerificationRequests />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/admin/analytics"
        element={
          user?.role === "admin"
            ? <PlatformAnalytics />
            : <Navigate to="/" />
        }
      />

      <Route
  path="/communities"
  element={<Communities />}
/>

<Route
  path="/community/:id"
  element={<CommunityDetails />}
/>

      {/* 404 */}

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">
              404 | Page Not Found
            </h1>
          </div>
        }
      />

    </Routes>
  );
}