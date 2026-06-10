import {
  Home,
  Radio,
  Calendar,
  User,
  Bell,
  Settings,
  Users,
  Mic,
  ShoppingBag,
  Wallet,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 p-5 border-r bg-white h-screen sticky top-0">

      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-3 mb-10"
      >
        <img
          src={logo}
          alt="Feed"
          className="w-12 h-12 object-contain"
        />

        <div>
          <h1 className="font-bold text-2xl text-blue-600">
            Feed
          </h1>

          <p className="text-xs text-gray-500">
            Connect • Create • Earn
          </p>
        </div>
      </Link>

      {/* Navigation */}

      <nav className="flex flex-col gap-2">

        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Home />
          Home
        </Link>

        <Link
          to="/live"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Radio />
          Live
        </Link>

        <Link
          to="/stories"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Sparkles />
          Stories
        </Link>

        <Link
          to="/events"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Calendar />
          Events
        </Link>

        <Link
          to="/communities"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Users />
          Communities
        </Link>

        <Link
          to="/spaces"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Mic />
          Audio Spaces
        </Link>

        <Link
          to="/marketplace"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <ShoppingBag />
          Marketplace
        </Link>

        <Link
          to="/wallet"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Wallet />
          Wallet
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Bell />
          Notifications
        </Link>

        <Link
          to="/profile/me"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <User />
          Profile
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Settings />
          Settings
        </Link>

      </nav>

    </aside>
  );
}