import React from "react";
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

import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: <Home /> },
    { to: "/live", label: "Live", icon: <Radio /> },
    { to: "/stories", label: "Stories", icon: <Sparkles /> },
    { to: "/events", label: "Events", icon: <Calendar /> },
    { to: "/communities", label: "Communities", icon: <Users /> },
    { to: "/spaces", label: "Audio Spaces", icon: <Mic /> },
    { to: "/marketplace", label: "Marketplace", icon: <ShoppingBag /> },
    { to: "/wallet", label: "Wallet", icon: <Wallet /> },
    { to: "/notifications", label: "Notifications", icon: <Bell /> },
    { to: "/profile/me", label: "Profile", icon: <User /> },
    { to: "/settings", label: "Settings", icon: <Settings /> },
  ];

  return (
    // Show sidebar based on isOpen prop for mobile responsiveness
    <aside
      className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:static lg:inset-auto lg:translate-x-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar panel */}
      <div className="w-72 h-full bg-white shadow-lg p-5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Home"
            onClick={onClose} // Close sidebar on link click for mobile
          >
            <img src={logo} alt="Feed Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="font-bold text-2xl text-blue-600">Feed</h1>
              <p className="text-xs text-gray-500">Connect • Create • Earn</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-label={link.label}
              className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors ${
                location.pathname === link.to
                  ? "bg-slate-200 font-semibold"
                  : ""
              }`}
              onClick={onClose} // Close sidebar on link click (mobile)
            >
              {React.cloneElement(link.icon, { size: 20, "aria-hidden": true })}
              <span className="text-gray-700">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}