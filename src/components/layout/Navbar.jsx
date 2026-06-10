import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-4 md:px-6">
      
      {/* Mobile menu button */}
      <button
        aria-label="Toggle menu"
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onToggleSidebar}
      >
        {/* Hamburger icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo and title */}
      <Link to="/" className="flex items-center gap-3" aria-label="Home">
        <img src={logo} alt="Feed Logo" className="h-10 w-10" />
        <span className="text-2xl font-bold text-blue-600">Feed</span>
      </Link>

      {/* Search bar (hidden on small screens) */}
      <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-96">
        <Search size={18} aria-hidden="true" />
        <label htmlFor="search-input" className="sr-only">Search Feed</label>
        <input
          id="search-input"
          placeholder="Search Feed..."
          className="bg-transparent ml-2 outline-none w-full"
          aria-label="Search Feed"
        />
      </div>

      {/* Notifications icon */}
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="focus:outline-none hover:text-blue-600"
      >
        <Bell size={24} aria-hidden="true" />
      </Link>
    </header>
  );
}